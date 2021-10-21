import React from 'react';
import './modules/highlight';
import Quill from 'quill';
// window.Quill = Quill;
import QuillBetterTable from 'quill-better-table';
import IconUndo from 'quill/assets/icons/undo.svg';
import IconRedo from 'quill/assets/icons/redo.svg';
import {
  ImageDrop,
  ImageResize,
  MagicUrl,
  MarkdownShortcuts,
  ToolbarTable,
} from './modules/index';
// import { MagicUrl } from './modules/magic-url';
import { imageUpload, linkHandler, undoHandler, redoHandler } from './modules/toolbarHandler';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import './richTextEditor.less';
import './modules/index.less';

const Delta = Quill.import('delta');

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // readOnly: false,
      autoSaveText: '',
    };

    // 处理外部传入的modules
    this.modules = {};
    this.toolbarHandles = {};
    const propsModules = props.modules || {};
    if (propsModules && Object.keys(propsModules).length > 0) {
      if (propsModules.table) {
        this.modules.table = false;
        this.modules['better-table'] = {
          operationMenu: {
            items: propsModules.table.operationMenu || {
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
            color: {
              ...(propsModules.table.backgroundColor || {}),
              colors: ['#fff', '#ECF3FC', '#999'], // 背景色值, ['white', 'red', 'yellow', 'blue'] as default
              text: '背景色', // subtitle, 'Background Colors' as default
            },
          },
          ...propsModules.table,
        };
        this.modules.toolbarTable = propsModules.table.toolBarOptions || true; // 添加table的工具栏处理函数，需要先registry，在DidMount中
      }

      if (propsModules.codeHighlight) {
        this.modules.syntax = {
          languages: [
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
      if (propsModules.imageResize !== false) {
        this.modules.imageResize = propsModules.imageResize instanceof Object ? { ...propsModules.imageResize } : {};
      }
      // 默认图片拖拽/复制到富文本
      if (propsModules.imageDrop !== false) {
        this.modules.imageDrop = propsModules.imageDrop instanceof Object ? { ...propsModules.imageDrop } : {};
      }
      // 默认支持自动识别URL
      if (propsModules.magicUrl !== false) {
        this.modules.magicUrl = true;
      }
      // 默认支持自动识别markdown语法
      if (propsModules.markdown !== false) {
        this.modules.markdownShortcuts = propsModules.markdown instanceof Object ? { ...propsModules.markdown } : {};
      }

      // toolbar handler处理
      this.toolbarHandles.link = linkHandler;
      if (propsModules.imageHandler && propsModules.imageHandler.imgUploadApi) {
        this.toolbarHandles.image = imageUpload.bind(this, propsModules.imageHandler.imgUploadApi);
      }
      this.toolbarHandles.undo = undoHandler;
      this.toolbarHandles.redo = redoHandler;
    }

    // 设置自定义字体/大小
    const SizeStyle = Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['10px', '12px', '18px', '36px'];
    Quill.register(SizeStyle, true);
    const FontStyle = Quill.import('formats/font');
    FontStyle.whitelist = ['wsYaHei', 'songTi', 'serif', 'arial'];
    Quill.register(FontStyle, true);

    // 设置重做撤销Icon
    const icons = Quill.import('ui/icons');
    icons.undo = IconUndo;
    icons.redo = IconRedo;
  }

  componentDidMount() {
    if (this.props.modules && this.props.modules.table) {
      Quill.register(
        {
          'modules/better-table': QuillBetterTable,
          // 'modules/imageResize': ImageResize,
          // 'modules/imageDrop': ImageDrop,
          // 'modules/magicUrl': MagicUrl,
          // 'modules/markdownShortcuts': MarkdownShortcuts,
          // 'modules/toolbarTable': ToolbarTable,
        },
        true,
      );
    }

    Quill.register(
      {
        'modules/imageResize': ImageResize,
        'modules/imageDrop': ImageDrop,
        'modules/magicUrl': MagicUrl,
        'modules/markdownShortcuts': MarkdownShortcuts,
        'modules/toolbarTable': ToolbarTable,
      },
      true,
    );

    const lineBreakMatcher = () => {
      const newDelta = new Delta();
      newDelta.insert({ break: '' });
      return newDelta;
    };

    this.quill = new Quill('#editor', {
      debug: process.env.NODE_ENV === 'development' ? '-' : false,
      modules: {
        // formula: true, // todo 公式，暂不支持
        ...this.modules,
        toolbar: {
          container: '#toolbar', // Selector for toolbar container
          handlers: {
            ...this.toolbarHandles,
            // emoji() {},
            // image: quillImageHandler, // todo 处理图片先上传，再附链接。不处理默认保存base64
          },
        },
        // 'emoji-toolbar': true,
        // 'emoji-shortname': true,
        clipboard: {
          matchers: [['BR', lineBreakMatcher]],
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings,
        },

        history: {
          delay: 2000,
          maxStack: 100,
          userOnly: true,
        },
      },
      placeholder: this.props.placeholder || '开始笔记（支持直接Markdown输入）...',
      readOnly: false,
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
      if (range == null) return;
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
            this.quill.insertText(
              range.index - offset,
              document.getElementById('link-words').value,
              'link',
              document.getElementById('link-url').value,
              'user',
            );
            this.quill.theme.tooltip.hide();
          };
        }
      }
    });

    // AutoSave
    if (this.props.autoSave) {
      const { gap = 120000, textFn } = this.props.autoSave;
      let change = new Delta();
      this.quill.on('text-change', delta => {
        // console.log(444444, delta);
        change = change.compose(delta);
      });
      this.saveTimer = setInterval(() => {
        if (change.length() > 0) {
          console.log('自动化保存中...', change);
          // todo API请求回调
          this.setState({ autoSaveText: textFn ? textFn(new Date()) : `上一次保存时间${new Date()}` });
          change = new Delta();
        }
      }, gap); // 2分钟自动保存一次
    }
  }

  componentWillUnmount() {
    clearInterval(this.saveTimer);
  }

  saveContent() {
    console.log('保存中...', this.quill.getContents());
    // todo API请求
    document.getElementById('quillContent').innerHTML = JSON.stringify(this.quill.getContents());
  }

  render() {
    return (
      <div className="content-container">
        <div id="toolbar">
          <span className="ql-formats">
            <button className="ql-undo" title="撤销(Ctr+Z)" />
            <button className="ql-redo" title="恢复(Ctr+B)" />
          </span>
          <span className="ql-formats">
            <select className="ql-font" defaultValue="wsYaHei">
              <option value="wsYaHei">微软雅黑</option>
              <option value="songTi">宋体</option>
              <option value="serif">serif</option>
              <option value="arial">arial</option>
            </select>
            <select className="ql-size" defaultValue="14px">
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="18px">18px</option>
              <option value="36px">36px</option>
            </select>
          </span>
          <span className="ql-formats">
            <select className="ql-color" title="字体颜色" />
            <select className="ql-background" title="背景颜色" />
          </span>
          <span className="ql-formats">
            <button className="ql-bold" title="粗体(Ctr+B)" />
            <button className="ql-italic" title="斜体(Ctr+I)" />
            <button className="ql-underline" title="下划线(Ctr+U)" />
            <button className="ql-strike" title="中划线(Ctr+B)" />
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" title="有序列表" />
            <button className="ql-list" value="bullet" title="无序列表" />
            <button className="ql-list" value="check" title="任务列表" />
            <button className="ql-indent" value="-1" title="清除缩进" />
            <button className="ql-indent" value="+1" title="缩进" />
            {/* <button className="ql-direction" value="rtl"></button> */}
            <select className="ql-align" title="对齐方式" />
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote" title="引用" />
            {this.modules.codeHighlight ? <button className="ql-code-block" title="代码块" /> : null}
            <button className="ql-link" title="超链接" />
            <button className="ql-image" title="图片" />
            <button className="ql-script" value="sub" title="右下标" />
            <button className="ql-script" value="super" title="右上标" />
            {/* <button className="ql-emoji" /> */}
            {this.modules.table ? <button className="ql-table" title="插入表格" /> : null}
            <button className="ql-clean" />
          </span>
        </div>
        <div id="editor" />
        <div>
          {this.props.autoSave ? <p style={this.props.autoSave.textStyle }>{this.state.autoSaveText}</p> :null}
        </div>
        {/* <button onClick={() => this.saveContent()}>保存</button> */}
        <div id="quillContent" />
      </div>
    );
  }
}

export default RichTextEditor;
