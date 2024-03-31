import '../../node_modules/quill/quill.js';
import { getI18nText } from '../../i18n.js';
import '../../node_modules/quill/core.js';
import Quill from '../../node_modules/quill/core/quill.js';

const Module = Quill.import('core/module');

class TableHandler extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quill.getModule('toolbar');
    this.DEFAULT_COL = 9;
    this.DEFAULT_ROW = 9;
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('table', this.handleTableClick.bind(this));
    }
  }

  handleTableClick() {
    this.tableDialogOpen();
    if (window.event) {
      window.event.cancelBubble = true;
      // 点击整个编辑器就消除table的弹出框
      this.quill.container.parentNode.addEventListener('click', () => {
        this.tableDialogClose();
      });
    } else {
      // 聚焦文本container就消除table的弹出框
      this.quill.container.addEventListener('click', () => {
        this.tableDialogClose();
      });
    }
    window.addEventListener('resize', () => {
      this.tableDialogClose();
    });
  }

  tableDialogOpen() {
    if (this.toolbar.container.querySelector('.ql-table-dialog')) {
      this.tableDialog.remove();
    } else {
      this.showTableDialog();
      Array.from(this.tableDialog.getElementsByClassName('table-dialog-item')).forEach((dom) => {
        dom.addEventListener('mouseover', () => {
          this.tableDialog.querySelector('#table-row-number').innerText =
            Number(dom.dataset.row) + 1;
          this.tableDialog.querySelector('#table-col-number').innerText =
            Number(dom.dataset.column) + 1;
          this.itemBackgroundChange(dom.dataset.row, dom.dataset.column);
        });
        dom.addEventListener('click', () => {
          this.createTable(Number(dom.dataset.row) + 1, Number(dom.dataset.column) + 1);
        });
      });
    }
  }

  showTableDialog() {
    const toolbarContainer = this.toolbar.container;
    if (!this.tableDialog) {
      this.tableDialog = document.createElement('div');
      this.tableDialog.classList.add('ql-table-dialog');
      const { dialogRows, dialogColumns } = this.options; // 生成dialogRows * dialogColumns的格子弹框
      const tableDialogLabel = getI18nText('tableDialogLabel', this.options.i18n);
      const dialogContent = `${TableHandler.genNumArr(
        Number(dialogRows) > 0 ? Number(dialogRows) : this.DEFAULT_ROW,
      )
        .map(
          (row) =>
            `<div class="table-dialog-tr">${TableHandler.genNumArr(
              Number(dialogColumns) > 0 ? Number(dialogColumns) : this.DEFAULT_COL,
            )
              .map(
                (column) =>
                  `<div class="table-dialog-item" data-row="${row}" data-column="${column}"></div>`,
              )
              .join('')}</div>`,
        )
        .join('')}
        <p><label>${tableDialogLabel}</label><span><span id="table-row-number">0</span> X <span id="table-col-number">0</span></span></p>
      `;
      
      this.tableDialog.innerHTML = dialogContent;
    } else {
      this.itemBackgroundChange(-1, 0); // 每次打开都清空之前被 hover 过的格子
    }

    const tableIcon = toolbarContainer.querySelector('.ql-table');
    this.tableDialog.style = this.dialogPosition(tableIcon);
    toolbarContainer.append(this.tableDialog);
  }

  tableDialogClose() {
    if (this.tableDialog) {
      this.tableDialog.remove();
    }
  }
  dialogPosition = (clickDom) =>{
    const parent = clickDom.offsetParent;
    const width = 200;
    if (parent.offsetWidth - clickDom.offsetLeft + 6 > width) {
      return `top:${clickDom.offsetTop + 24}px;left:${clickDom.offsetLeft + 6}px;`;
    } else {
      return `top:${clickDom.offsetTop + 24}px;left:${parent.offsetWidth - width}px;`;
    }
  }

  createTable(row, column) {
    this.tableDialogClose();
    this.quill.getModule('better-table').insertTable(row, column);
  }

  itemBackgroundChange(row, column) {
    Array.from(this.tableDialog.getElementsByClassName('table-dialog-item')).forEach((dom) => {
      if (dom.dataset.row <= row && dom.dataset.column <= column) {
        dom.className = 'table-dialog-item item-hover';
      } else {
        dom.className = 'table-dialog-item';
      }
    });
  }
  static genNumArr = (max) => new Array(max).fill(0).map((i, index) => index);
}

export { TableHandler as default };
