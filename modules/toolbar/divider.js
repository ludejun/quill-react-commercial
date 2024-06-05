import Quill from 'quill';
import { defaultColor, styleConfig } from '../customeFormats/divider';
import { isColor } from '../../utils';
import { i18nConfig } from '../../i18n';
import { inputHandler } from '.';
const Module = Quill.import('core/module');

class DividerHandler extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.container.querySelector('button.ql-divider').onclick = () =>
        this.handleDividerClick();
    }
  }

  handleDividerClick() {
    this.dividerDialogOpen();
    if (window.event) {
      window.event.cancelBubble = true;
      // 点击整个编辑器就消除image的弹出框
      this.quill.container.parentNode.addEventListener('click', () => {
        this.dividerDialogClose();
      });
    } else {
      // 聚焦文本container就消除image的弹出框
      this.quill.container.addEventListener('click', () => {
        this.dividerDialogClose();
      });
    }
    window.addEventListener('resize', () => {
      this.dividerDialogClose();
    });
  }

  dividerDialogOpen() {
    if (this.toolbar.container.querySelector('.ql-divider-dialog')) {
      this.dividerDialog.remove();
    } else {
      this.showDividerDialog();
    }
  }
  showDividerDialog() {
    const toolbarContainer = this.toolbar.container;
    const primaryColor = localStorage.getItem('ql-divider-color') || defaultColor;

    const getItems = (color) => {
      return `${Object.keys(styleConfig(color))
        .map(
          (type) =>
            `<div class="divider-item flex-column flex-center" data-type="${type}"><hr style="${
              styleConfig(color)[type]
            }width:100%;"/></div>`,
        )
        .join('')}`;
    };

    if (!this.dividerDialog) {
      this.dividerDialog = document.createElement('div');
      this.dividerDialog.classList.add('ql-divider-dialog', 'ql-toolbar-dialog');
      
      this.dividerDialog.style = this.dialogPosition(toolbarContainer.querySelector('.ql-divider'));
      const { replaceDefault } = this.options;

      let dialogContent = `<div class="divider-default">${getItems(
        primaryColor,
      )}</div><div class="divider-setting flex"><label>${
        i18nConfig[this.options.i18n || 'en'].dividerDialogColorLabel
      }</label><input class="text-input divider-color" type="text" value="${primaryColor}"/></ div>`;
      // if () {

      // }

      this.dividerDialog.innerHTML = dialogContent;
    }

    
    toolbarContainer.append(this.dividerDialog);

    const addItemHandler = (color) => {
      this.dividerDialog.querySelectorAll('.divider-item').forEach((node) => {
        node.onclick = (e) => {
          this.insertDivider(
            node.dataset.type,
            color,
          );
        };
      });
    }
    addItemHandler(primaryColor);
    
    const colorInput = this.dividerDialog.querySelector('.divider-color');
    inputHandler(colorInput, (value) => {
      if (isColor(value)) {
        localStorage.setItem('ql-divider-color', value);
        this.dividerDialog.querySelector('.divider-default').innerHTML = getItems(value);
        addItemHandler(value);
      }
    });
  }
  dividerDialogClose() {
    if (this.dividerDialog) {
      this.dividerDialog.remove();
    }
  }
  dialogPosition = (clickDom) => {
    const parent = clickDom.offsetParent;
    const width = 200;
    if (parent.offsetWidth - clickDom.offsetLeft + 6 > width) {
      return `top:${clickDom.offsetTop + 24}px;left:${clickDom.offsetLeft + 5}px;`;
    } else {
      return `top:${clickDom.offsetTop + 24}px;left:${parent.offsetWidth - width}px;`;
    }
  };
  insertDivider(type, color) {
    this.dividerDialogClose();
    this.quill.enable(true);
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'QDivider', { type, color }, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
  }
}

export default DividerHandler;
