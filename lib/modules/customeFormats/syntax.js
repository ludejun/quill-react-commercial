'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../node_modules/quill/quill.js');
var copy = require('../../assets/icons/copy.svg.js');
var utils = require('../../utils.js');
require('../../node_modules/quill/core.js');
var quill = require('../../node_modules/quill/core/quill.js');

// const Parchment = Quill.import('parchment');
const BaseSyntax = quill.default.import('modules/syntax');
const CodeBlock = quill.default.import('formats/code-block');

class QSyntax extends BaseSyntax {
  constructor(quill, options) {
    super(quill, options);
    this.listener();
  }

  // 参考 BaseSyntax的initListener重构
  listener() {
    this.quill.on(quill.default.events.SCROLL_BLOT_MOUNT, (blot) => {
      // if (!(blot instanceof CodeBlockContainer)) return;
      if (blot.domNode.getAttribute('class') !== 'ql-code-block-container') return;
      const container = this.quill.root.ownerDocument.createElement('div');
      const copy$1 = this.quill.root.ownerDocument.createElement('span');
      const copyLabel = '<span>Copy</span>';
      copy$1.innerHTML = `${copy.default}${copyLabel}`;
      copy$1.className = 'ql-code-copy';
      copy$1.addEventListener('click', () => {
        const text = blot.domNode.innerHTML;
        window.navigator.clipboard.writeText(QSyntax.filterCode(text.split(copyLabel)[1]));
        copy$1.querySelector('span').innerHTML = 'Copied';
        setTimeout(() => {
          copy$1.querySelector('span').innerHTML = 'Copy';
        }, 2000);
      });

      const select = this.quill.root.ownerDocument.createElement('select');
      this.options.languages.forEach(({ key, label }) => {
        const option = select.ownerDocument.createElement('option');
        option.textContent = label;
        option.setAttribute('value', key);
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        blot.format(CodeBlock.blotName, select.value);
        this.quill.root.focus(); // Prevent scrolling
        this.highlight(blot, true);
      });
      container.append(select, copy$1);
      // if (blot.uiNode == null) {
      blot.attachUI(container); // blot.uiNode是有的，在BaseSyntax中已被创建，这里需要覆盖
      if (blot.prev && blot.prev.domNode) {
        select.value = CodeBlock.formats(blot.prev.domNode);
      } // 编辑器中 content 再次渲染需要自动选上语言
      // }
    });
  }

  static filterCode(html) {
    return html
      .match(/(?<=<div[^<>]+?>)(.+?)(?=<\/div>)/g)
      .map((line) => utils.htmlDecode(line.replace(/<[^<>]+>/g, '')))
      .join('\n');
  }
}

exports.default = QSyntax;
