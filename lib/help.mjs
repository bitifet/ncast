// lib/help.mjs
// ============

import defaults from "./defaults.mjs";
import chalk from 'chalk';

export default function showHelp({port, host} = defaults) {
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

    tail -F example.log | ncast -b --silent
        Like previous example, but monitoring existing log file. It uses
        --silent to prevent sending everything to standard output.

    tail -F example.log | ncast -b --host 0.0.0.0
        Broadcast to all network interfaces.

${EXAMPLES_CLIENT}
    ncast
        Connect and persist to default host and port (${host}:${port}) and copy
        everything received to standard output.

    ncast | grep -i '^error:'
        Like previous example but show only messages beginning with the text
        "error:" (case insensitive).

    ncast | grep -vi '^error:'
        Inverse of the previous case (text not beginning in "error").

    ncast | awk '{ if (tolower($1) == "error:") {sum += 1; print "Errors:", sum }}'
        Using awk to get a real time count.

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
