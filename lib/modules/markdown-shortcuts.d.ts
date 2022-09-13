export default MarkdownShortcuts;
declare class MarkdownShortcuts {
    constructor(quill: any, options: any);
    quill: any;
    options: any;
    ignoreElements: any;
    ignoreTags: string[];
    matches: {
        name: string;
        pattern: RegExp;
        action: (text: any, selection: any, pattern: any, lineStart: any) => void;
    }[];
    isValid(text: any, tagName: any): boolean;
    onSpace(): void;
    onEnter(): void;
    onDelete(): void;
    isLastBrElement(range: any): boolean;
    isEmptyLine(range: any): boolean;
}
