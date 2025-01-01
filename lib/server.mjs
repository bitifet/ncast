// lib/server.mjs
// ==============

import net from 'net';
import {toStderr, toStdout} from './helpers.mjs';

export class CastServer {
    constructor(cfg) {
        this.cfg = cfg;
        this.clients = new Set();
    };

    start() {
        this.server = net.createServer((socket) => {
            toStderr(`Client connected from ${socket.remoteAddress}:${socket.remotePort}\n`);
            this.clients.add(socket);

            socket.on('close', () => {
                toStderr(`Client disconnected from ${socket.remoteAddress}:${socket.remotePort}\n`);
                this.clients.delete(socket);
            });

            socket.on('error', (err) => {
                toStderr(`Socket error: ${err.message}\n`);
                this.clients.delete(socket);
            });
        });

        this.server.listen(this.cfg.port, this.cfg.host, () => {
            toStderr(`Listening on ${this.cfg.host}:${this.cfg.port} for broadcast destinations\n`);
        });

        this.server.on('error', (err) => {
            toStderr(`Server error: ${err.message}\n`);
        });
    };

    end() {
        for (const cl of [...this.clients]) {
            cl.end();
        };
        this.server.close();
    };

    broadcast(message) {
        if (! this.cfg.silent) toStdout(message);
        for (const client of this.clients) {
            if (!client.destroyed) {
                client.write(message);
            }
        }
    };
};
