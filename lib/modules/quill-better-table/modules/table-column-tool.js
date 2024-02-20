'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var quill = require('../../../node_modules/quill/dist/quill.js');
var index = require('../utils/index.js');

const COL_TOOL_HEIGHT = 10;
const COL_TOOL_CELL_HEIGHT = 10;
const CELL_MIN_WIDTH = 50;
const PRIMARY_COLOR = '#35A7ED';

class TableColumnTool {
  constructor (table, quill, options) {
    if (!table) return null
    this.table = table;
    this.quill = quill;
    this.options = options;
    this.domNode = null;

    this.initColTool();
  }

  initColTool () {
    const parent = this.quill.root.parentNode;
    this.table.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();

    this.domNode = document.createElement('div');
    this.domNode.classList.add('qlbt-col-tool');
    this.updateToolCells();
    parent.appendChild(this.domNode);
    index.css(this.domNode, {
      width: `${tableViewRect.width}px`,
      height: `${COL_TOOL_HEIGHT}px`,
      left: `${tableViewRect.left - containerRect.left + parent.scrollLeft}px`,
      top: `${tableViewRect.top - containerRect.top + parent.scrollTop - COL_TOOL_HEIGHT - 5}px`
    });
  }

  createToolCell () {
    const toolCell = document.createElement('div');
    toolCell.classList.add('qlbt-col-tool-cell');
    const resizeHolder = document.createElement('div');
    resizeHolder.classList.add('qlbt-col-tool-cell-holder');
    index.css(toolCell, {
      'height': `${COL_TOOL_CELL_HEIGHT}px`
    });
    toolCell.appendChild(resizeHolder);
    return toolCell
  }

  updateToolCells () {
    const tableContainer = quill.default.find(this.table);
    const CellsInFirstRow = tableContainer.children.tail.children.head.children;
    const tableCols = tableContainer.colGroup().children;
    const cellsNumber = computeCellsNumber(CellsInFirstRow);
    let existCells = Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'));

    for (let index$1 = 0; index$1 < Math.max(cellsNumber, existCells.length); index$1++) {
      let col = tableCols.at(index$1);
      let colWidth = col && parseInt(col.formats()[col.statics.blotName].width, 10);
      // if cell already exist
      let toolCell = null;
      if (!existCells[index$1]) {
        toolCell = this.createToolCell();
        this.domNode.appendChild(toolCell);
        this.addColCellHolderHandler(toolCell);
        // set tool cell min-width
        index.css(toolCell, {
          'min-width': `${colWidth}px`
        });
      } else if (existCells[index$1] && index$1 >= cellsNumber) {
        existCells[index$1].remove();
      } else {
        toolCell = existCells[index$1];
        // set tool cell min-width
        index.css(toolCell, {
          'min-width': `${colWidth}px`
        });
      }
    }
  }

  destroy () {
    this.domNode.remove();
    return null
  }

  addColCellHolderHandler(cell) {
    const tableContainer = quill.default.find(this.table);
    const $holder = cell.querySelector(".qlbt-col-tool-cell-holder");
    let dragging = false;
    let x0 = 0;
    let x = 0;
    let delta = 0;
    let width0 = 0;
    // helpLine relation varrible
    let tableRect = {};
    let cellRect = {};
    let $helpLine = null;

    const handleDrag = e => {
      e.preventDefault();

      if (dragging) {
        x = e.clientX;

        if (width0 + x - x0 >= CELL_MIN_WIDTH) {
          delta = x - x0;
        } else {
          delta = CELL_MIN_WIDTH - width0;
        }

        index.css($helpLine, {
          'left': `${cellRect.left + cellRect.width - 1 + delta}px`
        });
      }
    };

    const handleMouseup = e => {
      e.preventDefault();
      const existCells = Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'));
      const colIndex = existCells.indexOf(cell);
      const colBlot = tableContainer.colGroup().children.at(colIndex);

      if (dragging) {
        colBlot.format('width', width0 + delta);
        index.css(cell, { 'min-width': `${width0 + delta}px` });

        x0 = 0;
        x = 0;
        delta = 0;
        width0 = 0;
        dragging = false;
        $holder.classList.remove('dragging');
      }

      document.removeEventListener('mousemove', handleDrag, false);
      document.removeEventListener('mouseup', handleMouseup, false);
      tableRect = {};
      cellRect = {};
      $helpLine.remove();
      $helpLine = null;
      tableContainer.updateTableWidth();

      const tableSelection = this.quill.getModule('better-table').tableSelection;
      tableSelection && tableSelection.clearSelection();
    };

    const handleMousedown = e => {
      document.addEventListener('mousemove', handleDrag, false);
      document.addEventListener('mouseup', handleMouseup, false);

      tableRect = this.table.getBoundingClientRect();
      cellRect = cell.getBoundingClientRect();
      $helpLine = document.createElement('div');
      index.css($helpLine, {
        position: 'fixed',
        top: `${cellRect.top}px`,
        left: `${cellRect.left + cellRect.width - 1}px`,
        zIndex: '100',
        height: `${tableRect.height + COL_TOOL_HEIGHT + 4}px`,
        width: '1px',
        backgroundColor: PRIMARY_COLOR
      });

      document.body.appendChild($helpLine);
      dragging = true;
      x0 = e.clientX;
      width0 = cellRect.width;
      $holder.classList.add('dragging');
    };
    $holder.addEventListener('mousedown', handleMousedown, false);
  }

  colToolCells () {
    return Array.from(this.domNode.querySelectorAll('.qlbt-col-tool-cell'))
  }
}

function computeCellsNumber (CellsInFirstRow) {
  return CellsInFirstRow.reduce((sum, cell) => {
    const cellColspan = cell.formats().colspan;
    sum = sum + parseInt(cellColspan, 10);
    return sum
  }, 0)
}

exports.default = TableColumnTool;