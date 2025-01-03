// lib/client.mjs
// ==============

import net from 'net';
import {toStderr, toStdout} from './helpers.mjs';

export default class CastClient {

    constructor(cfg) {
        this.cfg = cfg;
        this.online = false;
    };

    connect() {

        const client = new net.Socket();

        client.connect(this.cfg.port, this.cfg.host, () => {
            this.online = true;
            toStderr(`Connected to ${this.cfg.host}:${this.cfg.port}\n`);
        });

        client.on('data', (data) => {
            if (! this.cfg.silent) toStdout(data.toString());
        });

        client.on('close', () => {
            client.end();
            if (this.online) {
                toStderr(`Connection closed.\n`);
                toStderr(`Waiting for socket availability...\n`);
                this.online = false;
            };
            setTimeout(() => this.connect(), 1000);
        });

        client.on('error', (err) => {
            if (this.online) {
                toStderr(`Connection error: ${err.message}\n`);
            };
        });

    };

};
