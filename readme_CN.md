<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/quill-react-commercial@master/assets/logo.svg" width="96" height="96" alt="quill-react-commercial" />
</p>

<h1 align="center">quill-react-commercial</h1>

<p align="center">
  面向生产的 React 富文本编辑器，基于 <a href="https://github.com/quilljs/quill">Quill 2</a> —— 开箱即用的表格、图片上传与缩放、代码高亮、Markdown 快捷输入和国际化。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/quill-react-commercial"><img src="https://img.shields.io/npm/v/quill-react-commercial.svg?logo=npm&color=cb3837" alt="npm 版本" /></a>
  <a href="https://www.npmjs.com/package/quill-react-commercial"><img src="https://img.shields.io/npm/dm/quill-react-commercial.svg?color=cb3837" alt="npm 月下载量" /></a>
  <a href="https://bundlephobia.com/package/quill-react-commercial"><img src="https://img.shields.io/bundlephobia/minzip/quill-react-commercial?label=minzipped" alt="包体积" /></a>
  <a href="https://www.npmjs.com/package/quill-react-commercial"><img src="https://img.shields.io/npm/types/quill-react-commercial.svg?logo=typescript&logoColor=white" alt="内置类型定义" /></a>
  <br />
  <a href="https://github.com/ludejun/quill-react-commercial/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/quill-react-commercial.svg?color=blue" alt="开源协议" /></a>
  <a href="https://github.com/ludejun/quill-react-commercial/stargazers"><img src="https://img.shields.io/github/stars/ludejun/quill-react-commercial?logo=github&color=yellow" alt="GitHub Star 数" /></a>
  <a href="https://github.com/ludejun/quill-react-commercial/blob/master/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PR-欢迎提交-brightgreen.svg" alt="欢迎 PR" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D16.8-61dafb?logo=react&logoColor=white" alt="react >= 16.8" />
</p>

<p align="center">
  <b><a href="https://ludejun.github.io/quill-react-commercial/">在线演示</a></b>
  ·
  <a href="https://www.npmjs.com/package/quill-react-commercial">npm</a>
  ·
  <a href="./CHANGELOG.md">更新日志</a>
  ·
  <a href="./CONTRIBUTING.md">贡献指南</a>
  ·
  <a href="./readme.md">English</a>
</p>

---

