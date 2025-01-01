#!/usr/bin/env node
const net = require('net');
const readline = require('readline');
const banner = "📢 [CAST] 👉 ";

const DEFAULT_PORT = 2000;
const DEFAULT_HOST = '0.0.0.0';

class CastServer {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.clients = new Set();
    }

    start() {
        this.server = net.createServer((socket) => {
            process.stderr.write(`${banner}Client connected from ${socket.remoteAddress}:${socket.remotePort}\n`);
            this.clients.add(socket);

            socket.on('close', () => {
                process.stderr.write(`${banner}Client disconnected from ${socket.remoteAddress}:${socket.remotePort}\n`);
                this.clients.delete(socket);
            });

            socket.on('error', (err) => {
                process.stderr.write(`${banner}Socket error: ${err.message}\n`);
                this.clients.delete(socket);
            });
        });

        this.server.listen(this.port, this.host, () => {
            process.stderr.write(`${banner}Server listening on ${this.host}:${this.port}\n`);
        });

        this.server.on('error', (err) => {
            process.stderr.write(`${banner}Server error: ${err.message}\n`);
        });
    }

    end() {
        for (const cl of [...this.clients]) {
            cl.end();
        };
        this.server.close();
    }

    broadcast(message) {
        for (const client of this.clients) {
            if (!client.destroyed) {
                client.write(message);
            }
        }
    }
}

class CastClient {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.online = false;
    }

    connect() {
        const client = new net.Socket();

        client.connect(this.port, this.host, () => {
            this.online = true;
            process.stderr.write(`${banner}Connected to ${this.host}:${this.port}\n`);
        });

        client.on('data', (data) => {
            process.stdout.write(data.toString());
        });

        client.on('close', () => {
            client.end();
            if (this.online) {
                process.stderr.write(`${banner}Connection closed.\n`);
                process.stderr.write(`${banner}Waiting for socket availability...\n`);
                this.online = false;
            };
            setTimeout(() => this.connect(), 1000);
        });

        client.on('error', (err) => {
            if (this.online) {
                process.stderr.write(`${banner}Connection error: ${err.message}\n`);
            };
        });
    }
}

function main() {
    const args = process.argv.slice(2);
    let listenMode = false;
    let host = DEFAULT_HOST;
    let port = DEFAULT_PORT;

    for (const arg of args) {
        if (arg === '-l') {
            listenMode = true;
        } else if (arg.includes(':')) {
            [host, port] = arg.split(':');
            port = parseInt(port, 10);
        } else {
            port = parseInt(arg, 10) || DEFAULT_PORT;
        }
    }

    if (listenMode) {
        const server = new CastServer(host, port);
        server.start();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        });

        rl.on('line', (line) => {
            //console.log(line)
            server.broadcast(line + '\n');
        });

        rl.on('close', () => {
            process.stderr.write(`${banner}Shutting down server.\n`);
            server.server.close();
            process.exit(0);
        });

        process.on('SIGINT', () => {
            process.stderr.write(`\n${banner}Received SIGINT, shutting down server.\n`);
            server.end();
            process.exit(0);
        });
    } else {
        const client = new CastClient(host, port);
        client.connect();
    }
}

main();

