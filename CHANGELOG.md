# Change-Log

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