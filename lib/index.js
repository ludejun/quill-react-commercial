'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./node_modules/tslib/tslib.es6.js');
var React = require('react');
var quill = require('./node_modules/quill/dist/quill.js');
var Delta = require('./node_modules/quill-delta/dist/Delta.js');
var undo = require('./node_modules/quill/assets/icons/undo.svg.js');
var redo = require('./node_modules/quill/assets/icons/redo.svg.js');
var imagePasteDrop = require('./modules/imagePasteDrop.js');
var imageResize = require('./modules/imageResize.js');
var magicUrl = require('./modules/magic-url.js');
var markdownShortcuts = require('./modules/markdown-shortcuts.js');
var toolbarTable = require('./modules/toolbar-table.js');
var highlight = require('./modules/highlight.js');
var quillBetterTable = require('./modules/quill-better-table/quill-better-table.js');
var image = require('./modules/image.js');
var toolbarHandler = require('./modules/toolbarHandler.js');
var utils = require('./utils.js');
require('./node_modules/quill/dist/quill.snow.css.js');
require('./assets/richTextEditor.less.js');
require('./assets/modules.less.js');

var RichTextEditor = function (props) {
    var _a = props.modules, modules = _a === void 0 ? {} : _a, content = props.content, _b = props.title, title = _b === void 0 ? false : _b;
    var quillModules = React.useRef({});
    var toolbarHandlers = React.useRef({});
    // const quillDomRef = useRef<HTMLDivElement>();
    var quillRef = React.useRef();
    var editorId = React.useRef(new Date().getTime() + (100 * Math.random()).toFixed(0));
    // 处理外部传入的modules
    React.useEffect(function () {
        if (Object.keys(modules).length > 0) {
            var table = modules.table, codeHighlight = modules.codeHighlight, _a = modules.imageResize, imageResize = _a === void 0 ? true : _a, _b = modules.imageDrop, imageDrop = _b === void 0 ? true : _b, _c = modules.magicUrl, magicUrl = _c === void 0 ? true : _c, _d = modules.markdown, markdown = _d === void 0 ? true : _d, _e = modules.link, link = _e === void 0 ? true : _e, imageHandler = modules.imageHandler;
            if (table) {
                quillModules.current.table = false;
                quillModules.current['better-table'] = {
                    operationMenu: {
                        items: typeof table !== 'boolean'
                            ? table.operationMenu
                            : {
                                insertColumnRight: {
                                    text: '右侧插入列',
                                },
                                insertColumnLeft: {
                                    text: '左侧插入列',
                                },
                                insertRowUp: {
                                    text: '上方插入行',
                                },
                                insertRowDown: {
                                    text: '下方插入行',
                                },
                                mergeCells: {
                                    text: '合并单元格',
                                },
                                unmergeCells: {
                                    text: '取消单元格合并',
                                },
                                deleteColumn: {
                                    text: '删除列',
                                },
                                deleteRow: {
                                    text: '删除行',
                                },
                                deleteTable: {
                                    text: '删除表格',
                                },
                            },
                        color: tslib_es6.__assign({ colors: ['#fff', '#ECF3FC', '#999'], text: '背景色' }, (typeof table !== 'boolean' ? table.backgroundColor : null)),
                    },
                };
                quillModules.current.toolbarTable =
                    typeof table !== 'boolean' && table.toolbarOptions !== undefined
                        ? table.toolbarOptions
                        : true; // 添加table的工具栏处理函数，需要先registry，在DidMount中
            }
            if (codeHighlight) {
                quillModules.current.syntax = {
                    hljs: highlight.default(),
                    languages: typeof codeHighlight !== 'boolean'
                        ? codeHighlight
                        : [
                            { key: 'plain', label: '文本' },
                            { key: 'javascript', label: 'Javascript' },
                            { key: 'java', label: 'Java' },
                            { key: 'python', label: 'Python' },
                            { key: 'cpp', label: 'C++/C' },
                            { key: 'csharp', label: 'C#' },
                            { key: 'php', label: 'PHP' },
                            { key: 'sql', label: 'SQL' },
                            { key: 'json', label: 'JSON' },
                            { key: 'shell', label: 'Shell' },
                            { key: 'go', label: 'Go' },
                            { key: 'objectivec', label: 'Objective-C' },
                            { key: 'xml', label: 'HTML/XML' },
                            { key: 'css', label: 'CSS' },
                            { key: 'ruby', label: 'Ruby' },
                            { key: 'swift', label: 'Swift' },
                            { key: 'scala', label: 'Scala' },
                        ],
                };
            }
            // 默认添加图片缩放功能
            if (imageResize) {
                quillModules.current.imageResize =
                    imageResize === false
                        ? imageResize
                        : tslib_es6.__assign({ onUpdate: function () {
                                console.log('img update');
                            } }, (typeof imageResize === 'object' ? imageResize : null));
            }
            // 默认图片拖拽/复制到富文本
            if (imageDrop) {
                quillModules.current.imageDrop =
                    imageDrop === false
                        ? imageDrop
                        : tslib_es6.__assign({ imageHandler: imageHandler }, (typeof imageDrop === 'object' ? imageDrop : null));
            }
            // 默认支持自动识别URL
            quillModules.current.magicUrl = magicUrl;
            // 默认支持自动识别markdown语法
            quillModules.current.markdownShortcuts = markdown;
            // toolbar handler处理
            toolbarHandlers.current.link = link && toolbarHandler.linkHandler;
            if (imageHandler) {
                var imgUploadApi_1 = imageHandler.imgUploadApi, uploadSuccCB_1 = imageHandler.uploadSuccCB, uploadFailCB_1 = imageHandler.uploadFailCB;
                toolbarHandlers.current.image = function () {
                    return toolbarHandler.imageUpload(quillRef.current, imgUploadApi_1, uploadSuccCB_1, uploadFailCB_1);
                };
            }
            toolbarHandlers.current.undo = toolbarHandler.undoHandler;
            toolbarHandlers.current.redo = toolbarHandler.redoHandler;
        }
        // 设置自定义字体/大小
        var toolbarOptions = modules.toolbarOptions;
        var fontList = ['system', 'wsYaHei', 'songTi', 'serif', 'arial'];
        var sizeList = ['12px', '14px', '18px', '36px'];
        if (toolbarOptions) {
            toolbarOptions.forEach(function (formats) {
                if (Array.isArray(formats)) {
                    formats.forEach(function (format) {
                        if (typeof format === 'object') {
                            if (format.font && Array.isArray(format.font)) {
                                fontList = format.font;
                            }
                            if (format.size && Array.isArray(format.size)) {
                                sizeList = format.size;
                            }
                        }
                    });
                }
            });
        }
        var SizeStyle = quill.default.import('attributors/style/size');
        SizeStyle.whitelist = sizeList;
        quill.default.register(SizeStyle, true);
        var FontStyle = quill.default.import('formats/font');
        FontStyle.whitelist = fontList;
        quill.default.register(FontStyle, true);
        // 设置重做撤销Icon
        var icons = quill.default.import('ui/icons');
        icons.undo = undo.default;
        icons.redo = redo.default;
    }, [modules]);
    React.useEffect(function () {
        var _a, _b;
        var placeholder = props.placeholder, 
        // getQuillDomRef,
        getQuill = props.getQuill, _c = props.readOnly, readOnly = _c === void 0 ? false : _c, onChange = props.onChange, onFocus = props.onFocus, onBlur = props.onBlur;
        if (quillModules.current['better-table']) {
            quill.default.register({
                'modules/better-table': quillBetterTable.default,
            }, true);
        }
        quill.default.register(image.default, true);
        quill.default.register({
            'modules/imageResize': imageResize.default,
            'modules/imageDrop': imagePasteDrop.ImageDrop,
            'modules/magicUrl': magicUrl.MagicUrl,
            'modules/markdownShortcuts': markdownShortcuts.default,
            'modules/toolbarTable': toolbarTable.default,
        }, true);
        var lineBreakMatcher = function () {
            var newDelta = new Delta.default();
            newDelta.insert({ break: '' });
            return newDelta;
        };
        var toolbarOptions = modules.toolbarOptions || [
            ['undo', 'redo'],
            [
                { font: ['system', 'wsYaHei', 'songTi', 'serif', 'arial'] },
                { size: ['12px', false, '18px', '36px'] },
                { header: [false, 1, 2, 3, 4] },
            ],
            [{ color: [] }, { background: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { list: 'check' },
                { indent: '-1' },
                { indent: '+1' },
                { align: [] },
            ],
            [
                'blockquote',
                modules.codeHighlight ? 'code-block' : undefined,
                modules.link !== false ? 'link' : undefined,
                'image',
                { script: 'sub' },
                { script: 'super' },
                quillModules.current['better-table'] ? 'table' : undefined,
                'clean',
            ],
        ];
        quillRef.current = new quill.default("#editor" + editorId.current, {
            debug: false,
            modules: tslib_es6.__assign(tslib_es6.__assign({}, quillModules.current), { toolbar: {
                    container: toolbarOptions,
                    handlers: tslib_es6.__assign({}, toolbarHandlers.current),
                }, clipboard: {
                    matchers: [['BR', lineBreakMatcher]],
                }, keyboard: {
                    bindings: tslib_es6.__assign(tslib_es6.__assign({}, quillBetterTable.default.keyboardBindings), { 
                        // 有序列表只能输入“1. ”才会触发，改变比如输入“30. ”会变为“1. ”开始的有序列表的行为
                        'list autofill': {
                            prefix: /^\s*(1{1,1}\.)$/,
                            format: {
                                list: false,
                                'code-block': false,
                                blockquote: false,
                                header: false,
                                table: false,
                                'table-cell-line': false,
                            },
                        }, 
                        // bugfix: 当最开始是code块、list、引用块时，无法使用Backspace删除样式
                        'code backspace': {
                            key: 'Backspace',
                            format: ['code-block', 'list', 'blockquote'],
                            handler: function (range, context) {
                                var _a, _b;
                                var quill = quillRef.current;
                                if (quill) {
                                    var line = quill.getLine(range.index)[0];
                                    var isEmpty = !line.children.head.text || line.children.head.text.trim() === '';
                                    var format = quill.getFormat(range);
                                    var allCode = (_b = (_a = context === null || context === void 0 ? void 0 : context.line) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.cachedText;
                                    // 当是起始，代码块且整块中已无字符，或引用/列表且当前行为空，去除当前行格式；其他情况执行默认Backspace的handler
                                    if (range.index === 0 &&
                                        context.suffix === '' &&
                                        ((format['code-block'] && (allCode === '\n' || allCode === '')) ||
                                            (!format['code-block'] && isEmpty))) {
                                        quill.removeFormat(range.index, range.length);
                                        return false;
                                    }
                                }
                                return true;
                            },
                        } }),
                }, history: {
                    delay: 2000,
                    maxStack: 100,
                    userOnly: true,
                } }),
            placeholder: placeholder || '开始笔记（支持直接Markdown输入）...',
            readOnly: readOnly,
            bounds: document.querySelector("#editor" + editorId.current),
            theme: 'snow',
        });
        if (quillRef.current && quillRef.current.theme) {
            quillRef.current.theme.tooltip.root.innerHTML = [
                '<span>链接文字：</span><input id="link-words" type="text" /><a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank">跳转</a>',
                '<br />',
                '<span>链接地址：</span><input id="link-url" type="text" data-formula="e=mc^2" data-link="https://example.com" data-video="Embed URL" />',
                '<a class="ql-action"></a>',
                '<a class="ql-remove"></a>',
            ].join('');
        }
        quillRef.current.on('selection-change', function (range, oldRange, source) {
            var _a, _b, _c, _d;
            try {
                if (range == null || !((_a = quillRef.current) === null || _a === void 0 ? void 0 : _a.hasFocus()))
                    return;
                // 当选中link格式时，弹出tooltip并能修改保存
                if (modules.link !== false && range.length === 0 && source === 'user') {
                    console.log(4444, (_b = quillRef.current) === null || _b === void 0 ? void 0 : _b.getFormat());
                    var format = (_c = quillRef.current) === null || _c === void 0 ? void 0 : _c.getFormat();
                    if (format &&
                        format.hasOwnProperty('link') &&
                        quillRef.current &&
                        quillRef.current.theme) {
                        quillRef.current.theme.tooltip.root.classList.add('ql-editing');
                        document.getElementById('link-url').value = format.link;
                        document.querySelector('a.ql-preview').href = format.link;
                        var _e = (_d = quillRef.current) === null || _d === void 0 ? void 0 : _d.getLeaf(range.index), leaf_1 = _e[0], offset_1 = _e[1];
                        console.log(5555, leaf_1, offset_1, leaf_1.text, leaf_1.length());
                        document.getElementById('link-words').value = leaf_1.text;
                        document.querySelector('a.ql-action').onclick = function () {
                            if (quillRef.current) {
                                quillRef.current.deleteText(range.index - offset_1, leaf_1.length());
                                utils.saveLink(quillRef.current, range.index - offset_1);
                            }
                        };
                    }
                }
                // 当新建table或者选中table时，禁止部分toolbar options，添加table时触发的source=api
                if (modules.table && quillRef.current) {
                    var disableInTable = ['header', 'blockquote', 'code-block', 'hr', 'list'];
                    var format = quillRef.current.getFormat() || {};
                    if (format && format['table-cell-line']) {
                        utils.optionDisableToggle(quillRef.current, disableInTable, true);
                    }
                    else {
                        utils.optionDisableToggle(quillRef.current, disableInTable, false);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        // quillRef.current.on('editor-change', (eventName, ...args) => {
        //   console.log(
        //     'editor-change',
        //     eventName,
        //     args,
        //     quillRef.current.getFormat(),
        //     quillRef.current.hasFocus(),
        //   );
        //   if (modules.table && quillRef.current.hasFocus() && args[2] === 'user') {
        //     const disableInTable = ['header', 'blockquote', 'code-block', 'hr', 'list'];
        //     const format = quillRef.current.getFormat() || {};
        //     if (format && format['table-cell-line']) {
        //       optionDisableToggle(quillRef.current, disableInTable, true);
        //     } else {
        //       optionDisableToggle(quillRef.current, disableInTable, false);
        //     }
        //   }
        // });
        content && utils.setContent(content, quillRef.current); // 设置初始内容
        // getQuillDomRef && getQuillDomRef(quillDomRef.current);
        getQuill && getQuill(quillRef.current);
        if (onChange) {
            quillRef.current.on('text-change', function (delta, old, source) {
                source === 'user' && onChange(delta, old);
            });
        }
        if (onFocus || onBlur) {
            quillRef.current.on('selection-change', function (range, oldRange, source) {
                var hasFocus = range && !oldRange;
                var hasBlur = !range && oldRange;
                if (onFocus && hasFocus)
                    onFocus(range);
                if (onBlur && hasBlur)
                    onBlur(oldRange);
            });
        }
        if (title) {
            (_b = (_a = document
                .getElementById("editor" + editorId.current)) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(document.querySelector("#editor" + editorId.current + " + input"), document.getElementById("editor" + editorId.current));
        }
    }, []);
    React.useEffect(function () {
        content && quillRef.current && utils.setContent(content, quillRef.current);
    }, [content]);
    var renderTitle = function () {
        if (title) {
            var config_1 = title === true ? {} : title;
            return (React.createElement("input", { type: "text", placeholder: config_1.placeholder, className: "title-input", onChange: function (e) {
                    return config_1.onChange && config_1.onChange(e.target.value);
                }, defaultValue: config_1.defaultValue, value: config_1.value, onFocus: config_1.onFocus, onBlur: config_1.onBlur }));
        }
        else {
            return null;
        }
    };
    return (React.createElement("div", { className: "content-container" },
        React.createElement("div", { id: "editor" + editorId.current }),
        renderTitle()));
};

exports.default = RichTextEditor;
