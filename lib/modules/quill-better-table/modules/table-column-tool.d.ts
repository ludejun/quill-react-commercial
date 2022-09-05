export default class TableColumnTool {
    constructor(table: any, quill: any, options: any);
    table: any;
    quill: any;
    options: any;
    domNode: HTMLDivElement;
    initColTool(): void;
    createToolCell(): HTMLDivElement;
    updateToolCells(): void;
    destroy(): any;
    addColCellHolderHandler(cell: any): void;
    colToolCells(): Element[];
}
