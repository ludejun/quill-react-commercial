const App = () => {
  const quill = React.useRef({});
  const [delta, setDelta] = React.useState('');
  const initContent = '';
    // {"ops":[{"insert":"\n\nawef"},{"attributes":{"list":"ordered-3"},"insert":"\n"},{"insert":"awfeawef"},{"attributes":{"list":"ordered-3"},"insert":"\n"},{"insert":"awfe"},{"attributes":{"list":"ordered-3"},"insert":"\n"},{"insert":"\n\n违法未"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"啊违法"},{"attributes":{"list":"ordered"},"insert":"\n"}]};
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
        i18n={'en'}
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
            uploadFailCB: () => console.error('Image upload fail!'),
          },
        }}
        getQuill={getQuill}
        content={initContent}
        onChange={quillChange}
        onFocus={(arg) => {}}
        onSave={() => console.log(`'CMD+S' used.`)}
      />
      <div style={{ height: 200 }}>{delta}</div>
    </div>
  );
};
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);
