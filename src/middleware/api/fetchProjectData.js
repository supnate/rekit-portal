'use strict';

const _ = require('lodash');
const rekitCore = require('rekit-core');

const { refactor } = rekitCore;

function fetchProjectData() {
  const features = refactor.getFeatures();
  const data = features.map(f => (Object.assign({
    key: f,
    type: 'feature',
    name: _.flow(_.lowerCase, _.upperFirst)(f),
  }, refactor.getFeatureStructure(f))));

  data.forEach((f) => {
    f.components.forEach((item) => {
      item.deps = refactor.getDeps(item.file);
    });

    f.actions.forEach((item) => {
      item.deps = refactor.getDeps(item.file);
    });

    f.misc.forEach((item) => {
      if (!item.children && /\.js$/.test(item.file)) item.deps = refactor.getDeps(item.file);
    });
  });

  return data;
}

module.exports = fetchProjectData;
