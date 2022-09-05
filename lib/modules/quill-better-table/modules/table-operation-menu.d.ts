export default class TableOperationMenu {
    constructor(params: any, quill: any, options: any);
    tableSelection: any;
    table: any;
    quill: any;
    options: any;
    menuItems: any;
    tableColumnTool: any;
    boundary: any;
    selectedTds: any;
    destroyHandler: any;
    columnToolCells: any;
    colorSubTitle: any;
    cellColors: any;
    mount(): void;
    destroy(): any;
    menuInitial({ table, left, top }: {
        table: any;
        left: any;
        top: any;
    }): void;
    domNode: HTMLDivElement;
    colorsItemCreator(colors: any): HTMLDivElement;
    menuItemCreator({ text, iconSrc, handler }: {
        text: any;
        iconSrc: any;
        handler: any;
    }): HTMLDivElement;
}
