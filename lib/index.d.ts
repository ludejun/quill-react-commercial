import { CSSProperties, FC } from 'react';
import Quill, { Range } from 'quill';
import Delta from 'quill-delta';
import 'quill/dist/quill.snow.css';
import './assets/richTextEditor.less';
import './assets/modules.less';
import './assets/toolbar.less';
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
    backgroundColors?: {
        colors?: string[];
        text?: string;
    };
    toolbarOptions?: {
        dialogRows?: number;
        dialogColumns?: number;
        i18n?: 'en' | 'zh' | 'es';
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
            imgUploadApi?: (formData: any) => Promise<string>;
            uploadSuccCB?: (data: unknown) => void;
            uploadFailCB?: (error: unknown) => void;
            imgRemarkPre?: string;
            maxSize?: number;
            imageAccept?: string;
        };
        toolbarOptions?: [][];
    } & IModules;
    getQuill?: (quill: Quill, uploadedImgsList?: string[]) => void;
    content?: Delta | string;
    onChange?: (delta: Delta, old: Delta) => void;
    onFocus?: (range?: Range) => void;
    onBlur?: (oldRange?: Range) => void;
    onSave?: () => void;
    i18n?: 'en' | 'zh' | 'es';
    style?: CSSProperties;
    theme?: 'bubble' | 'snow';
}
declare const RichTextEditor: FC<IEditorProps>;
export default RichTextEditor;
