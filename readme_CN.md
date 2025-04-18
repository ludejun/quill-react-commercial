# quill-react-commercial

Quill 作为很出众并流行的开源富文本编辑器，有着良好的数据结构、API 和插件系统，但是由于多年的更新难产及众多插件的过时、体验差，急需一款能用于生产、满足体验与扩展、能自定义、可以面向商业化的 Quill 富文本编辑器。

微信小程序的富文本编辑器也使用的 Quill 底层和数据结构，可以和 quill-react-commercial 打通编辑和展示。

![quill-react-commercial-zh](https://raw.githubusercontent.com/ludejun/quill-react-commercial/master/example/images/quill-react-commercial-zh.jpg)

## 特性

- 使用最新的quill@2.0.2，方便向后兼容。使用 React Hooks 实现，TS 支持，Rollup 打包。

- 图片支持本地上传和图片 Url 插入，可以限制上传图片格式和大小

- 所有图片支持 Base64 显示，后台上传远端，上传失败点击重新上传。图片支持复制和拖拽进入。

- 图片支持调整大小，调整对齐，添加备注，删除，滚动删除浮层

- 重构 Link Tooltip，添加更多操作

- 支持 markdown 直接输入

- 代码块支持语言选择、复制、代码行标

- Table 支持 toolbar 选择大小，右键更多选项和图标

- Icon hover 时支持多语言 Tooltip 提示

- 国际化：支持中英文配置，支持中文字体

- IME 等其他输入法输入时（如拼音），placeholder 可以及时消失

- 自动识别输入或者复制 URL 为 LinkBlot

- 其他 bugfix：table 中无法输入列表，table 中图片上传，有序列表识别，code、table 等 block 无法删除，图片位置无法保存等

## 安装

```shell
npm install quill-react-commercial --save
# or
yarn add quill-react-commercial
```

## 快速使用

```javascript
import RichTextEditor from 'quill-react-commercial';
import 'quill-react-commercial/lib/index.css';

<RichTextEditor modules={{ table: {}, codeHighlight: true, i18n={'zh'} }} />
```

- 如需要 umd 包，可以采用 dist 文件夹中打好的，script 引入文件后，window.quillReactCommercial 即可拿到组件，参考 example 中的 demo

```html
<script src="../dist/quill-react-commercial.min.js"></script>
```

## 使用

### 属性

##### 1. modules：必需，Object；每一个 key 不需要时可以为 false

```js
{
  codeHighlight?: true, // 是否有代码高亮，默认没有
  table?: {
    operationMenu?: {
      insertColumnRight?: {
    		text: 'Insert Column Right',
  		}
    }, // 需要自定义支持的右键菜单项，当传此值时以此值为准，不然以下方默认值为准，一般不传
    backgroundColors?: {
      colors?: ['#4a90e2', '#999'], // table cell的可选背景色，默认为：['#dbc8ff', '#6918b4', '#4a90e2', '#999', '#fff']
      text?: '背景色', // 副标题文本，默认值为“背景色”
    },
    toolBarOptions?: {
      dialogRows?: 3, // toolbar中table点击后弹框中出现灰色格子行数，默认为9
      dialogColumns?: 4, // 点击后弹框中出现灰色格子列数，默认为9
      i18?: 'zh',
    }, // 工具栏上table点击交互配置，默认就有
  }, // 是否需要支持table，默认没有
  imageResize?: true, // 是否需要图片调整大小，默认为true
  imageDrop?: true, // 是否需要图片拖动添加，默认为true
  magicUrl?: true, // 是否自动识别url、email等，添加超链接，默认为true
  markdown?: true, // 是否自动支持markdown，自动转换为富文本，默认为true
  link?: true, // toolbar是否需要超链接及处理函数，默认为true
  imageHandler: {
    imgUploadApi?: (formData: FormData) => Promise<string>; // 图片上传API，API返回的应该是结果为URL的Promise
    uploadSuccCB?: (data: unknown) => void; // 上传成功回调
    uploadFailCB?: (error: unknown) => void; // 上传失败回调
    imgRemarkPre?: '图：'; // 添加备注的统一前置字符串，可删除
    maxSize?: 2; // 上传本地图片最大体积，单位MB，默认为5MB
    imageAccept?: string; // 上传本地图片可以接受的图片类型，默认'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
  }, // 点击toolbar上图片时的处理函数相关，复制拖拽图片公用
  toolbarOptions?: [][]; // 自定义需要的toolbar icons & 顺序
}
```

modules.table 的 operationMenu 的中文默认值如下，其他配置参考 quill-better-table

```js
{
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
```

![table-en](https://raw.githubusercontent.com/ludejun/quill-react-commercial/master/example/images/table-en.jpg)

modules.imageHandler 不定义则默认插入图片转为 base64 后存在 Delta 中
![image](https://raw.githubusercontent.com/ludejun/quill-react-commercial/master/example/images/image.gif)

modules.toolbarOptionse 为 Quill toolbar 按数组进行定义的方式，当为列表项时默认选中第一个。[更多细节](https://quilljs.com/docs/modules/toolbar/)

```javascript
const toolbarOptions = [
  ['undo', 'redo', 'clean'],
  [
    { font: ['wsYaHei', 'songTi', 'serif', 'arial'] },
    { size: ['12px', '14px', '18px', '36px'] },
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
    'code-block',
    'link',
    'image',
    { script: 'sub' },
    { script: 'super' },
    'table',
    'divider',
  ],
];
```

modules.codeHighlight 传入数组时可以自定义支持语言，默认为：

```javascript
[
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
];
```

##### 2. placeholder：非必需，string；编辑器 placeholder；中文默认值：“开始笔记（支持直接 Markdown 输入）...”

**3. getQuill：非必需，函数；函数参数为当前 Quill 实例**

实例 API：https://quilljs.com/docs/api/

```jsx
const quill = useRef(null);
const getQuill = (quillIns) => {
  quill.current = quillIns;
}; // quill.current将拥有所有 quill 的 API：https://quilljs.com/docs/api/
// 例子
const content = quill.current?.getContent(); // 获取编辑器的的Delta类型内容
const text = quill.current?.getText(); // 获取编辑器的纯文本内容
```

**4. content：非必需，Delta 或者 string；富文本编辑器初始数据**

当 content 变化时会重新渲染富文本编辑器

```jsx
// Delta格式的content
<RichTextEditor modules={{ table: {}, codeHighlight: true }} getQuill={getQuill} content={JSON.parse("{\"ops\":[{\"insert\":\"Hello quill-react-commercial!\\n\"}]}")} />

// html格式的content
<RichTextEditor modules={{ table: {}, codeHighlight: true }} getQuill={getQuill} content={'<h1>Hello quill-react-commercial!</h1>'} />
```

**5. readOnly：非必需，boolean；编辑器是否只读；默认为 false**

**6. onChange：非必需，function；编辑器 quill 实例 onChange 触发时的 callback**

**7. onFocus：非必需，function；编辑器 quill 实例 Focus 触发时的 callback**

**8. onBlur：非必需，function；编辑器 quill 实例 Blur 触发时的 callback**

**9. i18n?: 'en' | 'zh'，非必需，string；国际化，默认为 en**

**10. style?: CSSProperties;**

**11. onSave: Option, function;**

**12. theme?: 'snow' | 'bubble'; 默认值: 'snow'**

其他 quill 的实例方法，可以在获取实例后参考[Quill API](https://quilljs.com/docs/api/)

### 安装 SDK 问题

1. 1.3.7 版本之前如 svg 不能正常展示，在项目的 webpack 配置中对 svg 打包进行修改（1.3.7 版本之后不用配置）

```javascript
// webpack5
{
  test: /\.(svg)$/i,
  type: 'asset/source',
},


// webpack4
{
  test: /\.(svg)$/i,
  type: 'svg-inline-loader',
},
```

2. 如何切换代码高亮配色样式

默认使用 highlight.js 的 xcode 配色，如需切换配色，可以直接引入对应样式文件

```javascript
import 'highlight.js/styles/darcula.css';
// 如不想安装highlight.js，请下载到本地，import本地文件
```

或者

```html
<link
  rel="stylesheet"
  href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/androidstudio.min.css"
/>
```

### 开发须知

需要调试编辑器功能时，可以执行 **yarn example** 来打包静态资源给 index.html 使用，浏览器打开 index.html 即可

- 修改编辑器本身的 JS、Less 等可以热更新，但是浏览器的 html 需要刷新

- 修改 example 中的 JS 不会重新 babel，需要重新执行 yarn example

- index.html 中引入的本地的 react、react-dom，外网 CDN 太慢

- 1.3.7 后采用 Rollup 打包，避免之前 tsc 和 webpack 打包导致 svg 引入需要多余配置的问题

### 剩余已知 bug 或体验优化，需要你的帮助

- 复制文章中的图片处理
- table 中不能插入 list、header、blockquote、code-block，尝试允许
- 图片截取
- table 多 cell 内容复制格式错乱
- shell/bash 的代码高亮难看
- 在编辑中插入图片并上传成功，但是又删除，服务器上已存在之前上传图片
