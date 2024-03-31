export declare const keyboardBinds: {
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
        handler(range: any, context: any): void;
    };
    'code backspace': {
        key: string;
        format: string[];
        handler(range: any, context: {
            line: {
                parent: {
                    cachedText?: string;
                };
            };
            suffix: string;
            prefix: string;
            offset: number;
        }): boolean;
    };
};
