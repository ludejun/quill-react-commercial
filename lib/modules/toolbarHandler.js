'use strict';

var quill = require('../node_modules/quill/dist/quill.js');
var index = require('../node_modules/normalize-url/index.js');
var utils = require('../utils.js');
var icon_close = require('../assets/icons/icon_close.svg.js');

function imageUpload(quill$1, imgUploadApi, uploadSuccCB, uploadFailCB) {
  quill$1.disable();

  let modal = quill$1.container.querySelector('div.image-tooltip');
  let fileInput = null;

  if (modal === null) {
    modal = document.createElement('div');
    modal.classList.add('image-tooltip');
    modal.innerHTML = `
      <input type="file" class="ql-image" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon" />
      <div class="image-upload-btn">选择本地图片</div>
      <p class="image-url-label">您也可以输入网络图片URL</p>
      <div class="image-url-form"><input type="text" placeholder="http://example.com/image.png" class="image-url-input" /><span class="url-submit">插入</span></div>
      <div class="image-close">${icon_close.default}</div>
      `;
    quill$1.container.append(modal);
    fileInput = modal.querySelector('input.ql-image[type=file]');
    const urlInput = modal.querySelector('input.image-url-input');
    modal.querySelector('.image-close').addEventListener('click', (e) => {
      modal.classList.add('ql-hidden');
      quill$1.enable(true);
      e.stopPropagation();
    });
    modal.querySelector('.url-submit').onclick = (e) => {
      e.stopPropagation();
      const url = urlInput.value;
      if (url && utils.isUrl(url)) {
        const range = quill$1.getSelection(true);
        quill$1.editor.insertEmbed(range.index, 'image', index.default(url));
        quill$1.setSelection(range.index + 1, quill.default.sources.SILENT);
        modal.classList.add('ql-hidden');
        urlInput.value = '';
        quill$1.enable(true);
      } else {
        console.log('请输入正确URL');
      }
    };
    modal.querySelector('.image-upload-btn').onclick = (e) => {
      e.stopPropagation();
      fileInput.click();
    };
  } else {
    modal.classList.remove('ql-hidden');
    fileInput = modal.querySelector('input.ql-image[type=file]');
  }

  // bugfix：多次插入本地图片时，由于每次都是addEventListener添加事件导致多次插入
  // fileInput.addEventListener('change', () => {
  fileInput.onchange = () => {
    const { files } = fileInput;
    const range = quill$1.getSelection(true);

    if (!files || !files.length) {
      console.log('没有选择文件');
      return;
    }

    // 请求图片保存API
    uploadImg(
      files[0],
      imgUploadApi,
      (url) => {
        modal.classList.add('ql-hidden');
        quill$1.enable(true);
        quill$1.editor.insertEmbed(range.index, 'image', url);
        quill$1.setSelection(range.index + 1, quill.default.sources.SILENT);
        fileInput.value = '';
        if (!!uploadSuccCB) uploadSuccCB(url);
      },
      (error) => {
        quill$1.enable(true);
        uploadFailCB(error);
      },
    );
  };
}

function linkHandler(value) {
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
        utils.saveLink(this.quill, selection.index);
      };
    } else {
      // 当有选中文本，弹出tooltip后允许修改此文本，并能插入超链接
      console.log(selection, this.quill.theme, this.linkRange);
      const text = this.quill.getText(selection);
      this.quill.theme.tooltip.edit('link', '');
      // document.getElementsByClassName('ql-tooltip')[0].classList.add('ql-editing');
      document.getElementById('link-words').value = text;

      let href = ''; // 最终超链接的地址value
      if (utils.isEmail(text) && text.indexOf('mailto:') !== 0) {
        href = `mailto:${text}`;
      } else if (utils.isUrl(text)) {
        href = index.default(text, { stripWWW: false });
      }
      document.getElementById('link-url').value = href;
      document.querySelector('a.ql-action').onclick = () => {
        this.quill.deleteText(selection.index, selection.length);
        utils.saveLink(this.quill, selection.index);
      };
    }
  } else {
    this.quill.format('link', value, quill.default.sources.USER);
  }
}

function undoHandler() {
  this.quill.history.undo();
}

function redoHandler() {
  this.quill.history.redo();
}

// 上传图片，参数为blob File
const uploadImg = (blob, imgUploadApi, uploadSuccCB, uploadFailCB) => {
  try {
    const formData = new FormData();
    formData.append('file', blob, blob.name || `default.${blob.type.split('/')[1]}`);
    imgUploadApi(formData)
      .then((url) => {
        uploadSuccCB(url);
      })
      .catch((error) => {
        console.log('图片上传失败');
        console.log(error);
        uploadFailCB(error);
      });
    // uploadFailCB('1234');
  } catch (e) {
    console.log('uploadImg', e);
    uploadFailCB(e);
  }
};

exports.imageUpload = imageUpload;
exports.linkHandler = linkHandler;
exports.redoHandler = redoHandler;
exports.undoHandler = undoHandler;
exports.uploadImg = uploadImg;
