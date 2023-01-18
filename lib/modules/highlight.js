'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('../node_modules/highlight.js/lib/core.js');
var javascript = require('../node_modules/highlight.js/lib/languages/javascript.js');
var bash = require('../node_modules/highlight.js/lib/languages/bash.js');
var vim = require('../node_modules/highlight.js/lib/languages/vim.js');
var cpp = require('../node_modules/highlight.js/lib/languages/cpp.js');
var csharp = require('../node_modules/highlight.js/lib/languages/csharp.js');
var css = require('../node_modules/highlight.js/lib/languages/css.js');
var go = require('../node_modules/highlight.js/lib/languages/go.js');
var java = require('../node_modules/highlight.js/lib/languages/java.js');
var json = require('../node_modules/highlight.js/lib/languages/json.js');
var objectivec = require('../node_modules/highlight.js/lib/languages/objectivec.js');
var php = require('../node_modules/highlight.js/lib/languages/php.js');
var python = require('../node_modules/highlight.js/lib/languages/python.js');
var ruby = require('../node_modules/highlight.js/lib/languages/ruby.js');
var sql = require('../node_modules/highlight.js/lib/languages/sql.js');
var xml = require('../node_modules/highlight.js/lib/languages/xml.js');
var scala = require('../node_modules/highlight.js/lib/languages/scala.js');
var matlab = require('../node_modules/highlight.js/lib/languages/matlab.js');
var swift = require('../node_modules/highlight.js/lib/languages/swift.js');
var dart = require('../node_modules/highlight.js/lib/languages/dart.js');
require('../node_modules/highlight.js/styles/vs2015.css.js');

// 自定义代码高亮的语言和css

const highlightInit = () => {
  core.default.registerLanguage('javascript', javascript.default);
  core.default.registerLanguage('java', java.default);
  core.default.registerLanguage('cpp', cpp.default);
  core.default.registerLanguage('csharp', csharp.default);
  core.default.registerLanguage('php', php.default);
  core.default.registerLanguage('python', python.default);
  core.default.registerLanguage('sql', sql.default);
  core.default.registerLanguage('json', json.default);
  core.default.registerLanguage('bash', bash.default);
  core.default.registerLanguage('shell', vim.default);
  core.default.registerLanguage('css', css.default);
  core.default.registerLanguage('go', go.default);
  core.default.registerLanguage('objectivec', objectivec.default);
  core.default.registerLanguage('ruby', ruby.default);
  core.default.registerLanguage('xml', xml.default);
  core.default.registerLanguage('scala', scala.default);
  // highlight.registerLanguage('R', r);
  core.default.registerLanguage('matlab', matlab.default);
  core.default.registerLanguage('swift', swift.default);
  core.default.registerLanguage('dart', dart.default);

  core.default.configure({
    // optionally configure hljs
    languages: [
      'javascript',
      'java',
      'csharp',
      'cpp',
      'php',
      'python',
      'sql',
      'json',
      'bash',
      'shell',
      'css',
      'go',
      'objectivec',
      'ruby',
      'xml',
      'scala',
      'thrift',
      // 'r',
      'matlab',
      'swift',
      'dart',
    ],
    useBR: false,
  });
  window.hljs = core.default;
  return core.default;
};

exports.default = highlightInit;
