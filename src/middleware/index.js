'use strict';

const rekitCore = require('rekit-core');

function rekitMiddleware() {
  return (req, res, next) => {
    console.log('Time:', Date.now());
    next();
  };
}

module.exports = rekitMiddleware;
