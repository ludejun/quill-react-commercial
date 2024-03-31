// 自定义代码高亮的语言和css
import highlight from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import vim from 'highlight.js/lib/languages/vim'; // 使用vim代替shell，shell缺少很多命令行，这些不是标准的bash命令
import cpp from 'highlight.js/lib/languages/cpp'; // C++
import csharp from 'highlight.js/lib/languages/csharp'; // C#
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import json from 'highlight.js/lib/languages/json';
import objectivec from 'highlight.js/lib/languages/objectivec';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import scala from 'highlight.js/lib/languages/scala';
// import r from 'highlight.js/lib/languages/r';
import matlab from 'highlight.js/lib/languages/matlab';
import swift from 'highlight.js/lib/languages/swift';
import dart from 'highlight.js/lib/languages/dart';
import 'highlight.js/styles/xcode.css';

const highlightInit = () => {
  highlight.registerLanguage('javascript', javascript);
  highlight.registerLanguage('java', java);
  highlight.registerLanguage('cpp', cpp);
  highlight.registerLanguage('csharp', csharp);
  highlight.registerLanguage('php', php);
  highlight.registerLanguage('python', python);
  highlight.registerLanguage('sql', sql);
  highlight.registerLanguage('json', json);
  highlight.registerLanguage('bash', bash);
  highlight.registerLanguage('shell', vim);
  highlight.registerLanguage('css', css);
  highlight.registerLanguage('go', go);
  highlight.registerLanguage('objectivec', objectivec);
  highlight.registerLanguage('ruby', ruby);
  highlight.registerLanguage('xml', xml);
  highlight.registerLanguage('scala', scala);
  // highlight.registerLanguage('R', r);
  highlight.registerLanguage('matlab', matlab);
  highlight.registerLanguage('swift', swift);
  highlight.registerLanguage('dart', dart);

  highlight.configure({
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
  window.hljs = highlight;
  return highlight;
};

export default highlightInit;
