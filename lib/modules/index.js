'use strict';

var quill = require('../node_modules/quill/dist/quill.js');
var imagePasteDrop = require('./imagePasteDrop.js');
var imageResize = require('./imageResize.js');
var magicUrl = require('./magic-url.js');
var markdownShortcuts = require('./markdown-shortcuts.js');
require('../node_modules/highlight.js/lib/core.js');
require('../node_modules/highlight.js/lib/languages/swift.js');
require('../node_modules/highlight.js/styles/xcode.css.js');
var quillBetterTable = require('./quill-better-table/quill-better-table.js');
var image = require('./customeFormats/image.js');
var listItem = require('./customeFormats/listItem.js');
var link = require('./toolbar/link.js');
var table = require('./toolbar/table.js');
var image$1 = require('./toolbar/image.js');
var code = require('./toolbar/code.js');
var syntax = require('./customeFormats/syntax.js');

quill.default.register(image.default, true); // 允许图片的样式保存在Delta中
quill.default.register(listItem.ListItem, true); // 允许图片的样式保存在Delta中
quill.default.register({
    'modules/imageResize': imageResize.default,
    'modules/imageDrop': imagePasteDrop.ImageDrop,
    'modules/magicUrl': magicUrl.MagicUrl,
    'modules/markdownShortcuts': markdownShortcuts.default,
    'modules/tableHandler': table.default,
    'modules/linkHandler': link.LinkHandler,
    'modules/imageHandler': image$1.default,
    'modules/codeHandler': code.default,
    'modules/qSyntax': syntax.default,
}, true);

exports.ImageDrop = imagePasteDrop.ImageDrop;
exports.ImageResize = imageResize.default;
exports.MagicUrl = magicUrl.MagicUrl;
exports.MarkdownShortcuts = markdownShortcuts.default;
exports.QuillBetterTable = quillBetterTable.default;
exports.Image = image.default;
exports.ListItem = listItem.ListItem;
exports.LinkHandler = link.LinkHandler;
exports.TableHandler = table.default;
exports.ImageHandler = image$1.default;
exports.CodeHandler = code.default;
exports.QSyntax = syntax.default;
