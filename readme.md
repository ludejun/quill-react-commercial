# quill-react-commercial



Quill作为很出众并流行的开源富文本编辑器，有着良好的数据结构、API和插件系统，但是由于多年的更新难产及众多插件的过时、体验差，急需一款能用于生产、满足体验与扩展、能自定义、可以面向商业化的Quill富文本编辑器。

微信小程序的富文本编辑器也使用的Quill底层和数据结构，可以和quill-react-commercial打通编辑和展示。

SDK默认使用lib/index.js作为入口，若想要在html中引入等打包后的结果，可以使用dist/文件夹中的文件，参考示例example。

### 安装

```shell
npm install quill-react-commercial --save
# or
yarn add quill-react-commercial
```

### 快速使用
```javascript
import RichTextEditor from 'quill-react-commercial';

<RichTextEditor modules={{ table: {}, codeHighlight: true }} />
```

- 如需要umd包，可以采用dist文件夹中打好的，script引入文件后，window.quillReactCommercial即可拿到组件，参考example


### API

#### 属性
##### modules：必需，Object；每一个key不需要时可以为false

```js
{
  codeHighlight: true, // 是否有代码高亮，默认没有
  table: {
    operationMenu: {
      insertColumnRight: {
    		text: 'Insert Column Right',
  		}
    }, // 需要自定义支持的右键菜单项，当传此值时以此值为准，不然以下方默认值为准
    backgroundColor: {
      colors: ['#fff', 'red', 'rgb(0, 0, 0)'], // table cell的可选背景色，默认为：['#fff', '#ECF3FC', '#999']
      text: '背景色', // 副标题文本，默认值为“背景色”
    },
    toolBarOptions: {
      dialogRows: 3, // toolbar中table点击后弹框中出现灰色格子行数，默认为3
      dialogColumns: 4, // 点击后弹框中出现灰色格子列数，默认为4
      rowLabel: '行数', // 点击后弹框左边输入框label，默认为“行数”
      columnLabel: '列数', // 点击后弹框右边输入框label，默认为“列数”
      okLabel: '确认', // 点击后弹框button上lable，默认为“确认”
    }, // 工具栏上table点击交互配置，默认就有
  }, // 是否需要支持table，默认没有
  imageResize: true, // 是否需要图片调整大小，默认为true
  imageDrop: true, // 是否需要图片拖动添加，默认为true
  magicUrl: true, // 是否自动识别url、email等，添加超链接，默认为true
  markdown: true, // 是否自动支持markdown，自动转换为富文本，默认为true
  link: true, // toolbar是否需要超链接及处理函数，默认为true
  imageHandler: {
    imgUploadApi: (formData: FormData) => Promise<string>; // 图片上传API，API返回的应该是结果为URL的Promise
    uploadSuccCB?: (data: unknown) => void; // 上传成功回调
    uploadFailCB?: (error: unknown) => void; // 上传失败回调
  }, // 点击toolbar上图片时的处理函数相关
  toolbarOptions?: [][]; // 自定义需要的toolbar icons & 顺序
}
```

modules.table的operationMenu的默认值如下，其他配置参考quill-better-table

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

modules.imageHandler 不定义则默认插入图片转为base64后存在Delta中



modules.toolbarOptionse为Quill toolbar按数组进行定义的方式，当为列表项时默认选中第一个

```javascript
const toolbarOptions = [
      ['undo', 'redo'],
      [{ font: ['wsYaHei', 'songTi', 'serif', 'arial'] }, { size: ['12px', '14px', '18px', '36px'] }],
      [{ color: [] }, { background: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
      ['blockquote', 'code-block', 'link','image', { script: 'sub' }, { script: 'super' }, 'table', 'clean'],
    ];
```

modules.codeHighlight 传入数组时可以自定义支持语言，默认为：

```javascript
[
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
]
```



##### placeholder：非必需，string；编辑器placeholder；默认值：“开始笔记（支持直接Markdown输入）...”



**getQuill：非必需，函数；函数参数为当前Quill实例**




**content：非必需，Delta或者string；富文本编辑器初始数据**

当content变化时会重新渲染富文本编辑器

```jsx
// Delta格式的content
<RichTextEditor modules={{ table: {}, codeHighlight: true }} getQuill={getQuill} content={JSON.parse("{\"ops\":[{\"insert\":\"Hello quill-react-commercial!\\n\"}]}")} />

// html格式的content
<RichTextEditor modules={{ table: {}, codeHighlight: true }} getQuill={getQuill} content={'<h1>Hello quill-react-commercial!</h1>'} />
```



**readOnly：非必需，boolean；编辑器是否只读；默认为false**

**onChange：非必需，function；编辑器quill实例onChange触发时的callback**

**onFocus：非必需，function；编辑器quill实例Focus触发时的callback**

**onBlur：非必需，function；编辑器quill实例Blur触发时的callback**

**title: 非必需，第一行是否为标题input，编辑器tooltip对标题无效**

其他quill的实例方法，可以在获取实例后参考Quill API

### 安装SDK问题

1. 1.3.7版本之前如svg不能正常展示，在项目的webpack配置中对svg打包进行修改（1.3.7版本之后不用配置）
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

默认使用highlight.js的vscode2015配色，如需切换配色，可以直接引入对应样式文件
```javascript
import 'highlight.js/styles/darcula.css';
// 如不想安装highlight.js，请下载到本地，import本地文件
```
或者
```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/androidstudio.min.css">
```

### 开发须知

需要调试编辑器功能时，可以执行 **yarn example** 来打包静态资源给 example/index.html 使用，浏览器打开index.html即可

- 修改example中的JS会自动重新babel，只需要刷新浏览器即可
- 修改编辑器本身的JS、Less需要重新执行 yarn example
- index.html中引入的本地的react、react-dom，外网CDN太慢
- 1.3.7后采用Rollup打包，避免之前tsc和webpack打包导致svg引入需要多余配置的问题

### 剩余已知bug或体验优化

- 有序列表换行，不要重新开始
- 复制文章中的图片处理
- 复制、拖拽图片到编辑器的上传API失败后的重新上传
- table中不能插入list、header、blockquote、code-block，尝试允许
- 多主题、多语种支持
- 图片截取
- 图片focus时功能menu添加：文字环绕、添加超链接URL、删除、添加备注
- table多cell内容复制不能
- 图片的resize框在滚动时不随动
- 图片上传Modal框URL不合规的UI反馈没有
- shell/bash的代码高亮难看
- 在编辑中插入图片并上传成功，但是又删除，服务器上已存在之前上传图片
- 本地图片上传失败，没有提示