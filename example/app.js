const App = () => {
  const quill = React.useRef({});
  const [delta, setDelta] = React.useState('');
  const initContent = '';
  const getQuill = (quillIns) => {
    quill.current = quillIns;
  };
  const quillChange = (delta, old, source) => {
    // console.log('quill-change:', delta, old, source);
    setDelta(JSON.stringify(quill.current.getContents()));
  };
  const RichTextEditor = window.quillReactCommercial;

  return (
    <div className="App">
      <RichTextEditor
        // i18n={'zh'}
        readOnly={false}
        modules={{
          table: {},
          codeHighlight: true,
          imageHandler: {
            imgUploadApi: (formData) =>
              // console.log(apiURL('uploadImg'))
              request(apiURL('uploadImg'), ajaxFormPostOptions(formData)).then(
                (response) => response.url,
              ),
            uploadFailCB: () => console.error('图片上传失败'),
          },
        }}
        getQuill={getQuill}
        content={
          // 初始化笔记内容，而不能直接使用activeNote.content，因为当更新或保存会重新渲染导致内容重置到保存时刻，光标变到开头
          initContent
        }
        onChange={quillChange}
        onFocus={(arg) => {}}
      />
      <div style={{ height: 200 }}>{delta}</div>
    </div>
  );
};
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);
