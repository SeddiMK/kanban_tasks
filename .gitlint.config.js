//@ts-check

const fs = require("fs");

// console.log(process.argv);

// prepare-commit-msg | commit-msg
const message = fs.readFileSync('./.git/COMMIT_EDITMSG').toString();

// console.log(message);

const kinds = [
    'build',        // build config changes
    'chore',        // formatting, adding tests, cleaning useless code etc.. configs changes too
    'ci',           // deploy tunings (package.json etc)
    'docs',         // readme and jsdoc
    'feat',         // new feat
    'fix',          // fix feat
    'perf',         // perfomance optimization
    'refactor',     // renaming, moving code blocks etc
    'revert',       // /?
    'style',        // css style
    'test'          // tests
];

const colors = {
    red: '\x1b[31m',
    yellow: '\x1b[34m',
    reset: '\x1b[0m'
}

const isvalid = kinds.some(v => message.startsWith(v));     //  + ': '
// console.log(isvalid)

if (!isvalid) {

    console.warn(`\n>>> git commit name does not comply with convention:`);
    console.warn(`${colors.red}\ngit commit name does not comply with convention${colors.yellow}: ${message} ${colors.reset}`);
    process.exit(-1);
}
