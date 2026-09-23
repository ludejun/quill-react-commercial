<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/ludejun/quill-react-commercial@master/assets/logo.svg" width="96" height="96" alt="quill-react-commercial" />
</p>

<h1 align="center">quill-react-commercial</h1>

<p align="center">
  A production-ready <a href="https://github.com/quilljs/quill">Quill 2</a> rich text editor for React —
  tables, image upload &amp; resize, code highlighting, markdown shortcuts and i18n, out of the box.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/quill-react-commercial"><img src="https://img.shields.io/npm/v/quill-react-commercial.svg?logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/quill-react-commercial"><img src="https://img.shields.io/npm/dm/quill-react-commercial.svg?color=cb3837" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/quill-react-commercial"><img src="https://img.shields.io/bundlephobia/minzip/quill-react-commercial?label=minzipped" alt="bundle size" /></a>
  <a href="https://www.npmjs.com/package/quill-react-commercial"><img src="https://img.shields.io/npm/types/quill-react-commercial.svg?logo=typescript&logoColor=white" alt="types included" /></a>
  <br />
  <a href="https://github.com/ludejun/quill-react-commercial/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/quill-react-commercial.svg?color=blue" alt="license" /></a>
  <a href="https://github.com/ludejun/quill-react-commercial/stargazers"><img src="https://img.shields.io/github/stars/ludejun/quill-react-commercial?logo=github&color=yellow" alt="GitHub stars" /></a>
  <a href="https://github.com/ludejun/quill-react-commercial/blob/master/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D16.8-61dafb?logo=react&logoColor=white" alt="react >= 16.8" />
</p>

<p align="center">
  <b><a href="https://ludejun.github.io/quill-react-commercial/">Live demo</a></b>
  ·
  <a href="https://www.npmjs.com/package/quill-react-commercial">npm</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
  ·
  <a href="./CONTRIBUTING.md">Contributing</a>
  ·
  <a href="./readme_CN.md">中文文档</a>
</p>

---

