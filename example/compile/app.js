var App = function App() {
  var quill = React.useRef({});
  var initContent = '';

  var getQuill = function getQuill(quillIns) {
    quill.current = quillIns;
  };

  var quillChange = function quillChange(delta, old, source) {
    console.log('quill-change:', delta, old, source);
  };

  console.log(window, window.RichTextEditor);
  var RichTextEditor = window.RichTextEditor["default"];
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement(RichTextEditor, {
    modules: {
      table: {},
      codeHighlight: true // imageHandler: {
      //   imgUploadApi: (formData) =>
      //     // console.log(apiURL('uploadImg'))
      //     request(apiURL('uploadImg'), ajaxFormPostOptions(formData)).then(
      //       (response) => response.url,
      //     ),
      //   uploadFailCB: () => console.error('图片上传失败'),
      // },

    },
    getQuill: getQuill,
    content: // 初始化笔记内容，而不能直接使用activeNote.content，因为当更新或保存会重新渲染导致内容重置到保存时刻，光标变到开头
    initContent,
    onChange: quillChange
  }));
};

var domContainer = document.querySelector('#root');
var root = ReactDOM.createRoot(domContainer);
root.render( /*#__PURE__*/React.createElement(App, null));
//# sourceMappingURL=app.js.map