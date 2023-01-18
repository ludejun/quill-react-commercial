import Quill from 'quill';

const Delta = Quill.import('delta');
const Module = Quill.import('core/module');

class ToolbarTable extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('table', this.handleTableClick.bind(this));
    }
  }

  handleTableClick() {
    console.log('table toolbar click');
    this.tableDialogOpen();
    // 有text改变就消除table的弹出框
    // this.quill.once('text-change', (delta, oldDelta, source) => {
    //   if (source === 'user') {
    //     ToolbarTable.tableDialogClose();
    //   }
    // });
    // 聚焦文本container就消除table的弹出框
    this.quill.container.addEventListener('click', () => {
      ToolbarTable.tableDialogClose();
    });
  }

  tableDialogOpen() {
    const tableDialog = document.getElementById('quill-table-dialog');
    if (tableDialog) {
      tableDialog.remove();
    } else {
      this.showTableDialog();
      Array.from(document.getElementsByClassName('table-dialog-item')).forEach(dom => {
        dom.addEventListener('mouseover', () => {
          document.getElementById('row-number').value = Number(dom.dataset.row) + 1;
          document.getElementById('column-number').value = Number(dom.dataset.column) + 1;
          ToolbarTable.itemBackgroundChange(dom.dataset.row, dom.dataset.column);
        });
        dom.addEventListener('click', () => {
          this.createTable(Number(dom.dataset.row) + 1, Number(dom.dataset.column) + 1);
        });
      });
      document.getElementById('table-dialog-submit').addEventListener('click', () => {
        this.createTable(
          Number(document.getElementById('row-number').value),
          Number(document.getElementById('column-number').value)
        );
      });
    }
  }

  showTableDialog() {
    const tableDialog = document.createElement('div');
    tableDialog.id = 'quill-table-dialog';
    const toolbarContainer = document.querySelector('.ql-toolbar');
    const tableIcon = document.querySelector('.ql-table');
    const { dialogRows, dialogColumns } = this.options; // 生成dialogRows * dialogColumns的格子弹框
    const dialogContent = `<div class="table-dialog-content">${new Array(
      Number(dialogRows) > 0 ? Number(dialogRows) : 3
    )
      .fill(1)
      .map(
        (x, row) =>
          `<div class="table-dialog-tr">${new Array(
            Number(dialogColumns) > 0 ? Number(dialogColumns) : 4
          )
            .fill(2)
            .map(
              (y, column) =>
                `<div class="table-dialog-item" data-row="${row}" data-column="${column}"></div>`
            )
            .join('')}</div>`
      )
      .join('')}
      </div><div><p>
        <input placeholder="${this.options.rowLabel || '行数'}" id="row-number"/>
        <span>X</span>
        <input placeholder="${this.options.columnLabel || '列数'}" id="column-number"/>
        <button id="table-dialog-submit">${this.options.okLabel || '确认'}</button>
      </p></div>`;
    tableDialog.style = `top: ${tableIcon.offsetHeight + 7}px; left: ${tableIcon.offsetLeft +
      4}px;`;
    tableDialog.innerHTML = dialogContent;
    toolbarContainer.append(tableDialog);
  }

  static tableDialogClose() {
    const tableDialog = document.getElementById('quill-table-dialog');
    if (tableDialog) {
      tableDialog.remove();
    }
  }

  static itemBackgroundChange(row, column) {
    Array.from(document.getElementsByClassName('table-dialog-item')).forEach(dom => {
      if (dom.dataset.row <= row && dom.dataset.column <= column) {
        dom.className = 'table-dialog-item item-hover';
      } else {
        dom.className = 'table-dialog-item';
      }
    });
  }

  createTable(row, column) {
    ToolbarTable.tableDialogClose();
    this.quill.getModule('better-table').insertTable(row, column);
  }
}

export default ToolbarTable;
