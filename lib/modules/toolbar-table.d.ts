export default ToolbarTable;
declare const ToolbarTable_base: any;
declare class ToolbarTable extends ToolbarTable_base {
    [x: string]: any;
    static tableDialogClose(): void;
    static itemBackgroundChange(row: any, column: any): void;
    constructor(quill: any, options: any);
    quill: any;
    options: any;
    toolbar: any;
    handleTableClick(): void;
    tableDialogOpen(): void;
    showTableDialog(): void;
    createTable(row: any, column: any): void;
}
