'use strict';

exports.exports = {};
var eventemitter3 = {
  get exports(){ return exports.exports; },
  set exports(v){ exports.exports = v; },
};

exports.__module = eventemitter3;
