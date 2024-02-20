import Quill from 'quill';
import { i18nConfig } from '../../i18n';
import { showTitle } from '../iconTitle/title';

export { LinkHandler } from './link';
export { default as TableHandler } from './table';
export { default as ImageHandler } from './image';
export { default as CodeHandler } from './code';


export const toolbarInit = (quill: Quill, i18n: keyof typeof i18nConfig) => {
  const container = quill.getModule('toolbar').container;

  // 设置 toolbar 中的 i18n 的 label，css 中使用 data-before 来作为 content
  const setDataSet = (cssQuery: string, i18nKey: keyof (typeof i18nConfig)['en']) => {
    const domList = container!.querySelector(cssQuery);
    if (domList) {
      domList.setAttribute('data-before', i18nConfig[i18n][i18nKey]);
    }
  };
  setDataSet('.ql-toolbar .ql-font .ql-picker-label[data-value="system"]', 'toolbarFont');
  setDataSet('.ql-toolbar .ql-font .ql-picker-item[data-value="system"]', 'toolbarFont');

  setDataSet('.ql-snow .ql-picker.ql-header .ql-picker-item', 'toolbarHeader');
  setDataSet('.ql-snow .ql-picker.ql-header .ql-picker-label', 'toolbarHeader');

  setDataSet('.ql-toolbar .ql-font .ql-picker-label[data-value="wsYaHei"]', 'fontYahei');
  setDataSet('.ql-toolbar .ql-font .ql-picker-item[data-value="wsYaHei"]', 'fontYahei');
  setDataSet('.ql-toolbar .ql-font .ql-picker-label[data-value="songTi"]', 'fontSong');
  setDataSet('.ql-toolbar .ql-font .ql-picker-item[data-value="songTi"]', 'fontSong');
  setDataSet('.ql-toolbar .ql-font .ql-picker-label[data-value="kaiTi"]', 'fontKai');
  setDataSet('.ql-toolbar .ql-font .ql-picker-item[data-value="kaiTi"]', 'fontKai');

  window.showTitle = showTitle; // 全局添加 Icon hover 显示tootip函数
}

export const undoHandler = (quill: Quill) => {
  quill?.history?.undo();
}

export const redoHandler = (quill: Quill) => {
  quill?.history?.redo();
}