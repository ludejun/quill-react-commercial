import { __assign } from './node_modules/tslib/tslib.es6.js';
import React, { useRef, useEffect } from 'react';
import './node_modules/quill/quill.js';
import Delta_1 from './node_modules/quill-delta/dist/Delta.js';
import IconUndo from './node_modules/quill/assets/icons/undo.svg.js';
import IconRedo from './node_modules/quill/assets/icons/redo.svg.js';
import './modules/index.js';
import { optionDisableToggle, setContent, throttle } from './utils.js';
import { getI18nText } from './i18n.js';
import highlightInit from './modules/highlight.js';
import { undoHandler, redoHandler, toolbarInit } from './modules/toolbar/index.js';
import './node_modules/quill/core.js';
import Quill from './node_modules/quill/core/quill.js';
import BetterTable from './modules/quill-better-table/quill-better-table.js';
import { keyboardBinds } from './modules/keyboard.js';

var RichTextEditor = function (props) {
    var _a = props.modules, modules = _a === void 0 ? {} : _a, content = props.content, _b = props.i18n, i18n = _b === void 0 ? 'en' : _b, _c = props.style, style = _c === void 0 ? {} : _c, _d = props.readOnly, readOnly = _d === void 0 ? false : _d;
    var quillModules = useRef({});
    var toolbarHandlers = useRef({});
    var quillRef = useRef();
    var editorId = useRef(new Date().getTime() + (100 * Math.random()).toFixed(0));
    var uploadedImgsList = useRef([]); // 已上传图片，主要给onComplete使用，可以用来判断哪些已上传图片实际并没有被使用
    // 处理外部传入的modules
    useEffect(function () {
        if (Object.keys(modules).length > 0) {
            var table = modules.table, codeHighlight = modules.codeHighlight, _a = modules.imageResize, imageResize = _a === void 0 ? true : _a, _b = modules.imageDrop, imageDrop = _b === void 0 ? true : _b, _c = modules.magicUrl, magicUrl = _c === void 0 ? true : _c, _d = modules.markdown, markdown = _d === void 0 ? true : _d, _e = modules.link, link = _e === void 0 ? true : _e, imageHandler = modules.imageHandler;
            if (table) {
                quillModules.current.table = false;
                quillModules.current['better-table'] = {
                    i18n: i18n,
                    operationMenu: {
                        items: (typeof table !== 'boolean' && table.operationMenu) ||
                            (i18n === 'zh'
                                ? {
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
                                }
                                : {}),
                        color: __assign({ colors: ['#dbc8ff', '#6918b4', '#4a90e2', '#999', '#fff'], text: getI18nText('tableBackground', i18n) }, (typeof table !== 'boolean' ? table.backgroundColors : null)),
                    },
                };
                quillModules.current.tableHandler = __assign({ i18n: i18n }, (typeof table !== 'boolean' ? table.toolbarOptions : {})); // 添加table的工具栏处理函数，需要先registry，在DidMount中
            }
            if (codeHighlight) {
                // quillModules.current.syntax = {
                //   hljs: highlightInit(),
                // };
                quillModules.current.qSyntax = {
                    i18n: i18n,
                    hljs: highlightInit(),
                    languages: typeof codeHighlight !== 'boolean'
                        ? codeHighlight
                        : [
                            { key: 'plain', label: 'Plain' },
                            { key: 'javascript', label: 'Javascript' },
                            { key: 'java', label: 'Java' },
                            { key: 'python', label: 'Python' },
                            { key: 'cpp', label: 'C++/C' },
                            { key: 'csharp', label: 'C#' },
                            { key: 'php', label: 'PHP' },
                            { key: 'sql', label: 'SQL' },
                            { key: 'json', label: 'JSON' },
                            { key: 'bash', label: 'Bash' },
                            { key: 'go', label: 'Go' },
                            { key: 'objectivec', label: 'Object-C' },
                            { key: 'xml', label: 'Html/xml' },
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
                        : __assign({ i18n: i18n }, (typeof imageResize === 'object' ? imageResize : null));
            }
            // 默认图片拖拽/复制到富文本
            if (imageDrop) {
                quillModules.current.imageDrop =
                    imageDrop === false
                        ? imageDrop
                        : __assign({ i18n: i18n,
                            imageHandler: imageHandler, uploadedImgsList: uploadedImgsList.current }, (typeof imageDrop === 'object' ? imageDrop : null));
            }
            // 默认支持自动识别URL
            quillModules.current.magicUrl = magicUrl;
            // 默认支持自动识别markdown语法
            quillModules.current.markdownShortcuts = markdown;
            // toolbar handler处理
            if (link) {
                quillModules.current.linkHandler = { i18n: i18n };
            }
            quillModules.current.imageHandler = __assign({ i18n: i18n }, imageHandler);
            quillModules.current.codeHandler = true;
            toolbarHandlers.current.undo = function () { return undoHandler(quillRef.current); };
            toolbarHandlers.current.redo = function () { return redoHandler(quillRef.current); };
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
        var SizeStyle = Quill.import('attributors/style/size');
        SizeStyle.whitelist = sizeList;
        Quill.register(SizeStyle, true);
        var FontStyle = Quill.import('formats/font');
        FontStyle.whitelist = fontList;
        Quill.register(FontStyle, true);
        // 设置重做撤销Icon
        var icons = Quill.import('ui/icons');
        icons.undo = IconUndo;
        icons.redo = IconRedo;
    }, [modules]);
    useEffect(function () {
        var placeholder = props.placeholder, getQuill = props.getQuill, onChange = props.onChange, onFocus = props.onFocus, onBlur = props.onBlur;
        if (quillModules.current['better-table']) {
            Quill.register({
                'modules/better-table': BetterTable,
            }, true);
        }
        // Quill.register(Image, true); // 允许图片的样式保存在Delta中
        // Quill.register(ListItem, true); // 允许图片的样式保存在Delta中
        // Quill.register(
        //   {
        //     'modules/imageResize': ImageResize,
        //     'modules/imageDrop': ImageDrop,
        //     'modules/magicUrl': MagicUrl,
        //     'modules/markdownShortcuts': MarkdownShortcuts,
        //     'modules/tableHandler': TableHandler,
        //     'modules/linkHandler': LinkHandler,
        //     'modules/imageHandler': ImageHandler,
        //     'modules/codeHandler': CodeHandler,
        //     'modules/qSyntax': QSyntax,
        //   },
        //   true,
        // );
        var lineBreakMatcher = function () {
            var newDelta = new Delta_1();
            newDelta.insert({ break: '' });
            return newDelta;
        };
        var toolbarOptions = modules.toolbarOptions || [
            ['undo', 'redo', 'clean'],
            [
                { font: ['system', 'wsYaHei', 'songTi', 'serif', 'arial'] },
                { size: ['12px', false, '18px', '36px'] },
                { header: [false, 1, 2, 3, 4] },
            ],
            ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }],
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
            ],
        ];
        quillRef.current = new Quill("#editor" + editorId.current, {
            debug: false,
            modules: __assign(__assign({}, quillModules.current), { toolbar: {
                    container: toolbarOptions,
                    handlers: __assign({}, toolbarHandlers.current),
                }, clipboard: {
                    matchers: [['BR', lineBreakMatcher]],
                }, keyboard: {
                    bindings: __assign(__assign({}, BetterTable.keyboardBindings), keyboardBinds),
                }, history: {
                    delay: 2000,
                    maxStack: 100,
                    userOnly: true,
                } }),
            placeholder: placeholder || getI18nText('placeholder', i18n),
            readOnly: readOnly,
            bounds: document.querySelector("#editor" + editorId.current),
            theme: 'snow',
        });
        toolbarInit(quillRef.current, i18n);
        quillRef.current.on('selection-change', function (range, oldRange, source) {
            var _a;
            if (range == null || !((_a = quillRef.current) === null || _a === void 0 ? void 0 : _a.hasFocus()))
                return;
            // 当新建table或者选中table时，禁止部分toolbar options，添加table时触发的source=api
            if (modules.table && quillRef.current) {
                var disableInTable = ['header', 'blockquote', 'code-block', 'hr', 'list'];
                var format = quillRef.current.getFormat() || {};
                if (format && format['table-cell-line']) {
                    optionDisableToggle(quillRef.current, disableInTable, true);
                }
                else {
                    optionDisableToggle(quillRef.current, disableInTable, false);
                }
            }
        });
        content && setContent(content, quillRef.current); // 设置初始内容
        getQuill && getQuill(quillRef.current, uploadedImgsList.current);
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
        // 解决中文拼音输入时placeholder无法消失的问题
        var dom = document.getElementById("editor" + editorId.current).querySelector('.ql-editor');
        dom.addEventListener('input', throttle(function () {
            if (dom.innerText !== '\n' && dom.classList.contains('ql-blank')) {
                quillRef.current.root.setAttribute('data-placeholder', '');
            }
            else if (dom.innerText === '\n') {
                quillRef.current.root.setAttribute('data-placeholder', placeholder || getI18nText('placeholder', i18n)); // 输入拼音又删除的情况，需要将placeholder再展示出来
            }
        }, 100));
        // 当把placeholder置为空，当内容删为空时，placeholder无法出来
        quillRef.current.on('text-change', throttle(function () {
            if (quillRef.current.getText() === '\n' &&
                quillRef.current.root.getAttribute('data-placeholder') === '') {
                quillRef.current.root.setAttribute('data-placeholder', placeholder || getI18nText('placeholder', i18n));
            }
        }));
    }, []);
    useEffect(function () {
        if (content) {
            setContent(content, quillRef.current);
        }
    }, [content]);
    useEffect(function () {
        if (quillRef.current) {
            if (readOnly) {
                quillRef.current.enable(false);
            }
            else {
                quillRef.current.enable();
            }
        }
    }, [readOnly]);
    return (React.createElement("div", { className: "ql-editor-container", style: style },
        React.createElement("div", { id: "editor" + editorId.current })));
};

export { RichTextEditor as default };
