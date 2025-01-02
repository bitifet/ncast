// lib/helpers.mjs
// ===============


import chalk from 'chalk';

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
    hasUnicode ? "📢 [CAST] 👉"
    : " [CAST] :"
);




export const toStdout = str => process.stdout.write(`${str}`);

export const toStderr = str => process.stderr.write(`${banner} ${str}`);


export const showHelp = ({port, host} = DEFAULT_CFG) => {
    const b = s=>s.split(',').map(t=>chalk.bold(t)).join(','); // (Handy)
    const u = chalk.reset.underline;
    const cast = b('cast');
    const NAME = b('NAME');
    const SYNOPSIS = b('SYNOPSIS');
    const DESCRIPTION = b('DESCRIPTION');
    const EXAMPLES = b('EXAMPLES');
    const COPYRIGHT = b('COPYRIGHT');

    console.log(`
${NAME}
    ${cast} — Dynamic stream multiplexer by broadcasting over a network port.

${SYNOPSIS}
    ${cast} [modifiers...]

${DESCRIPTION}
    Listen to a network port (broadcast mode) and pipes standard input to every
    connected client or connect to that port (client mode) and pipes everything
    to standard output.

    If port is not open or is closed by the (cast -b) server, clients persist
    and reconnect as soon as server is available again. This way server process
    can be respawned as needed.

    The options are as follows:

    ${b('-b, --broadcast')}
        Broadcast mode: 

    ${b('-p '+u('<port>')+', --port '+u('<port>'))}  (Default ${port})
        Port to listen / connect to.

    ${b('-h '+u('<host>')+', --host '+u('<host>'))}  (Default ${host})
        Host name or IP to listen / connect to.

    ${b('-s, --silent')}
        Silent mode
    
${EXAMPLES}
    cast -b
        Copy standard input to standard output (like GNU cat), but listens to
        ${host}:${port}. When a new client connects, start copying the output
        to that client too. Unlimited number of clients can connect
        concurrently.

    cast -b -s
        Like 'cast -b', but does not send anything to standard output.

    cast
        Connect and persist to ${host}:${port} and copy everything received to
        standard output.

    cast | grep 'error'
        Create another view showing only rows containing the word 'error'

    cast --silent
        Does not show anything, but can be useful to monitor server
        connection/disconnection watching reports on standard error.

${COPYRIGHT}
    Copyright © 2025 Joan Miquel Torres Rigo.  License GPLv3+: GNU GPL version
    3 or later <https://gnu.org/licenses/gpl.html>.
    This is free software: you are free to change and redistribute it.  There
    is NO WARRANTY, to the extent permitted by law.
       

`
    );
};


export function parseArgs(args) {

    const cfg = { ...DEFAULT_CFG };

    function abort(message) {
        process.stderr.write(`${message}\n`);
        process.exit(1);
    };

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


