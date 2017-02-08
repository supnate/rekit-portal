'use strict';

// Summary:
//   Publish a clean package to npm.
//   Need to run 'npm run build -- --dist' first to build the dist package.
//   Need to edit build.js to remove next tag when publish a GA version.

const path = require('path');
const shell = require('shelljs');

const prjRoot = path.join(__dirname, '..');
const pkgJson = path.join(prjRoot, 'package.json');
const pkgJsonTmp = path.join(prjRoot, 'package.json.tmp');

const pkg = require(pkgJson); // eslint-disable-line

const pkgPublish = ['name', 'version', 'description', 'repository', 'keywords', 'files', 'dependencies', 'license']
  .reduce((prev, name) => Object.assign(prev, { [name]: pkg[name] }), {});

shell.mv(pkgJson, pkgJsonTmp);
shell.ShellString(JSON.stringify(pkgPublish, null, '  ')).to(pkgJson);
shell.exec('npm publish --tag next', { cwd: prjRoot });
shell.mv(pkgJsonTmp, pkgJson);
