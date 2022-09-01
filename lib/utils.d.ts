import Quill from 'quill';
export declare function isUrl(url: string): boolean;
export declare function isEmail(url: string): boolean;
export declare function saveLink(quill: Quill & {
    theme?: Record<string, any>;
}, isToolbar: any): void;
export declare function isMobile(): boolean;
export declare function setContent(content: any, quill: Quill): void;
