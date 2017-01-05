'use strict';

const core = require('rekit-core');

const refactor = core.refactor;
const vio = core.vio;
const utils = core.utils;

console.time('Done ');
const file = utils.mapFeatureFile('home', 'Navigator.js');
const deps = refactor.getDeps(file);

console.log('Deps: ');
console.log(deps);
console.timeEnd('Done ');
