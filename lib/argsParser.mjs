// lib/argsParser.mjs
// ==================

import defaults from "./defaults.mjs";
import {abort} from "./helpers.mjs";

export default function parseArgs(args) {

    const cfg = { ...defaults };

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
