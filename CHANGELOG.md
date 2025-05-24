# Change-Log

# 1.6.3

- feat: add spanish (es) translation support to i18n

# 1.6.2

- Add LICENSE file like Quill
- support webp format when upload imgs
- fix: error when divider is deleted from toolbarOptions
- Add theme support: bubble & snow

# 1.6.1

- fearure：点击高亮 Code Icon 支持取消 Code 格式
- hotfix：有序列表、引用有字时无法删除

### 1.6.0

- quill 升级到 2.0.2
- 添加自定义 Divider 格式，设置多个默认分割线，允许保存 Delta 及重新渲染

### 1.5.9

- 添加保存快捷键回调
- quill 升级到 2.0.1

### 1.5.8

- 更改 quill.snow.css 引入方式
- 升级quill@2.0.0-rc.5

### 1.5.5 / 1.5.6 / 1.5.7

- 打包结果改为 es
- 改变 rollup 配置，解决升级 quill 产生的 bugs

### 1.5.4

- 修改默认语法高亮，从 shell 到 bash
- 升级 Quill 从quill@2.0.0-dev.4 -> quill@2.0.0-rc.4
- 将 quill.snow.css 从 quill/dist/quill.snow.css 引入改为本地，直接引 node_modules 打包一直有问题，打不进去
- 将 css 从 js 包中移除

### 1.5.3

- 修复 readOnly 控制失效 Bug

### 1.5.2

- 重写 ListItem，有序列表可以从任意数字开始，并能保存到 Delta 中
- 修复 Link tooltip 不显示文本和 URL 的 bug
- 减小“系统字体”框的宽度
- 当插入的 Code 块下无内容，自动添加一个空行，方便继续编辑
- 默认 modules 改变注册地

### 1.5.1

- 修复缩进不生效 bug
- 有序列表样式调整

### 1.5.0

- 新增中英文国际化，修改 Table 中英文配置
- 更换 Table 操作 Icons 为 AntD svg
- 样式大升级，确定主题色
- code 块的重构，允许 copy，增加行标
- 升级 Link、Table、Image 的 toorbar handler
- 上传本地图片和 imagePasterDrop 靠齐，先出现 base64 图片再上传
- imagePasterDrop 中 tooltip 改为伪元素，去除原 div 覆盖+id 对应的方式，伪元素有个缺点是定位不准
- 修复图片被选中（click）时，按删除键不能删除的 bug，在 imageResize.checkImage 中
- Link 的 Tooltip 样式重构，新增跳转、取消操作
- Icon 的 tooltip 提示公共方法
- 输入中文拼音等输入法时，placeholder 无法消失的 bug
- readme 中英文升级

### 1.4.2

- 更改编辑器内容区的顶部 padding，防止在第一行是 table 时，table 的调节工具行被遮挡；工具行的高度减小
- 将 markdown 中 onDelete 涉及到图片删除的归到 imagePasteDrop.js 中
- 完善开发依赖项
- 修改选中 link 时 tooltip 的实现，修复当光标在 link 最起始处 tooltip 无法正常展示的 bug
- 去掉 Title
- 修改样式
- bugfix：当 content 变为空时，不能及时渲染出来，还保留上次内容的 bug

### 1.4.1

- 1.4.0 样式问题修复

### 1.4.0

- 图片的位置状态保存及复现（Delta 中保存位置）
- 超链接 tooltip 当不输入文本保存自动带入 URL，并自动对 URL 进行标准化
- bugfix：当最开始是 code 块、list、引用块时，无法使用 Backspace 删除样式
- bugfix：多次插入本地图片时，由于每次都是 addEventListener 添加事件导致多次插入
- bugfix：无法插入自定义数字 Table，变成 1 格的 table
- 删除 quill-magic-url 依赖

### 1.3.9

- 为 Title 添加受控和非受控方式，value & defaultValue

### 1.3.7 / 1.3.8

- 采用 Rollup 打包，放弃 tsc/webpack 打包，使 svg 配置更简单，对 npm 包更友好
- 删除 readme 中 svg 不显示的 webpack 配置建议

