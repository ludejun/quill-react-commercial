import '../../node_modules/quill/quill.js';
import '../../node_modules/quill/core.js';
import Quill from '../../node_modules/quill/core/quill.js';

const Module = Quill.import('core/module');

class CodeHandler extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('code-block', this.handleCodeClick.bind(this));
    }
  }

  handleCodeClick() {
    const selection = this.quill.getSelection();
    if (!selection) return;
    // this.quill.updateContents(new Delta().retain(selection.index).insert('\n').insert('aw', {'code-block': true}).insert('\n'));
    
    // 当代码块下无内容，自动加一个空行
    if (this.quill.getText(selection.index) === '\n') {
      this.quill.insertText(selection.index, '\n');
      this.quill.formatLine(selection.index, 1, 'code-block', true);
      this.quill.setSelection(selection.index);
    } else {
      this.quill.formatLine(selection.index, 1, 'code-block', true);
    }
  }
}

export { CodeHandler as default };
