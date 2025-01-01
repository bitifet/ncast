// lib/helpers.mjs
// ===============

const banner = "📢 [CAST] 👉";

const DEFAULT_CFG = {
    port: 2000,
    host: '0.0.0.0',
    mode: 'client',
    silent: false,
};


export const toStdout = str => process.stdout.write(`${str}`);

export const toStderr = str => process.stderr.write(`${banner} ${str}`);

export function parseArgs(args) {

    const cfg = { ...DEFAULT_CFG };

    function abort(message) {
        process.stderr.write(`${message}\n`);
        process.exit(1);
    };

    // Parameters:
    // -----------

    // -p --port   -- Set port
    args = args.filter((arg, i, a) => {
        if (! arg.match(/^(-p|--port)$/)) return true;
        const [portLiteral] = a.splice(i+1, 1); // Pick next
        cfg.port = Number(portLiteral);
        if (isNaN(cfg.port)) abort(
            `Invalid port number: ${portLiteral}` // (Show unparsed)
        );
        return false;
    });

    // -h --host   -- Set host
    args = args.filter((arg, i, a) => {
        if (! arg.match(/^(-h|--host)$/)) return true;
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

    // -s --silent   -- Silent mode
    args = args.filter(arg => {
        if (! arg.match(/^(-s|--silent)$/)) return true;
        cfg.silent = true;
        return false;
    });

    if (args.length) abort(
        `Unknown argument: ${args[0]}`
    )

    return cfg;

};


