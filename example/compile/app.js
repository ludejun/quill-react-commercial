const App = () => {
  const quill = React.useRef({});
  const [delta, setDelta] = React.useState('');
  const initContent = '';
  const getQuill = quillIns => {
    quill.current = quillIns;
  };
  const quillChange = (delta, old, source) => {
    setDelta(JSON.stringify(quill.current.getContents()));
  };
  const RichTextEditor = window.quillReactCommercial;
  return React.createElement("div", {
    className: "App"
  }, React.createElement(RichTextEditor, {
    i18n: 'en',
    readOnly: false,
    modules: {
      table: {},
      codeHighlight: true,
      imageHandler: {
        imgUploadApi: formData => request(apiURL('uploadImg'), ajaxFormPostOptions(formData)).then(response => response.url),
        uploadFailCB: () => console.error('Image upload fail!')
      }
    },
    getQuill: getQuill,
    content: initContent,
    onChange: quillChange,
    onFocus: arg => {},
    onSave: () => console.log(`'CMD+S' used.`)
  }), React.createElement("div", {
    style: {
      height: 200
    }
  }, delta));
};
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App, null));