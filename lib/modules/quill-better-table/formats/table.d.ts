declare const TableCol_base: any;
export class TableCol extends TableCol_base {
    [x: string]: any;
    static create(value: any): any;
    static formats(domNode: any): {};
    format(name: any, value: any): void;
    html(): any;
}
export namespace TableCol {
    export const blotName: string;
    export const tagName: string;
    export { TableColGroup as requiredContainer };
}
declare const TableColGroup_base: any;
export class TableColGroup extends TableColGroup_base {
    [x: string]: any;
}
export namespace TableColGroup {
    const blotName_1: string;
    export { blotName_1 as blotName };
    const tagName_1: string;
    export { tagName_1 as tagName };
    export const allowedChildren: (typeof TableCol)[];
    export { TableContainer as requiredContainer };
}
declare const TableCellLine_base: any;
export class TableCellLine extends TableCellLine_base {
    [x: string]: any;
    static create(value: any): any;
    static formats(domNode: any): {};
    format(name: any, value: any): void;
    optimize(context: any): void;
    tableCell(): any;
}
export namespace TableCellLine {
    const blotName_2: string;
    export { blotName_2 as blotName };
    export const className: string;
    const tagName_2: string;
    export { tagName_2 as tagName };
    export { TableCell as requiredContainer };
}
declare const TableCell_base: any;
export class TableCell extends TableCell_base {
    [x: string]: any;
    static create(value: any): any;
    static formats(domNode: any): {
        row: any;
        'cell-bg': any;
    };
    checkMerge(): boolean;
    cellOffset(): any;
    formats(): {
        row: any;
        'cell-bg': any;
    };
    toggleAttribute(name: any, value: any): void;
    formatChildren(name: any, value: any): void;
    format(name: any, value: any): void;
    optimize(context: any): void;
    row(): any;
    rowOffset(): any;
    table(): any;
}
export namespace TableCell {
    const blotName_3: string;
    export { blotName_3 as blotName };
    const tagName_3: string;
    export { tagName_3 as tagName };
    export { TableRow as requiredContainer };
    const allowedChildren_1: any[];
    export { allowedChildren_1 as allowedChildren };
}
declare const TableRow_base: any;
export class TableRow extends TableRow_base {
    [x: string]: any;
    static create(value: any): any;
    checkMerge(): boolean;
    formats(): {};
    optimize(context: any): void;
    rowOffset(): any;
    table(): any;
}
export namespace TableRow {
    const blotName_4: string;
    export { blotName_4 as blotName };
    const tagName_4: string;
    export { tagName_4 as tagName };
    export { TableBody as requiredContainer };
    const allowedChildren_2: (typeof TableCell)[];
    export { allowedChildren_2 as allowedChildren };
}
declare const TableBody_base: any;
export class TableBody extends TableBody_base {
    [x: string]: any;
}
export namespace TableBody {
    const blotName_5: string;
    export { blotName_5 as blotName };
    const tagName_5: string;
    export { tagName_5 as tagName };
    export { TableContainer as requiredContainer };
    const allowedChildren_3: (typeof TableRow)[];
    export { allowedChildren_3 as allowedChildren };
}
declare const TableContainer_base: any;
export class TableContainer extends TableContainer_base {
    [x: string]: any;
    static create(): any;
    constructor(scroll: any, domNode: any);
    updateTableWidth(): void;
    cells(column: any): any;
    colGroup(): any;
    deleteColumns(compareRect: any, delIndexes: any[], editorWrapper: any): boolean;
    deleteRow(compareRect: any, editorWrapper: any): void;
    tableDestroy(): void;
    insertCell(tableRow: any, ref: any): void;
    insertColumn(compareRect: any, colIndex: any, isRight: boolean, editorWrapper: any): any[];
    insertRow(compareRect: any, isDown: any, editorWrapper: any): any[];
    mergeCells(compareRect: any, mergingCells: any, rowspan: any, colspan: any, editorWrapper: any): any;
    unmergeCells(unmergingCells: any, editorWrapper: any): void;
    rows(): any;
}
export namespace TableContainer {
    const blotName_6: string;
    export { blotName_6 as blotName };
    const className_1: string;
    export { className_1 as className };
    const tagName_6: string;
    export { tagName_6 as tagName };
    export { TableViewWrapper as requiredContainer };
    const allowedChildren_4: (typeof TableBody | typeof TableColGroup)[];
    export { allowedChildren_4 as allowedChildren };
}
declare const TableViewWrapper_base: any;
export class TableViewWrapper extends TableViewWrapper_base {
    [x: string]: any;
    constructor(scroll: any, domNode: any);
    table(): any;
}
export namespace TableViewWrapper {
    const blotName_7: string;
    export { blotName_7 as blotName };
    const className_2: string;
    export { className_2 as className };
    const tagName_7: string;
    export { tagName_7 as tagName };
    const allowedChildren_5: (typeof TableContainer)[];
    export { allowedChildren_5 as allowedChildren };
}
export function rowId(): string;
export function cellId(): string;
export const CELL_IDENTITY_KEYS: string[];
export const CELL_ATTRIBUTES: string[];
export {};
