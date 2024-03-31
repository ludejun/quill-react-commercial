import '../../node_modules/quill/quill.js';
import CopyIcon from '../../assets/icons/copy.svg.js';
import { htmlDecode } from '../../utils.js';
import '../../node_modules/quill/core.js';
import Quill from '../../node_modules/quill/core/quill.js';

// const Parchment = Quill.import('parchment');
const BaseSyntax = Quill.import('modules/syntax');
const CodeBlock = Quill.import('formats/code-block');

class QSyntax extends BaseSyntax {
  constructor(quill, options) {
    super(quill, options);
    this.listener();
  }

  // 参考 BaseSyntax的initListener重构
  listener() {
    this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, (blot) => {
      // if (!(blot instanceof CodeBlockContainer)) return;
      if (blot.domNode.getAttribute('class') !== 'ql-code-block-container') return;
      const container = this.quill.root.ownerDocument.createElement('div');
      const copy = this.quill.root.ownerDocument.createElement('span');
      const copyLabel = '<span>Copy</span>';
      copy.innerHTML = `${CopyIcon}${copyLabel}`;
      copy.className = 'ql-code-copy';
      copy.addEventListener('click', () => {
        const text = blot.domNode.innerHTML;
        window.navigator.clipboard.writeText(QSyntax.filterCode(text.split(copyLabel)[1]));
        copy.querySelector('span').innerHTML = 'Copied';
        setTimeout(() => {
          copy.querySelector('span').innerHTML = 'Copy';
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
      container.append(select, copy);
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
      .map((line) => htmlDecode(line.replace(/<[^<>]+>/g, '')))
      .join('\n');
  }
}

export { QSyntax as default };
