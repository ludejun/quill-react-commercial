'use strict';

exports.exports = {};
var Delta = {
  get exports(){ return exports.exports; },
  set exports(v){ exports.exports = v; },
};

exports.__module = Delta;
