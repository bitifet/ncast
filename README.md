# ncast

> Dynamic stream multiplexer by broadcasting over a network port.

[![NPM Version][npm-image]][npm-url]
[![npm dependents][depends-image]][depends-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![License][license-image]][license-url]

<!-- Hilighting fix: []() -->

## Usage

```sh
$ ncast --help

NAME
    cast — Dynamic stream multiplexer by broadcasting over a network port.

SYNOPSIS
    cast [modifiers...]

DESCRIPTION
    Listen to a network port (broadcast mode) and pipes standard input to every
    connected client or connect to that port (client mode) and pipes everything
    to standard output.

    If port is not open or is closed by the (cast -b) server, clients persist
    and reconnect as soon as server is available again. This way server process
    can be respawned as needed.

    The options are as follows:

    -b, --broadcast
        Broadcast mode: 

    -p <port>, --port <port>  (Default 2549)
        Port to listen / connect to.

    -h <host>, --host <host>  (Default 0.0.0.0)
        Host name or IP to listen / connect to.

    -s, --silent
        Silent mode
    
EXAMPLES
    cast -b
        Copy standard input to standard output (like GNU cat), but listens to
        0.0.0.0:2549. When a new client connects, start copying the output
        to that client too. Unlimited number of clients can connect
        concurrently.

    cast -b -s
        Like 'cast -b', but does not send anything to standard output.

    cast
        Connect and persist to 0.0.0.0:2549 and copy everything received to
        standard output.

    cast | grep 'error'
        Create another view showing only rows containing the word 'error'

    cast --silent
        Does not show anything, but can be useful to monitor server
        connection/disconnection watching reports on standard error.

COPYRIGHT
    Copyright © 2025 Joan Miquel Torres Rigo.  License GPLv3+: GNU GPL version
    3 or later <https://gnu.org/licenses/gpl.html>.
    This is free software: you are free to change and redistribute it.  There
    is NO WARRANTY, to the extent permitted by law.
       
```


[npm-image]: https://img.shields.io/npm/v/ncast.svg
[npm-url]: https://npmjs.org/package/ncast
[depends-image]: https://badgen.net/npm/dependents/ncast
[depends-url]: https://www.npmjs.com/package/ncast?activeTab=dependents
[downloads-image]: https://img.shields.io/npm/dm/ncast.svg
[downloads-url]: https://npmjs.org/package/ncast
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[license-url]: https://opensource.org/licenses/MIT

