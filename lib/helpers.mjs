// lib/helpers.mjs
// ===============

import {readFileSync} from 'fs';
import path from 'path';

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

export function abort(message) {
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