### 1.3.6

- Title Input 添加 onFocus、onBlur 回调

### 1.3.5

- 添加 Title 属性，参考印象笔记将 Title 内置到编辑器中

### 1.3.4

- 修复 1.3.3 添加的错误 dom

### 1.3.3

- 添加 onFocus & onBlur 属性

### 1.3.2

- 修复图片复制及拖拽到编辑器上传失败后反复上传 bug
- 给出页面滚动导致图片失败 tooltip 错位的初步方案
- 给图片复制及拖拽的 base64 文件 Blob 定义默认文件名和格式

### 1.3.1

- 图片复制及拖拽到编辑器的处理 Module 重构，重新换思路，先更快的给用户 Base64 展示，后台上传
- 图片复制及拖拽支持 API 上传，及上传状态展示
- 图片上传 Modal 框 close icon 的样式调整

### 1.3.0

- 上传图片添加 Modal 框，支持选择网络图片 URL
- 修复 editor-change 监听导致 Link Modal、图片 Modal 框不可 focus 的 bug，删除 editor-change 监听
- 修改 readme.md

### 1.2.9

- 禁止在 table 中使用 header、list、code、引用等块，并修改 list 触发器、markdown 触发器使这些格式在 tabl-cell 中不生效
- 修改 markdown 触发器，增加删除块级，修复 hr 不生效
- 修改 markdown 触发器，禁止在代码块中生效
- 修改代码高亮中 shell 函数，实际使用 vim 高亮规则，shell 的 keywords 中缺少很多常规命令行，这些命令行不在标准 shell 中：https://github.com/highlightjs/highlight.js/issues/630#issuecomment-61978331

### 1.2.8

- 修改 boundary 边界为编辑器实例本身，原为 document.body
- 修改部分样式

### 1.2.7

- 升级 quill-magic-url，使能自动识别 URL
- 修改列表样式、缩进等
- 默认 table 列宽变为 120
- 修改触发 list 的 keyboard.bindings.'list autofill'.prefix
- 修改触发 list 的 markdown 的正则
- 点击 URL 出来的弹框添加跳转功能

### 1.2.6

- 添加 ChangeLog
- readme 中添加开发须知
- 修改 Heading 样式，变为简写：H1、H2、H3、H4、正文

### 1.2.5

- table 中支持 List，解决下一个 cell 的有序列表数字继承上一个列表的 bug
- 有序列表只能输入“1. ”才会触发，改变比如输入“30. ”会变为“1. ”开始的有序列表的行为

### 1.2.4

- 添加 example/本地 demo 启动 CLI
- 修改 umd webpack 打包去除 react
- 修复在 react 项目中直接 import dist 文件报 hooks 不能使用 bug

### 1.2.3

- 解决转函数组件后代码高亮报错 bug，需要先执行 highlight 初始化函数
- 去除多编辑器的 imageResize 浮层不消失 bug
- utils 改 ts
- better-table 放在本地，运行并修改部分源代码以支持在 table 中加入 List，解决报错

### 1.2.2

解决上传图片 bug

### 1.2.1

解决 1.2.0 导出 bug

### 1.2.0

大升级：

- 解决所有 ts error
- 添加 umd 打包和 ts 打包
- 使用函数组件和 hooks 重构
- 更新 readme

### 1.1.2

采用 TSC 打包到 lib 文件夹

### 1.1.0

改变 main 引用，默认使用源码而不是打包结果

### 1.0.9

上传图片函数升级 & 添加系统字体 & 添加 Heading

### 1.0.8

更新上传图片 API 的返回 Promise

### 1.0.6、1.0.7

改变图片 Base64 为图片上传 API：解决图片上传传入 API 及 response 处理方法

### 1.0.5

bugfix: 同一页面多个编辑器，样式错乱

### 1.0.4、1.0.3

props 中添加初始值、readOnly，修复 toolbarOptions 自定义控制 bug

### 1.0.2

codeHighlight config bugfix & api update

### 1.0.1

add user-defined toolbar & update readme & publish

### 1.0.0

UMD 打包可使用的 Quill 富文本编辑器
