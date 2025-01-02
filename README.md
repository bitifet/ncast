# ncast

Dynamic stream multiplexer by broadcasting over a network port.

[![NPM Version][npm-image]][npm-url]
[![npm dependents][depends-image]][depends-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![License][license-image]][license-url]

<!-- Hilighting fix: []() -->


## Setup


```sh
$ npm install -g ncast
```

> 💡 Alternatively, you can use `npx ncast` instead of `ncast` so that you
> don't even need to install it.


## Usage

```sh

NAME
    ncast — Dynamic stream multiplexer by broadcasting over a network port.

SYNOPSIS
    ncast [modifiers...]

DESCRIPTION
    Listen to a network port (broadcast mode) and pipes standard input to every
    connected client or connect to that port (client mode) and pipes everything
    to standard output.

    If port is not open or is closed by the (ncast -b) server, clients persist
    and reconnect as soon as server is available again. This way server process
    can be respawned as needed.

    The options are as follows:

    -b, --broadcast
        Broadcast mode. 

    -p <port>, --port <port>  (Default 2549)
        Set network port to listen / connect to.

    -h <host>, --host <host>  (Default 0.0.0.0)
        Set host name or IP to listen / connect to.

    -s, --silent
        Enable silent mode.

    -v, --version
        Show version and exit.

    -h, --help
        Show this help message and exit.
    
EXAMPLES (Broadcast mode)
    find / 2>&1 | ncast -b > logfile.txt
        Copy standard input (standard output and error of 'find /' command) to
        standard output and then pipe it to 'logfile.txt'. But listens to
        0.0.0.0:2549 and every time a new client connects, start copying the
        output to that client too. Unlimited number of clients can connect
        concurrently.

    find / | ncast -b --silent
        Like previous example, but does not send anything to standard output.
        Errors are locally shown (standard error is not captured).

EXAMPLES (Client mode)
    ncast
        Connect and persist to default host and port (0.0.0.0:2549) and copy
        everything received to standard output.

    ncast | grep '^find:'
        Like previous example but show error messages only (since, in previous
        broadcast mode examples, they will start by "find:")

    ncast | grep -v '^find:'
        Same logic from previous example but showing non error messages only.

    ncast | grep '^/home'
        Show only routes under /home

    ncast --silent
        Does not show anything, but can be useful to monitor server
        connection/disconnection watching reports on standard error.

COPYRIGHT
    MIT License
    Copyright © 2025 Joan Miquel Torres Rigo <joanmi@gmail.com>

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

