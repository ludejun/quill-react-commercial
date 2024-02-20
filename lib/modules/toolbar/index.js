'use strict';

var i18n = require('../../i18n.js');
var title = require('../iconTitle/title.js');
var link = require('./link.js');
var table = require('./table.js');
var image = require('./image.js');
var code = require('./code.js');

var toolbarInit = function (quill, i18n$1) {
    var container = quill.getModule('toolbar').container;
    // 设置 toolbar 中的 i18n 的 label，css 中使用 data-before 来作为 content
    var setDataSet = function (cssQuery, i18nKey) {
        var domList = container.querySelector(cssQuery);
        if (domList) {
            domList.setAttribute('data-before', i18n.i18nConfig[i18n$1][i18nKey]);
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
    window.showTitle = title.showTitle; // 全局添加 Icon hover 显示tootip函数
};
var undoHandler = function (quill) {
    var _a;
    (_a = quill === null || quill === void 0 ? void 0 : quill.history) === null || _a === void 0 ? void 0 : _a.undo();
};
var redoHandler = function (quill) {
    var _a;
    (_a = quill === null || quill === void 0 ? void 0 : quill.history) === null || _a === void 0 ? void 0 : _a.redo();
};

exports.LinkHandler = link.LinkHandler;
exports.TableHandler = table.default;
exports.ImageHandler = image.default;
exports.CodeHandler = code.default;
exports.redoHandler = redoHandler;
exports.toolbarInit = toolbarInit;
exports.undoHandler = undoHandler;
