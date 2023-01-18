'use strict';

exports.exports = {};
var quill = {
  get exports(){ return exports.exports; },
  set exports(v){ exports.exports = v; },
};

exports.__module = quill;
