export default class MarkdownShortcuts {
    constructor(quill: any, options: any);
    quill: any;
    options: any;
    ignoreTags: string[];
    matches: {
        name: string;
        pattern: RegExp;
        action: (text: any, selection: any, pattern: any, lineStart: any) => void;
    }[];
    isValid(text: any, tagName: any): boolean;
    onSpace(): void;
    onEnter(): void;
}
