import Quill from 'quill';
const Module = Quill.import('core/module');

class DialogBase extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quill.getModule('toolbar');
  }

  /**
   *
   * @param {selector} selector 点击自定义按钮的selector或者原生支持的按钮名称
   * @param {selector} dialogSelector 弹出的Dialog的selector
   * @param {*} custom 是否原生定义的按钮，如可以用原声，直接用addHandler即可；如纯自定义按钮，需要通过Dom的点击监听来绑定点击时间
   */
  bindToolbarClick(selector, dialogSelector, custom) {
    this.dialogSelector = dialogSelector;
    if (!custom) {
      if (typeof this.toolbar !== 'undefined') {
        this.toolbar.addHandler(selector, this.handleToolbarClick.bind(this));
      }
    } else {
      this.toolbar.container.querySelector(selector).onclick = () => this.handleToolbarClick();
    }
  }

  handleToolbarClick() {
    this.customDialogOpen();
    if (window.event) {
      window.event.cancelBubble = true;
      // 点击整个编辑器就消除image的弹出框
      this.quill.container.parentNode.addEventListener('click', () => {
        this.customDialogClose();
      });
    } else {
      // 聚焦文本container就消除image的弹出框
      this.quill.container.addEventListener('click', () => {
        this.customDialogClose();
      });
    }
    window.addEventListener('resize', () => {
      this.customDialogClose();
    });
  }

  customDialogOpen() {
    if (this.dialogSelector && this.toolbar.container.querySelector(this.dialogSelector)) {
      this.customDialog.remove();
    } else {
      this.showCustomDialog();
    }
  }

  /**
   *
   * @param {selector} target toolbar上点的目标按钮的selector，用来定位Dialog的位置，如.ql-divider
   * @param {object} dialog Dialog绘制所需的属性
   * @param {fn} callback 显示成功后的回调，一般用来定义点击Dialog中的事件处理和编辑器内容插入
   */
  showCustomDialog(target, dialog, callback) {
    const { className, innerHtml } = dialog || {};
    const toolbarContainer = this.toolbar.container;
    if (!this.customDialog) {
      this.customDialog = document.createElement('div');
      this.customDialog.classList.add(className, 'ql-toolbar-dialog');
      this.customDialog.innerHTML = innerHtml;
      this.customDialog.style = this.dialogPosition(toolbarContainer.querySelector(target));
    }
    toolbarContainer.append(this.customDialog);
    if (callback) callback(this.customDialog);
  }

  customDialogClose() {
    if (this.customDialog) {
      this.customDialog.remove();
    }
  }

  dialogPosition() {}
}