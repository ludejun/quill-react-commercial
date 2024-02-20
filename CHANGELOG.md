# Change-Log

### 1.5.2
- 重写ListItem，有序列表可以从任意数字开始，并能保存到Delta中
- 修复Link tooltip不显示文本和URL的bug
- 减小“系统字体”框的宽度
- 当插入的Code块下无内容，自动添加一个空行，方便继续编辑
- 默认modules改变注册地

### 1.5.1
- 修复缩进不生效bug
- 有序列表样式调整
### 1.5.0
- 新增中英文国际化，修改 Table 中英文配置
- 更换 Table 操作 Icons 为 AntD svg
- 样式大升级，确定主题色
- code块的重构，允许 copy，增加行标
- 升级 Link、Table、Image 的 toorbar handler
- 上传本地图片和imagePasterDrop靠齐，先出现 base64 图片再上传
- imagePasterDrop中 tooltip 改为伪元素，去除原div覆盖+id对应的方式，伪元素有个缺点是定位不准
- 修复图片被选中（click）时，按删除键不能删除的 bug，在 imageResize.checkImage中
- Link 的 Tooltip 样式重构，新增跳转、取消操作
- Icon 的 tooltip 提示公共方法
- 输入中文拼音等输入法时，placeholder 无法消失的 bug
- readme 中英文升级

### 1.4.2
- 更改编辑器内容区的顶部 padding，防止在第一行是 table 时，table 的调节工具行被遮挡；工具行的高度减小
- 将 markdown 中 onDelete 涉及到图片删除的归到imagePasteDrop.js中
- 完善开发依赖项
- 修改选中link时tooltip的实现，修复当光标在link最起始处tooltip无法正常展示的bug
- 去掉Title
- 修改样式
- bugfix：当content变为空时，不能及时渲染出来，还保留上次内容的bug
### 1.4.1
- 1.4.0样式问题修复
### 1.4.0
- 图片的位置状态保存及复现（Delta中保存位置）
- 超链接tooltip当不输入文本保存自动带入URL，并自动对URL进行标准化
- bugfix：当最开始是code块、list、引用块时，无法使用Backspace删除样式
- bugfix：多次插入本地图片时，由于每次都是addEventListener添加事件导致多次插入
- bugfix：无法插入自定义数字Table，变成1格的table
- 删除quill-magic-url依赖

### 1.3.9
- 为Title添加受控和非受控方式，value & defaultValue
### 1.3.7 / 1.3.8
- 采用Rollup打包，放弃tsc/webpack打包，使svg配置更简单，对npm包更友好
- 删除readme中svg不显示的webpack配置建议
### 1.3.6
- Title Input添加onFocus、onBlur回调
### 1.3.5
- 添加Title属性，参考印象笔记将Title内置到编辑器中
### 1.3.4
- 修复1.3.3添加的错误dom
### 1.3.3
- 添加onFocus & onBlur属性
### 1.3.2
- 修复图片复制及拖拽到编辑器上传失败后反复上传bug
- 给出页面滚动导致图片失败tooltip错位的初步方案
- 给图片复制及拖拽的base64文件Blob定义默认文件名和格式
### 1.3.1
- 图片复制及拖拽到编辑器的处理Module重构，重新换思路，先更快的给用户Base64展示，后台上传
- 图片复制及拖拽支持API上传，及上传状态展示
- 图片上传Modal框close icon的样式调整
### 1.3.0
- 上传图片添加Modal框，支持选择网络图片URL
- 修复editor-change监听导致Link Modal、图片Modal框不可focus的bug，删除editor-change监听
- 修改readme.md

### 1.2.9

- 禁止在table中使用header、list、code、引用等块，并修改list触发器、markdown触发器使这些格式在tabl-cell中不生效
- 修改markdown触发器，增加删除块级，修复hr不生效
- 修改markdown触发器，禁止在代码块中生效
- 修改代码高亮中shell函数，实际使用vim高亮规则，shell的keywords中缺少很多常规命令行，这些命令行不在标准shell中：https://github.com/highlightjs/highlight.js/issues/630#issuecomment-61978331
### 1.2.8

- 修改boundary边界为编辑器实例本身，原为document.body
- 修改部分样式
### 1.2.7

- 升级quill-magic-url，使能自动识别URL
- 修改列表样式、缩进等
- 默认table列宽变为120
- 修改触发list的keyboard.bindings.'list autofill'.prefix
- 修改触发list的markdown的正则
- 点击URL出来的弹框添加跳转功能

### 1.2.6

- 添加ChangeLog
- readme中添加开发须知
- 修改Heading样式，变为简写：H1、H2、H3、H4、正文

### 1.2.5

- table中支持List，解决下一个cell的有序列表数字继承上一个列表的bug
- 有序列表只能输入“1. ”才会触发，改变比如输入“30. ”会变为“1. ”开始的有序列表的行为

### 1.2.4

- 添加example/本地demo启动CLI
- 修改umd webpack打包去除react
- 修复在react项目中直接import dist文件报hooks不能使用bug

### 1.2.3

- 解决转函数组件后代码高亮报错bug，需要先执行highlight初始化函数
- 去除多编辑器的imageResize浮层不消失bug
- utils改ts
- better-table放在本地，运行并修改部分源代码以支持在table中加入List，解决报错

### 1.2.2

解决上传图片bug

### 1.2.1

解决1.2.0导出bug

### 1.2.0

大升级：

- 解决所有ts error
- 添加umd打包和ts打包
- 使用函数组件和hooks重构
- 更新readme

### 1.1.2

采用TSC打包到lib文件夹

### 1.1.0

改变main引用，默认使用源码而不是打包结果

### 1.0.9

上传图片函数升级 & 添加系统字体 & 添加Heading

### 1.0.8

更新上传图片API的返回Promise

### 1.0.6、1.0.7

改变图片Base64为图片上传API：解决图片上传传入API及response处理方法

### 1.0.5

bugfix: 同一页面多个编辑器，样式错乱

### 1.0.4、1.0.3

props中添加初始值、readOnly，修复toolbarOptions自定义控制bug

### 1.0.2

codeHighlight config bugfix & api update

### 1.0.1

add user-defined toolbar & update readme & publish

### 1.0.0

UMD打包可使用的Quill富文本编辑器