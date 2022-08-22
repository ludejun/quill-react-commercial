import React, { Ref } from 'react';
import './modules/highlight';
import Quill from 'quill';
import Delta from 'quill-delta';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import './richTextEditor.less';
import './modules/index.less';
interface IBetterTable {
    operationMenu?: {
        insertColumnRight?: {
            text: string;
        };
        insertColumnLeft?: {
            text: string;
        };
        insertRowUp?: {
            text: string;
        };
        insertRowDown?: {
            text: string;
        };
        mergeCells?: {
            text: string;
        };
        unmergeCells?: {
            text: string;
        };
        deleteColumn?: {
            text: string;
        };
        deleteRow?: {
            text: string;
        };
        deleteTable?: {
            text: string;
        };
    };
    backgroundColor?: {
        colors?: string[];
        text?: string;
    };
    toolbarOptions?: boolean | {
        dialogRows?: number;
        dialogColumns?: number;
        rowLabel?: string;
        columnLabel?: string;
        okLabel?: string;
    };
}
interface IModules {
    table?: boolean | IBetterTable;
    codeHighlight?: boolean | {
        key: string;
        label: string;
    }[];
    imageResize?: boolean | {};
    imageDrop?: boolean | {};
    magicUrl?: boolean;
    markdown?: boolean;
    link?: boolean | {};
}
interface IEditorProps {
    placeholder?: string;
    readOnly?: boolean;
    modules?: {
        imageHandler?: {
            imgUploadApi: (formData: any) => Promise<string>;
            uploadSuccCB?: (data: unknown) => void;
            uploadFailCB?: (error: unknown) => void;
        };
        toolbarOptions?: [][];
    } & IModules;
    getQuillDomRef?: (instance: Ref<HTMLDivElement>) => void;
    getQuill?: (quill: Quill) => void;
    content?: Delta | string;
    onChange?: (delta: Delta, old: Delta, source?: string) => void;
}
declare class RichTextEditor extends React.Component<IEditorProps> {
    quillModules: IModules & {
        'better-table'?: any;
        toolbarTable?: any;
        syntax?: any;
        markdownShortcuts?: boolean;
    };
    toolbarHandlers: Record<string, () => void>;
    quill: Quill;
    quillRef: React.RefObject<HTMLDivElement>;
    editorId: string;
    constructor(props: IEditorProps);
    componentDidMount(): void;
    componentDidUpdate(preProps: any): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default RichTextEditor;
