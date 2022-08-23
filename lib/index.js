import React, { useRef, useEffect } from 'react';
import './modules/highlight';
import Quill from 'quill';
import QuillBetterTable from 'quill-better-table';
import Delta from 'quill-delta';
import IconUndo from 'quill/assets/icons/undo.svg';
import IconRedo from 'quill/assets/icons/redo.svg';
import { ImageDrop, ImageResize, MagicUrl, MarkdownShortcuts, ToolbarTable } from './modules/index';
import { imageUpload, linkHandler, undoHandler, redoHandler } from './modules/toolbarHandler';
import { setContent } from './utils';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import './richTextEditor.less';
import './modules/index.less';
const RichTextEditor = (props) => {
    const { modules = {}, content } = props;
    const quillModules = useRef({});
    const toolbarHandlers = useRef({});
    // const quillDomRef = useRef<HTMLDivElement>();
    const quillRef = useRef();
    const editorId = useRef(new Date().getTime() + (100 * Math.random()).toFixed(0));
    // 处理外部传入的modules
    useEffect(() => {
        if (Object.keys(modules).length > 0) {
            const { table, codeHighlight, imageResize = true, imageDrop, magicUrl = true, markdown = true, link = true, imageHandler, } = modules;
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
                        color: Object.assign({ colors: ['#fff', '#ECF3FC', '#999'], text: '背景色' }, (typeof table !== 'boolean' ? table.backgroundColor : null)),
                    },
                };
                quillModules.current.toolbarTable =
                    typeof table !== 'boolean' && table.toolbarOptions !== undefined
                        ? table.toolbarOptions
                        : true; // 添加table的工具栏处理函数，需要先registry，在DidMount中
            }
            if (codeHighlight) {
                quillModules.current.syntax = {
                    languages: typeof codeHighlight !== 'boolean'
                        ? codeHighlight
                        : [
                            { key: 'plain', label: '文本' },
                            { key: 'javascript', label: 'Javascript' },
                            { key: 'java', label: 'Java' },
                            { key: 'python', label: 'Python' },
                            { key: 'clike', label: 'C++/C' },
                            { key: 'csharp', label: 'C#' },
                            { key: 'php', label: 'PHP' },
                            { key: 'sql', label: 'SQL' },
                            { key: 'json', label: 'JSON' },
                            { key: 'bash', label: 'Bash' },
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
                quillModules.current.imageResize = typeof imageResize !== 'boolean' ? imageResize : {};
            }
            // 默认图片拖拽/复制到富文本
            if (imageDrop) {
                quillModules.current.imageDrop = typeof imageDrop !== 'boolean' ? imageDrop : {};
            }
            // 默认支持自动识别URL
            quillModules.current.magicUrl = magicUrl;
            // 默认支持自动识别markdown语法
            quillModules.current.markdownShortcuts = markdown;
            // toolbar handler处理
            toolbarHandlers.current.link = link && linkHandler;
            if (imageHandler) {
                const { imgUploadApi, uploadSuccCB, uploadFailCB } = imageHandler;
                toolbarHandlers.current.image = () => imageUpload(quillRef.current, imgUploadApi, uploadSuccCB, uploadFailCB);
            }
            toolbarHandlers.current.undo = undoHandler;
            toolbarHandlers.current.redo = redoHandler;
        }
        // 设置自定义字体/大小
        const { toolbarOptions } = modules;
        let fontList = ['system', 'wsYaHei', 'songTi', 'serif', 'arial'];
        let sizeList = ['12px', '14px', '18px', '36px'];
        if (toolbarOptions) {
            toolbarOptions.forEach((formats) => {
                if (Array.isArray(formats)) {
                    formats.forEach((format) => {
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
        const SizeStyle = Quill.import('attributors/style/size');
        SizeStyle.whitelist = sizeList;
        Quill.register(SizeStyle, true);
        const FontStyle = Quill.import('formats/font');
        FontStyle.whitelist = fontList;
        Quill.register(FontStyle, true);
        // 设置重做撤销Icon
        const icons = Quill.import('ui/icons');
        icons.undo = IconUndo;
        icons.redo = IconRedo;
    }, [modules]);
    useEffect(() => {
        const { placeholder, 
        // getQuillDomRef,
        getQuill, readOnly = false, onChange, } = props;
        if (quillModules.current['better-table']) {
            Quill.register({
                'modules/better-table': QuillBetterTable,
            }, true);
        }
        Quill.register({
            'modules/imageResize': ImageResize,
            'modules/imageDrop': ImageDrop,
            'modules/magicUrl': MagicUrl,
            'modules/markdownShortcuts': MarkdownShortcuts,
            'modules/toolbarTable': ToolbarTable,
        }, true);
        const lineBreakMatcher = () => {
            const newDelta = new Delta();
            newDelta.insert({ break: '' });
            return newDelta;
        };
        const toolbarOptions = modules.toolbarOptions || [
            ['undo', 'redo'],
            [
                { font: ['system', 'wsYaHei', 'songTi', 'serif', 'arial'] },
                { size: ['12px', false, '18px', '36px'] },
                { header: [1, 2, 3, 4] },
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
        quillRef.current = new Quill(`#editor${editorId.current}`, {
            debug: process.env.NODE_ENV === 'development' ? '-' : false,
            modules: Object.assign(Object.assign({}, quillModules.current), { toolbar: {
                    container: toolbarOptions,
                    handlers: Object.assign({}, toolbarHandlers.current),
                }, clipboard: {
                    matchers: [['BR', lineBreakMatcher]],
                }, keyboard: {
                    bindings: QuillBetterTable.keyboardBindings,
                }, history: {
                    delay: 2000,
                    maxStack: 100,
                    userOnly: true,
                } }),
            placeholder: placeholder || '开始笔记（支持直接Markdown输入）...',
            readOnly,
            bounds: document.body,
            theme: 'snow',
        });
        if (quillRef.current && quillRef.current.theme) {
            quillRef.current.theme.tooltip.root.innerHTML = [
                '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
                '<span>链接文字：</span><input id="link-words" type="text" />',
                '<br />',
                '<span>链接地址：</span><input id="link-url" type="text" data-formula="e=mc^2" data-link="https://www.baidu.com" data-video="Embed URL" />',
                '<a class="ql-action"></a>',
                '<a class="ql-remove"></a>',
            ].join('');
        }
        // 当选中link格式时，弹出tooltip并能修改保存
        quillRef.current.on('selection-change', (range, oldRange, source) => {
            var _a, _b, _c;
            if (range == null)
                return;
            if (range.length === 0 && source === 'user') {
                console.log(4444, (_a = quillRef.current) === null || _a === void 0 ? void 0 : _a.getFormat());
                const format = (_b = quillRef.current) === null || _b === void 0 ? void 0 : _b.getFormat();
                if (format && format.hasOwnProperty('link') && quillRef.current && quillRef.current.theme) {
                    quillRef.current.theme.tooltip.root.classList.add('ql-editing');
                    document.getElementById('link-url').value = format.link;
                    const [leaf, offset] = (_c = quillRef.current) === null || _c === void 0 ? void 0 : _c.getLeaf(range.index);
                    console.log(5555, leaf, offset, leaf.text, leaf.length());
                    document.getElementById('link-words').value = leaf.text;
                    document.querySelector('a.ql-action').onclick = () => {
                        if (quillRef.current) {
                            quillRef.current.deleteText(range.index - offset, leaf.length());
                            quillRef.current.insertText(range.index - offset, document.getElementById('link-words').value, 'link', document.getElementById('link-url').value, 'user');
                            if (quillRef.current.theme)
                                quillRef.current.theme.tooltip.hide();
                        }
                    };
                }
            }
        });
        setContent(content, quillRef.current); // 设置初始内容
        // getQuillDomRef && getQuillDomRef(quillDomRef.current);
        getQuill && getQuill(quillRef.current);
        if (onChange) {
            quillRef.current.on('text-change', (delta, old, source) => {
                source === 'user' && onChange(delta, old);
            });
        }
    }, []);
    useEffect(() => {
        setContent(content, quillRef.current);
    }, [content]);
    return (React.createElement("div", { className: "content-container" },
        React.createElement("div", { id: `editor${editorId.current}` })));
};
export default RichTextEditor;
