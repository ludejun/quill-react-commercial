'use strict';

exports.exports = {};
var implementation = {
  get exports(){ return exports.exports; },
  set exports(v){ exports.exports = v; },
};

exports.__module = implementation;