[Quill](https://github.com/quilljs/quill) 是一款出色且流行的开源富文本编辑器，有着良好的数据结构、API 和插件系统。但它并不是一个拿来即用的成品：版本更新缓慢，周边插件大多年久失修、体验欠佳。本项目要补的正是这一块 —— 一款能直接用于生产、可扩展、可自定义、面向商业场景的 Quill 富文本编辑器。

微信小程序的富文本编辑器同样基于 Quill 的底层和数据结构，可以和 quill-react-commercial 打通编辑与展示。

![quill-react-commercial-zh](https://raw.githubusercontent.com/ludejun/quill-react-commercial/master/example/images/quill-react-commercial-zh.jpg)

## 特性

- **基于 Quill 2** 构建，React Hooks 实现，完整 TypeScript 类型定义，Rollup 打包。
- **图片**支持本地上传和 URL 插入，上传前即校验格式与大小。
- 所有图片**先以 Base64 渲染、后台异步上传**；上传失败的图片保持可点击，随时重传。图片也支持粘贴和拖拽插入。
- 图片支持**缩放、对齐、添加备注、删除**，页面滚动时自动收起缩放浮层。
- **重写的链接 Tooltip**，操作比 Quill 默认的更丰富。
- 支持**直接输入 Markdown 语法**，边写边转换。
- **代码块**支持语言选择、一键复制和代码行号。
- **表格**在工具栏中用网格选择尺寸，右键菜单提供更多操作，并配了新图标。
- 工具栏图标 **hover 显示 Tooltip**，随界面语言一起翻译。
- **国际化**：支持中文、英文、西班牙文，并处理了中文字体兼容。
- **输入法友好**：使用拼音等组合输入法时，placeholder 会及时消失，而不是一直挂在那里。
- 输入或粘贴的 URL 会被**自动识别并转为链接**。
- 另外修复了一批上游遗留问题：表格内无法输入列表、表格内上传图片、有序列表识别、代码块与表格无法删除、图片对齐方式无法保存等。

## 环境要求

|       |                         |
| ----- | ----------------------- |
| React | `>= 16.8`（需要 Hooks） |
| Node  | 开发环境 `>= 18`        |

## 安装

```shell
pnpm add quill-react-commercial
# 或
npm install quill-react-commercial --save
# 或
yarn add quill-react-commercial
```

## 快速使用

```jsx
import RichTextEditor from 'quill-react-commercial';
import 'quill-react-commercial/lib/index.css';

<RichTextEditor modules={{ table: {}, codeHighlight: true }} />;
```

以 UMD / CDN 方式引入时，组件挂在 `window.quillReactCommercial` 上，完整示例页面见 [`example/`](./example)。

```html
<script src="https://unpkg.com/quill-react-commercial/lib/index.js"></script>
```

## 使用说明

所有属性都有 TypeScript 类型定义，在编辑器里 hover 即可看到完整签名。

### `modules` —— 必需，Object

每一项都可以设为 `false` 来关闭对应模块。

```js
{
  codeHighlight?: true,
  table?: {
    operationMenu?: {
      insertColumnRight?: {
        text: '右侧插入列',
      }
    }, // 一般不需要配置
    backgroundColors?: {
      colors?: ['#4a90e2', '#999'], // 单元格背景色，默认：['#dbc8ff', '#6918b4', '#4a90e2', '#999', '#fff']
      text?: '背景颜色',             // 默认：'背景颜色'
    },
    toolBarOptions?: {
      dialogRows?: 3,    // 默认：9
      dialogColumns?: 4, // 默认：9
      i18n?: 'zh',
    }, // 点击工具栏 table 图标后，尺寸选择面板的配置
  }, // 默认：false
  imageResize?: true, // 默认：true
  imageDrop?: true,   // 默认：true
  magicUrl?: true,    // 自动识别 URL、邮箱并转为链接；默认：true
  markdown?: true,    // 边输入边把 Markdown 语法转为富文本；默认：true
  link?: true,        // 默认：true
  imageHandler: {
    imgUploadApi?: (formData: FormData) => Promise<string>; // 图片上传接口，resolve 时返回图片 URL
    uploadSuccCB?: (data: unknown) => void;  // 上传成功回调
    uploadFailCB?: (error: unknown) => void; // 上传失败回调
    imgRemarkPre?: '图片：'; // 图片备注的前缀文案，用户可以删除
    maxSize?: 2; // 本地上传图片的大小上限，单位 MB，默认 5MB
    imageAccept?: string; // 可上传的图片类型，默认：'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/webp'
  },
  toolbarOptions?: [][]; // 自定义工具栏图标及其顺序
}
```

`modules.table.operationMenu` 的默认值：

```js
{
  insertColumnRight: { text: '右侧插入列' },
  insertColumnLeft:  { text: '左侧插入列' },
  insertRowUp:       { text: '上方插入行' },
  insertRowDown:     { text: '下方插入行' },
  mergeCells:        { text: '合并单元格' },
  unmergeCells:      { text: '取消单元格合并' },
  deleteColumn:      { text: '删除列' },
  deleteRow:         { text: '删除行' },
  deleteTable:       { text: '删除表格' },
}
```

若不传 `modules.imageHandler`，插入的图片会转成 Base64 直接存进 Delta。

![image](https://raw.githubusercontent.com/ludejun/quill-react-commercial/master/example/images/image.gif)

`modules.toolbarOptions` 沿用 Quill 自身的格式，详见 [Quill 工具栏文档](https://quilljs.com/docs/modules/toolbar/)：

```javascript
const toolbarOptions = [
  ['undo', 'redo', 'clean'],
  [{ font: ['wsYaHei', 'songTi', 'serif', 'arial'] }, { size: ['12px', '14px', '18px', '36px'] }],
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

`modules.codeHighlight` 默认支持的语言，可以覆盖这个列表，也欢迎提 PR 补充：

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

### 其余属性

| 属性          | 类型                                                  | 默认值         | 说明                                                        |
| ------------- | ----------------------------------------------------- | -------------- | ----------------------------------------------------------- |
| `placeholder` | `string`                                              | 各语言默认文案 | 编辑器为空时显示的占位文案。                                |
| `getQuill`    | `(quill: Quill, uploadedImgsList?: string[]) => void` | —              | 编辑器就绪后回传 Quill 实例。                               |
| `content`     | `Delta \| string`                                     | —              | 初始内容，可传 Delta 或 HTML 字符串。                       |
| `readOnly`    | `boolean`                                             | `false`        | 是否只读。                                                  |
| `onChange`    | `(delta: Delta, old: Delta) => void`                  | —              | 仅用户编辑时触发，程序写入不触发。                          |
| `onFocus`     | `(range?: Range) => void`                             | —              | 编辑器获得焦点时触发。                                      |
| `onBlur`      | `(oldRange?: Range) => void`                          | —              | 编辑器失去焦点时触发。                                      |
| `onSave`      | `() => void`                                          | —              | 按下 <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>S</kbd> 时触发。 |
| `i18n`        | `'en' \| 'zh' \| 'es'`                                | `'en'`         | 界面语言。                                                  |
| `style`       | `CSSProperties`                                       | —              | 作用于编辑器容器。                                          |
| `theme`       | `'snow' \| 'bubble'`                                  | `'snow'`       | Quill 主题。                                                |

#### `getQuill`

拿到的实例拥有完整的 [Quill API](https://quilljs.com/docs/api/)：

```jsx
const quill = useRef(null);
const getQuill = (quillIns) => {
  quill.current = quillIns;
};

const content = quill.current?.getContents(); // 获取编辑器内容（Delta）
const text = quill.current?.getText(); // 获取编辑器纯文本
```

#### `content`

```jsx
// 传 Delta
<RichTextEditor
  modules={{ table: {}, codeHighlight: true }}
  getQuill={getQuill}
  content={JSON.parse('{"ops":[{"insert":"Hello quill-react-commercial!\\n"}]}')}
/>

// 传 HTML 字符串
<RichTextEditor
  modules={{ table: {}, codeHighlight: true }}
  getQuill={getQuill}
  content={'<h1>Hello quill-react-commercial!</h1>'}
/>
```

## 常见问题

### 1. SVG 图标不显示

仅 1.3.7 之前的版本需要处理：在项目的 webpack 配置中调整 svg 的打包方式（1.3.7 及以后无需任何配置）。

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

### 2. 如何切换代码高亮配色

默认使用 highlight.js 的 `xcode` 配色，引入对应样式文件即可切换：

```javascript
import 'highlight.js/styles/darcula.css';
// 如不想安装 highlight.js，可以把样式文件下载到本地再 import
```

或者直接用 CDN：

```html
<link
  rel="stylesheet"
  href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/androidstudio.min.css"
/>
```

## 本地开发

```shell
pnpm install
pnpm example     # 打包示例静态资源，然后用浏览器打开 example/index.html
pnpm test        # 运行 vitest
pnpm lint        # 运行 eslint
pnpm typecheck   # tsc --noEmit
pnpm build       # 打包产物 + 类型声明
```

- 修改编辑器自身的 JS、Less 可以热更新，但浏览器里的 html 需要手动刷新。
- 修改 `example/app.js` **不会**重新 babel，需要重新执行 `pnpm example`。
- `index.html` 引入的是本地的 react、react-dom —— 外网 CDN 太慢。
- 1.3.7 之后改用 Rollup 打包，避免了之前 tsc + webpack 打包导致 svg 引入需要多余配置的问题。

## 已知问题，欢迎一起解决

- 复制文章中的图片处理
- table 中不能插入 list、header、blockquote、code-block，尝试允许
- 图片截取
- table 多 cell 内容复制格式错乱
- shell/bash 的代码高亮难看
- 编辑中插入图片并上传成功后又删除，服务器上仍残留之前上传的图片

提 issue 和 PR 都很欢迎，流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 开源协议

[ISC](./LICENSE) © [ludejun](https://github.com/ludejun)
