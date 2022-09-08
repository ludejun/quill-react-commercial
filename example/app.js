
const App = () => {
  const quill = React.useRef({});
  const initContent = '';
  const getQuill = (quillIns) => {
    quill.current = quillIns;
  };
  const quillChange = (delta, old, source) => {
    console.log('quill-change:', delta, old, source);
  };
  console.log(window, window.RichTextEditor);
  const RichTextEditor = window.RichTextEditor.default;

  return (
    <div className="App">
      <RichTextEditor
        readOnly={false}
        modules={{
          table: {},
          codeHighlight: true,
          // imageHandler: {
          //   imgUploadApi: (formData) =>
          //     // console.log(apiURL('uploadImg'))
          //     request(apiURL('uploadImg'), ajaxFormPostOptions(formData)).then(
          //       (response) => response.url,
          //     ),
          //   uploadFailCB: () => console.error('图片上传失败'),
          // },
        }}
        getQuill={getQuill}
        content={
          // 初始化笔记内容，而不能直接使用activeNote.content，因为当更新或保存会重新渲染导致内容重置到保存时刻，光标变到开头
          initContent
        }
        onChange={quillChange}
      />
    </div>
  );
}
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);
