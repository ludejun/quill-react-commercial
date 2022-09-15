import Quill from 'quill';
import { isUrl, isEmail } from '../utils';
import close from '../assets/icons/icon_close.svg';

export function imageUpload(quill, imgUploadApi, uploadSuccCB, uploadFailCB) {
  quill.disable();

  let modal = quill.container.querySelector('div.image-tooltip');
  let fileInput;

  if (modal === null) {
    modal = document.createElement('div');
    modal.classList.add('image-tooltip');
    modal.innerHTML = `
      <input type="file" class="ql-image" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon" />
      <div class="image-upload-btn">上传图片</div>
      <p class="image-url-label">您也可以输入网络图片URL</p>
      <div class="image-url-form"><input type="text" placeholder="http://example.com/image.png" class="image-url-input" /><span class="url-submit">插入</span></div>
      <div class="image-close">${close}</div>
      `;
    quill.container.append(modal);
    fileInput = modal.querySelector('input.ql-image[type=file]');
    const urlInput = modal.querySelector('input.image-url-input');
    modal.querySelector('.image-close').addEventListener('click', (e) => {
      modal.classList.add('ql-hidden');
      quill.enable(true);
      e.stopPropagation();
    });
    modal.querySelector('.url-submit').addEventListener('click', (e) => {
      e.stopPropagation();
      const url = urlInput.value;
      if (url && isUrl(url)) {
        const range = quill.getSelection(true);
        quill.editor.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
        modal.classList.add('ql-hidden');
        urlInput.value = '';
        quill.enable(true);
      } else {
        console.log('请输入正确URL');
      }
    });
    modal.querySelector('.image-upload-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  } else {
    modal.classList.remove('ql-hidden');
    fileInput = modal.querySelector('input.ql-image[type=file]');
  }

  fileInput.addEventListener('change', () => {
    const { files } = fileInput;
    const range = quill.getSelection(true);

    if (!files || !files.length) {
      console.log('没有选择文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    // todo 请求图片保存API
    imgUploadApi(formData)
      .then((url) => {
        modal.classList.add('ql-hidden');
        quill.enable(true);
        quill.editor.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
        fileInput.value = '';
        if (!!uploadSuccCB) uploadSuccCB(response);
      })
      .catch((error) => {
        console.log('图片上传失败');
        console.log(error);
        quill.enable(true);
        uploadFailCB(error);
      });
  });
  // quill.container.appendChild(fileInput);

  // fileInput.click();
}

export function linkHandler(value) {
  console.log('link', arguments);
  if (value === true) {
    // value = prompt('Enter link URL:'); // eslint-disable-line no-alert
    const selection = this.quill.getSelection();
    console.log(selection, this.linkRange);
    // 当没有选中任何文本，直接弹出tooltip并能插入文本、超链接
    if (selection === null || selection.length === 0) {
      console.log(this.quill);
      console.log(this.quill.theme);
      // this.quill.theme.tooltip.show();
      this.quill.theme.tooltip.edit('link', '');
      document.getElementById('link-words').value = '';
      document.getElementById('link-url').value = '';
      document.querySelector('a.ql-action').onclick = () => {
        this.quill.insertText(
          selection.index,
          document.getElementById('link-words').value,
          'link',
          document.getElementById('link-url').value,
          'user',
        );
        this.quill.theme.tooltip.hide();
      };
    } else {
      // 当有选中文本，弹出tooltip后允许修改此文本，并能插入超链接
      console.log(selection, this.quill.theme, this.linkRange);
      const text = this.quill.getText(selection);
      this.quill.theme.tooltip.edit('link', '');
      // document.getElementsByClassName('ql-tooltip')[0].classList.add('ql-editing');
      document.getElementById('link-words').value = text;

      let href = ''; // 最终超链接的地址value
      if (isEmail(text) && text.indexOf('mailto:') !== 0) {
        href = `mailto:${text}`;
      } else if (isUrl(text)) {
        if (!text.startsWith('http:') && !text.startsWith('https:')) {
          href = `http://${text}`;
        }
      }
      document.getElementById('link-url').value = href;
      document.querySelector('a.ql-action').onclick = () => {
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(
          selection.index,
          document.getElementById('link-words').value,
          'link',
          document.getElementById('link-url').value,
          'user',
        );
        this.quill.theme.tooltip.hide();
      };
    }
  } else {
    this.quill.format('link', value, Quill.sources.USER);
  }
}

export function undoHandler() {
  this.quill.history.undo();
}

export function redoHandler() {
  this.quill.history.redo();
}
