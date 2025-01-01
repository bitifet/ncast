#!/usr/bin/env node

import readline from 'readline';
import {parseArgs, toStderr} from './lib/helpers.mjs';
import {CastClient} from "./lib/client.mjs";
import {CastServer} from "./lib/server.mjs";

function main() {

    const {mode, ...cfg} = parseArgs(process.argv.slice(2));

    if (mode === 'server') {
        const server = new CastServer(cfg);
        server.start();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        });

        rl.on('line', (line) => {
            server.broadcast(line + '\n');
        });

        rl.on('close', () => {
            toStderr(`End of stream. Shutting down server.\n`);
            server.server.close();
            process.exit(0);
        });

        process.on('SIGINT', () => {
            process.stderr.write(`\nReceived SIGINT, shutting down server.\n`);
            server.end();
            process.exit(0);
        });

    } else {

        const client = new CastClient(cfg);
        client.connect();

    };

};

main();

