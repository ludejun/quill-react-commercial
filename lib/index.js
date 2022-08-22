import React, { createRef } from 'react';
import './modules/highlight';
import Quill from 'quill';
import QuillBetterTable from 'quill-better-table';
import IconUndo from 'quill/assets/icons/undo.svg';
import IconRedo from 'quill/assets/icons/redo.svg';
import Delta from 'quill-delta';
import { ImageDrop, ImageResize, MagicUrl, MarkdownShortcuts, ToolbarTable, } from './modules/index';
// import { MagicUrl } from './modules/magic-url';
import { imageUpload, linkHandler, undoHandler, redoHandler, } from './modules/toolbarHandler';
import { setContent } from './utils';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import './richTextEditor.less';
import './modules/index.less';
class RichTextEditor extends React.Component {
    constructor(props) {
        super(props);
        const { modules = {} } = props;
        this.quillModules = {};
        this.toolbarHandlers = {};
        this.quillRef = createRef();
        this.editorId = new Date().getTime() + (100 * Math.random()).toFixed(0);
        // 处理外部传入的modules
        if (Object.keys(modules).length > 0) {
            const { table, codeHighlight, imageResize = true, imageDrop, magicUrl = true, markdown = true, link = true, imageHandler, } = modules;
            if (table) {
                this.quillModules.table = false;
                this.quillModules['better-table'] = {
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
                this.quillModules.toolbarTable =
                    typeof table !== 'boolean' && table.toolbarOptions !== undefined
                        ? table.toolbarOptions
                        : true; // 添加table的工具栏处理函数，需要先registry，在DidMount中
            }
            if (codeHighlight) {
                this.quillModules.syntax = {
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
                this.quillModules.imageResize =
                    typeof imageResize !== 'boolean' ? imageResize : {};
            }
            // 默认图片拖拽/复制到富文本
            if (imageDrop) {
                this.quillModules.imageDrop =
                    typeof imageDrop !== 'boolean' ? imageDrop : {};
            }
            // 默认支持自动识别URL
            this.quillModules.magicUrl = magicUrl;
            // 默认支持自动识别markdown语法
            this.quillModules.markdownShortcuts = markdown;
            // toolbar handler处理
            this.toolbarHandlers.link = link && linkHandler;
            if (imageHandler) {
                const { imgUploadApi, uploadSuccCB, uploadFailCB } = imageHandler;
                this.toolbarHandlers.image = imageUpload.bind(this, imgUploadApi, uploadSuccCB, uploadFailCB);
            }
            this.toolbarHandlers.undo = undoHandler;
            this.toolbarHandlers.redo = redoHandler;
        }
        // 设置自定义字体/大小
        const { toolbarOptions } = modules;
        let fontList = ['system', 'wsYaHei', 'songTi', 'serif', 'arial'];
        // const fontMapping = { 微软雅黑: 'wsYaHei', 宋体: 'songTi', 楷体: 'kaiTi'};
        let sizeList = ['12px', '14px', '18px', '36px'];
        if (toolbarOptions) {
            toolbarOptions.forEach(formats => {
                if (Array.isArray(formats)) {
                    formats.forEach(format => {
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
    }
    componentDidMount() {
        const { modules = {}, placeholder, getQuillDomRef, getQuill, content, readOnly = false, onChange, } = this.props;
        if (this.quillModules['better-table']) {
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
                this.quillModules['better-table'] ? 'table' : undefined,
                'clean',
            ],
        ];
        this.quill = new Quill(`#editor${this.editorId}`, {
            debug: process.env.NODE_ENV === 'development' ? '-' : false,
            modules: Object.assign(Object.assign({}, this.quillModules), { toolbar: {
                    container: toolbarOptions,
                    handlers: Object.assign({}, this.toolbarHandlers),
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
        this.quill.theme.tooltip.root.innerHTML = [
            '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
            '<span>链接文字：</span><input id="link-words" type="text" />',
            '<br />',
            '<span>链接地址：</span><input id="link-url" type="text" data-formula="e=mc^2" data-link="https://www.baidu.com" data-video="Embed URL" />',
            '<a class="ql-action"></a>',
            '<a class="ql-remove"></a>',
        ].join('');
        // 当选中link格式时，弹出tooltip并能修改保存
        this.quill.on('selection-change', (range, oldRange, source) => {
            if (range == null)
                return;
            if (range.length === 0 && source === 'user') {
                // const [link, offset] = this.quill.scroll.descendant(LinkBlot, range.index);
                // if (link != null) {
                //   this.quill.theme.tooltip.root.classList.add('ql-editing');
                // }
                console.log(4444, this.quill.getFormat());
                const format = this.quill.getFormat();
                if (format.hasOwnProperty('link')) {
                    this.quill.theme.tooltip.root.classList.add('ql-editing');
                    document.getElementById('link-url').value = format.link;
                    const [leaf, offset] = this.quill.getLeaf(range.index);
                    console.log(5555, leaf, offset, leaf.text, leaf.length());
                    document.getElementById('link-words').value = leaf.text;
                    document.querySelector('a.ql-action').onclick = () => {
                        console.log(document.getElementById('link-url').value);
                        this.quill.deleteText(range.index - offset, leaf.length());
                        this.quill.insertText(range.index - offset, document.getElementById('link-words').value, 'link', document.getElementById('link-url').value, 'user');
                        this.quill.theme.tooltip.hide();
                    };
                }
            }
        });
        setContent(content, this.quill); // 设置初始内容
        getQuillDomRef && getQuillDomRef(this.quillRef);
        getQuill && getQuill(this.quill);
        if (onChange) {
            this.quill.on('text-change', (delta, old, source) => {
                source === 'user' && onChange(delta, old);
            });
        }
    }
    componentDidUpdate(preProps) {
        const { content: preContent } = preProps;
        const { content } = this.props;
        if (preContent !== content) {
            setContent(content, this.quill);
        }
    }
    componentWillUnmount() {
        // clearInterval(this.saveTimer);
    }
    render() {
        return (React.createElement("div", { className: "content-container" },
            React.createElement("div", { id: `editor${this.editorId}`, ref: this.quillRef })));
    }
}
export default RichTextEditor;
