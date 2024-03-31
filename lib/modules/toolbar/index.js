import { i18nConfig } from '../../i18n.js';
import { showTitle } from '../iconTitle/title.js';
export { LinkHandler } from './link.js';
export { default as TableHandler } from './table.js';
export { default as ImageHandler } from './image.js';
export { default as CodeHandler } from './code.js';

var toolbarInit = function (quill, i18n) {
    var container = quill.getModule('toolbar').container;
    // 设置 toolbar 中的 i18n 的 label，css 中使用 data-before 来作为 content
    var setDataSet = function (cssQuery, i18nKey) {
        var domList = container.querySelector(cssQuery);
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
};
var undoHandler = function (quill) {
    var _a;
    (_a = quill === null || quill === void 0 ? void 0 : quill.history) === null || _a === void 0 ? void 0 : _a.undo();
};
var redoHandler = function (quill) {
    var _a;
    (_a = quill === null || quill === void 0 ? void 0 : quill.history) === null || _a === void 0 ? void 0 : _a.redo();
};

export { redoHandler, toolbarInit, undoHandler };
