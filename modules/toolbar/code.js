import Quill from 'quill';

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
    const delta = this.quill.getContents();
    delta.insert('\n');
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.formatLine(selection.index, 1, 'code-block', true);
    // this.quill.deleteText(selection.index - 4, 4);
  }

  
}

export default CodeHandler;
