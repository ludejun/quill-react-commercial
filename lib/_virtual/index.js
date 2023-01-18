'use strict';

exports.exports = {};
var callBind = {
  get exports(){ return exports.exports; },
  set exports(v){ exports.exports = v; },
};

exports.__module = callBind;
