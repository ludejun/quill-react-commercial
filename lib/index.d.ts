/// <reference types="react" />
import Quill, { RangeStatic, Sources } from 'quill';
import Delta from 'quill-delta';
import 'quill/dist/quill.snow.css';
import './assets/richTextEditor.less';
import './assets/modules.less';
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
    getQuill?: (quill: Quill) => void;
    content?: Delta | string;
    onChange?: (delta: Delta, old: Delta, source?: Sources) => void;
    onFocus?: (range?: RangeStatic) => void;
    onBlur?: (oldRange?: RangeStatic) => void;
}
declare const RichTextEditor: (props: IEditorProps) => JSX.Element;
export default RichTextEditor;
