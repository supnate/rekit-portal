'use strict';

const _ = require('lodash');
const core = require('rekit-core');

const refactor = core.refactor;
const vio = core.vio;
const utils = core.utils;

console.time('Done ');
// const file = utils.mapFeatureFile('home', 'Navigator.js');
// const deps = refactor.getDeps(file);
const features = refactor.getFeatures();
const data = features.map(f => (Object.assign({
  key: f,
  name: _.flow(_.lowerCase, _.upperFirst)(f),
}, refactor.getFeatureStructure(f))));

data.forEach((f) => {
  f.components.forEach((item) => {
    item.deps = refactor.getDeps(item.file);
    // console.log('getting deps for ', item.name, item.deps);
  });

  f.actions.forEach((item) => {
    item.deps = refactor.getDeps(item.file);
  });

  f.misc.forEach((item) => {
    if (!item.children && /\.js$/.test(item.file)) item.deps = refactor.getDeps(item.file);
  });
});

console.log(JSON.stringify(data));

console.timeEnd('Done ');
