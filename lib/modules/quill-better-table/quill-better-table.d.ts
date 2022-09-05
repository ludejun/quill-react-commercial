export default BetterTable;
declare const BetterTable_base: any;
declare class BetterTable extends BetterTable_base {
    [x: string]: any;
    static register(): void;
    constructor(quill: any, options: any);
    tableOperationMenu: any;
    getTable(range?: any): any[];
    insertTable(rows: any, columns: any): void;
    showTableTools(table: any, quill: any, options: any): void;
    table: any;
    columnTool: TableColumnTool;
    tableSelection: TableSelection;
    hideTableTools(): void;
}
declare namespace BetterTable {
    export const keyboardBindings: {
        'table-cell-line backspace': {
            key: string;
            format: string[];
            collapsed: boolean;
            offset: number;
            handler(range: any, context: any): boolean;
        };
        'table-cell-line delete': {
            key: string;
            format: string[];
            collapsed: boolean;
            suffix: RegExp;
            handler(): void;
        };
        'table-cell-line enter': {
            key: string;
            shiftKey: any;
            format: string[];
            handler(range: any, context: any): void;
        };
        'table-cell-line up': {
            key: string;
            collapsed: boolean;
            format: string[];
            handler(range: any, context: any): boolean;
        };
        'table-cell-line down': {
            key: string;
            collapsed: boolean;
            format: string[];
            handler(range: any, context: any): boolean;
        };
        'down-to-table': {
            key: string;
            collapsed: boolean;
            handler(range: any, context: any): boolean;
        };
        'up-to-table': {
            key: string;
            collapsed: boolean;
            handler(range: any, context: any): boolean;
        };
    };
}
import TableColumnTool from "./modules/table-column-tool";
import TableSelection from "./modules/table-selection";
