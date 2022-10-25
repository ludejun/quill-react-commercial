import core from '../node_modules/highlight.js/lib/core.js';
import javascript_1 from '../node_modules/highlight.js/lib/languages/javascript.js';
import bash_1 from '../node_modules/highlight.js/lib/languages/bash.js';
import vim_1 from '../node_modules/highlight.js/lib/languages/vim.js';
import cpp_1 from '../node_modules/highlight.js/lib/languages/cpp.js';
import csharp_1 from '../node_modules/highlight.js/lib/languages/csharp.js';
import css_1 from '../node_modules/highlight.js/lib/languages/css.js';
import go_1 from '../node_modules/highlight.js/lib/languages/go.js';
import java_1 from '../node_modules/highlight.js/lib/languages/java.js';
import json_1 from '../node_modules/highlight.js/lib/languages/json.js';
import objectivec_1 from '../node_modules/highlight.js/lib/languages/objectivec.js';
import php_1 from '../node_modules/highlight.js/lib/languages/php.js';
import python_1 from '../node_modules/highlight.js/lib/languages/python.js';
import ruby_1 from '../node_modules/highlight.js/lib/languages/ruby.js';
import sql_1 from '../node_modules/highlight.js/lib/languages/sql.js';
import xml_1 from '../node_modules/highlight.js/lib/languages/xml.js';
import scala_1 from '../node_modules/highlight.js/lib/languages/scala.js';
import matlab_1 from '../node_modules/highlight.js/lib/languages/matlab.js';
import swift_1 from '../node_modules/highlight.js/lib/languages/swift.js';
import dart_1 from '../node_modules/highlight.js/lib/languages/dart.js';
import '../node_modules/highlight.js/styles/vs2015.css.js';

// 自定义代码高亮的语言和css

const highlightInit = () => {
  core.registerLanguage('javascript', javascript_1);
  core.registerLanguage('java', java_1);
  core.registerLanguage('cpp', cpp_1);
  core.registerLanguage('csharp', csharp_1);
  core.registerLanguage('php', php_1);
  core.registerLanguage('python', python_1);
  core.registerLanguage('sql', sql_1);
  core.registerLanguage('json', json_1);
  core.registerLanguage('bash', bash_1);
  core.registerLanguage('shell', vim_1);
  core.registerLanguage('css', css_1);
  core.registerLanguage('go', go_1);
  core.registerLanguage('objectivec', objectivec_1);
  core.registerLanguage('ruby', ruby_1);
  core.registerLanguage('xml', xml_1);
  core.registerLanguage('scala', scala_1);
  // highlight.registerLanguage('R', r);
  core.registerLanguage('matlab', matlab_1);
  core.registerLanguage('swift', swift_1);
  core.registerLanguage('dart', dart_1);

  core.configure({
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
  window.hljs = core;
  return core;
};

export { highlightInit as default };
