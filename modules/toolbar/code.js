import Quill from 'quill';
const Module = Quill.import('core/module');

class CodeHandler extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.blockName = 'code-block';
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('code-block', this.handleCodeClick.bind(this));
    }
  }

  handleCodeClick() {
    const selection = this.quill.getSelection();
    if (!selection) return;

    const format = this.quill.getFormat();
    // 当前是代码块，则去除代码块效果，如在中间则会分割成两个代码块
    if (format[this.blockName]) {
      this.quill.removeFormat(selection.index);
    } else {
      if (this.quill.getText(selection.index) === '\n') {
        // 当代码块下无内容，自动加一个空行
        this.quill.insertText(selection.index, '\n');
        this.quill.formatLine(selection.index, 1, this.blockName, true);
        this.quill.setSelection(selection.index);
      } else {
        this.quill.formatLine(selection.index, 1, this.blockName, true);
      }
    }
  }
}

export default CodeHandler;