[Quill](https://github.com/quilljs/quill) is an excellent open-source rich text editor with a sound
data model, a clean API and a real plugin system. What it does not give you is a finished product:
its release cadence has been slow, and much of the plugin ecosystem around it has gone stale. This
package fills that gap — a Quill editor that is ready for production, extensible, customisable, and
built with commercial use in mind.

![quill-react-commercial](https://cdn.jsdelivr.net/gh/ludejun/quill-react-commercial/example/images/quill-react-commercial.jpg)

## Features

- **Built on Quill 2**, with React Hooks, full TypeScript typings and a Rollup build.
- **Images** can be uploaded from disk or inserted by URL, with format and size validated up front.
- Every image renders as **Base64 first and uploads in the background**; a failed upload stays
  clickable so the user can retry. Images can also be pasted or dragged in.
- Images support **resizing, alignment, captions and deletion**, and the resize overlay is dismissed
  on scroll.
- A **rebuilt link tooltip** with more actions than Quill's default.
- **Video embeds** from YouTube, Vimeo and Bilibili: paste the page URL you copied from the address
  bar and it is converted to the embed URL for you. Videos stay `<iframe>` when the content is saved
  — Quill's own `video` format turns them back into a link.
- **Markdown shortcuts** work as you type.
- **Code blocks** offer language selection, one-click copy and line numbers.
- **Tables** get a size picker in the toolbar, a right-click menu with more operations, and new icons.
- **Tooltips on toolbar icons**, translated along with the rest of the UI.
- **Internationalisation** for English, Chinese and Spanish, including Chinese font support.
- **IME-aware placeholder**: the placeholder disappears as soon as you start typing Pinyin or any
  other composed input, instead of lingering.
- URLs you type or paste are **recognised and linked automatically**.
- Plus fixes for a long list of upstream problems: lists inside tables, image upload inside tables,
  ordered-list detection, deleting code and table blocks, persisting image alignment, and more.

## Requirements

|       |                         |
| ----- | ----------------------- |
| React | `>= 16.8` (hooks)       |
| Node  | `>= 18` for development |

## Install

```shell
pnpm add quill-react-commercial
# or
npm install quill-react-commercial --save
# or
yarn add quill-react-commercial
```

## Quick start

```jsx
import RichTextEditor from 'quill-react-commercial';
import 'quill-react-commercial/lib/index.css';

<RichTextEditor modules={{ table: {}, codeHighlight: true }} />;
```

Via UMD / CDN, the component is exposed as `window.quillReactCommercial`. A complete page is in
[`example/`](./example).

```html
<script src="https://unpkg.com/quill-react-commercial/lib/index.js"></script>
```

## Usage

All props are typed — your editor will show the full definitions on hover.

### `modules` — required, object

Every key can be set to `false` to turn that module off.

```js
{
  codeHighlight?: true,
  table?: {
    operationMenu?: {
      insertColumnRight?: {
        text: 'Insert Column Right',
      }
    }, // usually not needed
    backgroundColors?: {
      colors?: ['#4a90e2', '#999'], // table cell background; default: ['#dbc8ff', '#6918b4', '#4a90e2', '#999', '#fff']
      text?: 'Background Colors',   // default: 'Background Colors'
    },
    toolBarOptions?: {
      dialogRows?: 3,    // default: 9
      dialogColumns?: 4, // default: 9
      i18n?: 'en',
    }, // the size picker shown when you click "table" in the toolbar
  }, // default: false
  imageResize?: true, // default: true
  imageDrop?: true,   // default: true
  magicUrl?: true,    // auto-detect URLs and emails and wrap them in a link; default: true
  markdown?: true,    // convert markdown syntax to rich text as you type; default: true
  link?: true,        // default: true
  video?: true,       // video embed button; default: true
                      // or { width?: '100%', height?: '360' } for the inserted iframe
  imageHandler: {
    imgUploadApi?: (formData: FormData) => Promise<string>; // upload endpoint; resolve with the image URL
    uploadSuccCB?: (data: unknown) => void; // called on success
    uploadFailCB?: (error: unknown) => void; // called on failure
    imgRemarkPre?: 'Fig. '; // prefix for the image caption; the user can delete it
    maxSize?: 2; // max size for a local upload, in MB; default: 5
    imageAccept?: string; // accepted types; default: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/webp'
  },
  toolbarOptions?: [][]; // pick and order the toolbar controls yourself
}
```

Defaults for `modules.table.operationMenu`:

```js
{
  insertColumnRight: { text: 'Insert Column Right' },
  insertColumnLeft:  { text: 'Insert Column Left' },
  insertRowUp:       { text: 'Insert Row Above' },
  insertRowDown:     { text: 'Insert Row Below' },
  mergeCells:        { text: 'Merge Selected Cells' },
  unmergeCells:      { text: 'Unmerge Cells' },
  deleteColumn:      { text: 'Delete Columns' },
  deleteRow:         { text: 'Delete Rows' },
  deleteTable:       { text: 'Delete Table' },
}
```

![table-en](https://cdn.jsdelivr.net/gh/ludejun/quill-react-commercial/example/images/table-en.jpg)

If `modules.imageHandler` is omitted, inserted images are converted to Base64 and stored inline in
the Delta.

![image](https://raw.githubusercontent.com/ludejun/quill-react-commercial/master/example/images/image.gif)

`modules.toolbarOptions` follows Quill's own format — see the
[toolbar docs](https://quilljs.com/docs/modules/toolbar/):

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
    'video',
    { script: 'sub' },
    { script: 'super' },
    'table',
    'divider',
  ],
];
```

Languages offered by `modules.codeHighlight` — override the list to change it, or open a PR to add
one:

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

### Other props

| Prop          | Type                                                  | Default        | Description                                             |
| ------------- | ----------------------------------------------------- | -------------- | ------------------------------------------------------- |
| `placeholder` | `string`                                              | locale default | Placeholder shown while the editor is empty.            |
| `getQuill`    | `(quill: Quill, uploadedImgsList?: string[]) => void` | —              | Receives the Quill instance once it is ready.           |
| `content`     | `Delta \| string`                                     | —              | Initial content, as a Delta or an HTML string.          |
| `readOnly`    | `boolean`                                             | `false`        | Renders the editor disabled.                            |
| `onChange`    | `(delta: Delta, old: Delta) => void`                  | —              | Fires on user edits only, not on programmatic writes.   |
| `onFocus`     | `(range?: Range) => void`                             | —              | Fires when the editor gains focus.                      |
| `onBlur`      | `(oldRange?: Range) => void`                          | —              | Fires when the editor loses focus.                      |
| `onSave`      | `() => void`                                          | —              | Fires on <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>S</kbd>. |
| `i18n`        | `'en' \| 'zh' \| 'es'`                                | `'en'`         | UI language.                                            |
| `style`       | `CSSProperties`                                       | —              | Applied to the editor container.                        |
| `theme`       | `'snow' \| 'bubble'`                                  | `'snow'`       | Quill theme.                                            |

#### `getQuill`

The instance exposes the full [Quill API](https://quilljs.com/docs/api/):

```jsx
const quill = useRef(null);
const getQuill = (quillIns) => {
  quill.current = quillIns;
};

const content = quill.current?.getContents(); // the editor content, as a Delta
const text = quill.current?.getText(); // the editor content, as plain text
```

#### `content`

```jsx
// as a Delta
<RichTextEditor
  modules={{ table: {}, codeHighlight: true }}
  getQuill={getQuill}
  content={JSON.parse('{"ops":[{"insert":"Hello quill-react-commercial!\\n"}]}')}
/>

// as an HTML string
<RichTextEditor
  modules={{ table: {}, codeHighlight: true }}
  getQuill={getQuill}
  content={'<h1>Hello quill-react-commercial!</h1>'}
/>
```

## FAQ

### How do I change the code highlighting theme?

The default is highlight.js's `xcode` theme. Import another one:

```javascript
import 'highlight.js/styles/darcula.css';
```

Or link it:

```html
<link
  rel="stylesheet"
  href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/androidstudio.min.css"
/>
```

## Development

```shell
pnpm install
pnpm example     # build the demo bundle, then open example/index.html
pnpm test        # vitest
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
pnpm build       # bundle + type declarations
```

- Editing the editor's own JS/Less hot-reloads, but the browser still needs a refresh.
- Editing `example/app.js` does **not** re-run Babel — run `pnpm example` again.
- Since 1.3.7 the build uses Rollup, which avoids the redundant SVG configuration the earlier
  `tsc` + webpack pipeline produced.

Bug reports and pull requests are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for the flow.

## License

[ISC](./LICENSE) © [ludejun](https://github.com/ludejun)
