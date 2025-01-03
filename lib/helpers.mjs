// lib/helpers.mjs
// ===============

import chalk from 'chalk';
import {readFileSync} from 'fs';
import path from 'path';

const DEFAULT_CFG = {
    port: 2549,
    host: '0.0.0.0',
    mode: 'client',
    silent: false,
};

const hasUnicode = !! (
    process.env.LC_ALL
    || process.env.LC_CTYPE
    || process.env.LANG
    || ""
).match(/UTF-?8$/i);

const banner = (
    hasUnicode ? "📢 [nCAST] 👉"
    : " [nCAST] :"
);


export const toStdout = str => process.stdout.write(`${str}`);

export const toStderr = str => process.stderr.write(`${banner} ${str}`);

function abort(message) {
    process.stderr.write(`${message}\n`);
    process.exit(1);
};


export const showVersion = () => {
    try {
        const pkgPath = path.join(import.meta.dirname, '../package.json');
        const {name, version, description} = JSON.parse(readFileSync(pkgPath));
        console.log(`${name} ${version} (${description})`);
    } catch (err) {
        const nodeVersion = Number(
            process.version
                .substring(1)
                .split(".")
                .slice(0,2)
                .join(".")
        );
        if (
            nodeVersion < 20.11
            || nodeVersion >= 21 && nodeVersion < 21.2
            // https://stackoverflow.com/a/3133313/4243912
        ) abort (
            `Unsupported node version (${nodeVersion}). Required >= 20.11 or >= 21.2.`
        );
        throw err; // Unexpected error
    };

};

export const showHelp = ({port, host} = DEFAULT_CFG) => {
    const b = s=>s.split(',').map(t=>chalk.bold(t)).join(','); // (Handy)
    const u = chalk.reset.underline;
    const ncast = b('ncast');
    const NAME = b('NAME');
    const SYNOPSIS = b('SYNOPSIS');
    const DESCRIPTION = b('DESCRIPTION');
    const EXAMPLES_BROADCAST = b('EXAMPLES (Broadcast mode)');
    const EXAMPLES_CLIENT = b('EXAMPLES (Client mode)');
    const COPYRIGHT = b('COPYRIGHT');

    console.log(`
${NAME}
    ${ncast} — Dynamic stream multiplexer by broadcasting over a network port.

${SYNOPSIS}
    ${ncast} [modifiers...]

${DESCRIPTION}
    Listen to a network port (broadcast mode) and pipes standard input to every
    connected client or connect to that port (client mode) and pipes everything
    to standard output.

    If port is not open or is closed by the (ncast -b) server, clients persist
    and reconnect as soon as server is available again. This way server process
    can be respawned as needed.

    The options are as follows:

    ${b('-b, --broadcast')}
        Broadcast mode. 

    ${b('-p '+u('<port>')+', --port '+u('<port>'))}  (Default ${port})
        Set network port to listen / connect to.

    ${b('-h '+u('<host>')+', --host '+u('<host>'))}  (Default ${host})
        Set host name or IP to listen / connect to.

    ${b('-s, --silent')}
        Enable silent mode.

    ${b('-v, --version')}
        Show version and exit.

    ${b('-h, --help')}
        Show this help message and exit.
    
${EXAMPLES_BROADCAST}
    find / 2>&1 | ncast -b > logfile.txt
        Copy standard input (standard output and error of 'find /' command) to
        standard output and then pipe it to 'logfile.txt'. But listens to
        ${host}:${port} and every time a new client connects, start copying the
        output to that client too. Unlimited number of clients can connect
        concurrently.

    find / | ncast -b --silent
        Like previous example, but does not send anything to standard output.
        Errors are locally shown (standard error is not captured).

${EXAMPLES_CLIENT}
    ncast
        Connect and persist to default host and port (${host}:${port}) and copy
        everything received to standard output.

    ncast | grep '^find:'
        Like previous example but show error messages only (since, in previous
        broadcast mode examples, they will start by "find:")

    ncast | awk '{ if ($1 == "find:") {sum += 1; print "Errors:", sum }}'
        Using awk to get a real time count of the errors.

    ncast | grep -v '^find:'
        Same logic from previous examples but showing non error messages only.

    ncast | grep '^/home'
        Show only routes under /home

    ncast --silent
        Does not show anything, but can be useful to monitor server
        connection/disconnection watching reports on standard error.

${COPYRIGHT}
    MIT License
    Copyright © 2025 Joan Miquel Torres Rigo <joanmi@gmail.com>

    This is free software: you are free to change and redistribute it.  There
    is NO WARRANTY, to the extent permitted by law.
`
    );
};


export function parseArgs(args) {

    const cfg = { ...DEFAULT_CFG };

    // Parameters:
    // -----------

    // -p --port        -- Set port
    args = args.filter((arg, i, a) => {
        if (! arg.match(/^(-p|--port)$/)) return true;
        const [portLiteral] = a.splice(i+1, 1); // Pick next
        cfg.port = Number(portLiteral);
        if (isNaN(cfg.port)) abort(
            `Invalid port number: ${portLiteral}` // (Show unparsed)
        );
        return false;
    });

    // -h --host        -- Set host
    args = args.filter((arg, i, a) => {
        if (! arg.match(/^(-h|--host)$/)) return true;
        if (arg == "-h" && i >= a.length - 1) return true; // Allow for '-h' as --help shorthand
        [cfg.host] = a.splice(i+1, 1); // Pick next
        if (! (cfg.host || "").match(/^[a-z0-9]/)) abort(
            `Invalid host name: ${cfg.host}`
        );
        return false;
    });

    // Flags:
    // ------

    // -b --broadcast   -- Broadcast mode
    args = args.filter(arg => {
        if (! arg.match(/^(-b|--broadcast)$/)) return true;
        cfg.mode = 'server';
        return false;
    });

    // -s --silent      -- Silent mode
    args = args.filter(arg => {
        if (! arg.match(/^(-s|--silent)$/)) return true;
        cfg.silent = true;
        return false;
    });

    // -v --version     -- Show version
    args = args.filter(arg => {
        if (! arg.match(/^(-v|--version)$/)) return true;
        cfg.mode = 'version';
        return false;
    });

    // -h --help        -- Show help message
    args = args.filter(arg => {
        if (! arg.match(/^(-h|--help)$/)) return true;
        cfg.mode = 'help';
        return false;
    });

    if (args.length) abort(
        `Unknown argument: ${args[0]}`
    )

    return cfg;

};


