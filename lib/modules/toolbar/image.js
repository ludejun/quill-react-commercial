'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var quill = require('../../node_modules/quill/dist/quill.js');
var i18n = require('../../i18n.js');
var utils = require('../../utils.js');

const Module = quill.default.import('core/module');

class ImageHandler extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('image', this.handleImageClick.bind(this));
    }
  }

  handleImageClick() {
    this.imageDialogOpen();
    if (window.event) {
      window.event.cancelBubble = true;
      // 点击整个编辑器就消除image的弹出框
      this.quill.container.parentNode.addEventListener('click', () => {
        this.imageDialogClose();
      });
    } else {
      // 聚焦文本container就消除image的弹出框
      this.quill.container.addEventListener('click', () => {
        this.imageDialogClose();
      });
    }
    window.addEventListener('resize', () =>{
      this.imageDialogClose();
    });
  }

  imageDialogOpen() {
    if (this.toolbar.container.querySelector('.ql-image-dialog')) {
      this.imageDialog.remove();
    } else {
      this.showImageDialog();
    }
  }

  showImageDialog() {
    const toolbarContainer = this.toolbar.container;
    if (!this.imageDialog) {
      this.imageDialog = document.createElement('div');
      this.imageDialog.classList.add('ql-image-dialog');
      const words = i18n.getI18nText(['imageDialogLocal', 'imageDialogUrlLabel', 'iamgeDialogInsert'], this.options.i18n);
      this.imageDialog.innerHTML = `
      <input type="file" class="ql-image-upload" accept="${
        this.options.imageAccept || 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
      }" />
      <button class="local-image">${words[0]}</button>
      <p class="err-tips err-file"></p>
      <p class="url-label">${words[1]}</p>
      <div class="image-url-form"><input class="text-input" type="text" placeholder="https://example.com/img.png" /><span class="url-submit">${
        words[2]
      }</span></div>
      <p class="err-tips err-url"></p>
      `;

      
      this.fileInput = this.imageDialog.querySelector('input.ql-image-upload[type=file]');
      const urlInput = this.imageDialog.querySelector('input.text-input');
      urlInput.onclick = (e) => {
        e.stopPropagation();
      }; // 阻止冒泡导致 imageDialog 消失
      this.imageDialog.querySelector('.url-submit').onclick = (e) => {
        e.stopPropagation();
        const url = urlInput.value;
        if (url && utils.isUrl(url)) {
          this.insertImage(url);
          this.imageDialogClose();
          urlInput.value = '';
          this.quill.enable(true);
        } else {
          const tips = this.imageDialog.querySelector('.err-tips.err-url');
          tips.innerText = i18n.getI18nText('linkUrlErr', this.options.i18n);
          urlInput?.addEventListener('input', () => {
            if (tips.innerText) tips.innerText = '';
          });
        }
      };
      this.imageDialog.querySelector('button.local-image').onclick = (e) => {
        e.stopPropagation();
        this.fileInput.click();
        this.imageDialog.querySelector('.err-tips.err-file').innerText = ''; // 删除之前的 errtips
      };

      this.fileInput.onchange = () => {
        const { files } = this.fileInput;

        if (!files || !files.length) {
          return;
        }

        // // 请求图片保存API
        // const { imgUploadApi, uploadSuccCB, uploadFailCB } = this.options;
        // if (imgUploadApi) {
        //   ImageHandler.uploadImg(
        //     files[0],
        //     imgUploadApi,
        //     (url) => {
        //       this.insertImage(url);
        //       if (uploadSuccCB) uploadSuccCB(url);
        //     },
        //     (error) => {
        //       this.quill.enable(true);
        //       if (uploadFailCB) uploadFailCB(error);
        //     },
        //   );
        // }

        // 先将图片转 base64 插入编辑器中，再由 imagePasteDrop上传，用户能更快看到图片，后台上传
        this.beforeUpload(files[0]); // 上传先一张一张来
      };
    } else {
      this.imageDialog.querySelector('input.text-input').value = '';
    }

    const imageIcon = toolbarContainer.querySelector('.ql-image');
    this.imageDialog.style = this.dialogPosition(imageIcon);
    toolbarContainer.append(this.imageDialog);
  }

  beforeUpload(file) {
    if (this.imageDialog) {
      const tips = this.imageDialog.querySelector('.err-tips.err-file');
      const words = i18n.getI18nText(['imageDialogTypeErr', 'imageDialogSizeErr'], this.options.i18n);
      // 判断文件的后缀，至于用户强制改变文件后缀，这里不做考虑
      if (!file.type.startsWith('image/')) {
        tips.innerText = words[0];
        this.showImageDialog();
        return;
      }
      const isLt5M = file.size / 1024 /1024 < (this.options.maxSize || 5);
      if (!isLt5M) {
        tips.innerText = words[1].replace('$', this.options.maxSize || 5);
        this.showImageDialog();
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const base64Str = e.target.result;
        this.insertImage(base64Str);
      };
    }
  }
  
  imageDialogClose() {
    if (this.imageDialog) {
      this.imageDialog.remove();
    }
  }
  dialogPosition = (clickDom) => {
    const parent = clickDom.offsetParent;
    const width = 280;
    if (parent.offsetWidth - clickDom.offsetLeft + 6 > width) {
      return `top:${clickDom.offsetTop + 24}px;left:${clickDom.offsetLeft + 6}px;`;
    } else {
      return `top:${clickDom.offsetTop + 24}px;left:${parent.offsetWidth - width}px;`;
    }
  }

  insertImage = (url) => {
    this.imageDialogClose();
    this.quill.enable(true);
    const range = this.quill.getSelection(true);
    this.quill.insertEmbed(range.index, 'image', url);
    this.quill.setSelection(range.index + 1, quill.default.sources.SILENT);
    this.fileInput.value = '';
  };
}

exports.default = ImageHandler;
