#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { version } = require('../package.json');

[
    { path: join(__dirname, '../dist/react-advertising.min.js'), versionInfo: `${version}/UMD` },
    { path: join(__dirname, '../dist/react-advertising.min.js.map'), versionInfo: `${version}/UMD` },
    { path: join(__dirname, '../lib/utils/logVersionInfo.js'), versionInfo: `${version}/CommonJS` },
    { path: join(__dirname, '../es/utils/logVersionInfo.js'), versionInfo: `${version}/ES` },
].forEach(({ path, versionInfo }) => {
    const data = readFileSync(path, 'utf-8');
    const nextData = data.replace(/REPLACE_ME_VERSION_INFO/gm, versionInfo);
    writeFileSync(path, nextData, 'utf-8');
});
