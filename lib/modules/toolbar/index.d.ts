import Quill from 'quill';
import { i18nConfig } from '../../i18n';
export { LinkHandler } from './link';
export { default as TableHandler } from './table';
export { default as ImageHandler } from './image';
export declare const toolbarInit: (quill: Quill, i18n: keyof typeof i18nConfig) => void;
export declare const undoHandler: (quill: Quill) => void;
export declare const redoHandler: (quill: Quill) => void;
