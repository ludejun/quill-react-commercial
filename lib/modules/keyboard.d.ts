import { Range } from 'quill';
export declare const keyboardBindsFn: (options: any) => {
    'list autofill': {
        key: string;
        collapsed: boolean;
        prefix: RegExp;
        format: {
            list: boolean;
            'code-block': boolean;
            blockquote: boolean;
            header: boolean;
            table: boolean;
            'table-cell-line': boolean;
        };
        handler(range: Range, context: any): void;
    };
    'code backspace': {
        key: string;
        format: string[];
        handler(range: Range, context: {
            line: {
                parent: {
                    domNode: HTMLDivElement;
                };
            };
            suffix: string;
            prefix: string;
            offset: number;
        }): boolean;
    };
    save: {
        key: string;
        shortKey: boolean;
        handler(range: Range, context: any): boolean;
    };
};
