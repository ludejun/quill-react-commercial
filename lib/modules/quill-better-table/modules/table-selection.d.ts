export default class TableSelection {
    constructor(table: any, quill: any, options: any);
    table: any;
    quill: any;
    options: any;
    boundary: {};
    selectedTds: any[];
    dragging: boolean;
    selectingHandler: any;
    clearSelectionHandler: any;
    helpLinesInitial(): void;
    mouseDownHandler(e: any): void;
    correctBoundary(): void;
    computeSelectedTds(): any;
    repositionHelpLines(): void;
    refreshHelpLinesPosition(): void;
    destroy(): any;
    setSelection(startRect: any, endRect: any): void;
    clearSelection(): void;
}
