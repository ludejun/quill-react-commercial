# quill-react-commercial



Quill作为很出众并流行的开源富文本编辑器，有着良好的数据结构、API和插件系统，但是由于多年的更新难产及众多插件的过时、体验差，急需一款能用于生产、满足体验与扩展、能自定义、可以面向商业化的Quill富文本编辑器。

微信小程序的富文本编辑器也使用的Quill底层和数据结构，可以和quill-react-commercial打通编辑和展示。



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
      dialogRows: 3, // 点击后弹框中出现灰色格子行数，默认为3
      dialogColumns: 4, // 点击后弹框中出现灰色格子列数，默认为4
      rowLabel: '行数', // 点击后弹框左边输入框label，默认为“行数”
      columnLabel: '列数', // 点击后弹框右边输入框label，默认为“列数”
      okLabel: '确认', // 点击后弹框button上lable，默认为“确认”
    }, // 工具栏上table点击交互配置，默认就有
  }, // 是否需要支持table，默认没有
}
```

table的operationMenu的默认值，同quill-better-table配置

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



##### placeholder：非必需，string；编辑器placeholder；默认值：“开始笔记（支持直接Markdown输入）...”



##### autoSave：非必需，Object；是否需要自动保存，自动保存配置；

```js
{
  gap: 300000, // 自动保存间隔（毫秒数），number，默认120000
  textFn: (date) => `上一次保存时间${date}`, // 自动保存提示，编辑器右下脚，参数为保存时的new Date()值，可根据需要进行format
  textStyle: {
    color: '#333',
  }, // 自动保存提示的样式
}
```

