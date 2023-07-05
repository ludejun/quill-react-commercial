'use strict';

var toolbarHandler = require('./toolbarHandler.js');

// Copy/paste or drag images into the rich-text editor.

// 新的Module原理：在text-change时将所有编辑器中有base64的图片都上传，增加uploading状态
// https://github.com/quilljs/quill/issues/1089#issuecomment-614313509
class ImageDrop {
  /**
   * Instantiate the module given a quill instance and any options
   * @param {Quill} quill
   * @param {Object} options
   */
  constructor(quill, options = {}) {
    // save the quill reference
    this.quill = quill;
    this.options = options;
    this.imageHandler = options.imageHandler; // 添加图片上传方法
    this.uploadedImgsList = options.uploadedImgsList;
    if (this.uploadTimer) clearTimeout(this.uploadTimer);
    this.quill.on('text-change', (delta, oldDelta, source) => {
      if (this.imageHandler && this.imageHandler.imgUploadApi) {
        this.uploadTimer = setTimeout(() => {
          const imgs = quill.container.querySelectorAll(
            'img[src^="data:"]:not(.uploading):not(.upload-fail)',
          );
          imgs.forEach((img) => this.uploadBase64Img(img));
        }, 1);
      }

      // 当删除图片，该图片的失败tooltip应该删除，此tooltip是在ImageDrop Module中添加
      for (let i = 0; i < delta.ops.length; i++) {
        if (delta.ops[i].hasOwnProperty('delete') && source === 'user') {
          this.onDelete(); // TODO还没有判断删除的是图片，测试条件应该是上传但是断网的情况
        }
      }
    });
    this.b64ToUrl = this.b64ToUrl.bind(this);
    this.uploadBase64Img = this.uploadBase64Img.bind(this);
  }

  uploadBase64Img(img) {
    const base64Str = img.getAttribute('src');
    if ((typeof base64Str === 'string' && base64Str.length > this.options.urlLength) || 100) {
      // 在图片上增加浮层，使用伪元素失败，在图片上建立位置一样元素div，div增加样式或者别的dom更有操作性
      const id = parseInt(Math.random() * 1000); // 用来删除图片时删除同className的tooltip，删除在markdown-shortcuts中
      img.classList.add('uploading', `i-${id}`); // text-change监听中图片选择器要用

      const statusDiv = document.createElement('div');
      statusDiv.classList.add('img-status', 'uploading');
      statusDiv.innerHTML = `<div class="uploading">${
        this.options.uploadingHtml || '图片上传中...'
      }</div><div class="fail">${this.options.failHtml || '上传失败'}</div>`;
      // 这个时候img dom已经插入了编辑器，但是还没有渲染，位置信息可能不对
      // const rect = img.getBoundingClientRect();
      const parent = this.quill.root.parentNode;

      statusDiv.style.cssText = `left: ${img.offsetLeft}px;
      top: ${img.offsetTop}px;
      display: block;
      `;

      parent.append(statusDiv);
      const { uploadSuccCB, uploadFailCB } = this.imageHandler;
      this.b64ToUrl(base64Str)
        .then((url) => {
          img.setAttribute('src', url);
          parent.removeChild(statusDiv);
          this.uploadedImgsList.push(url);
          if (uploadSuccCB) uploadSuccCB(url);
        })
        .catch((error) => {
          console.log(error);
          img.classList.remove('uploading');
          img.classList.add('upload-fail');
          statusDiv.classList.remove('uploading');
          statusDiv.classList.add('upload-fail', `i-${id}`);
          this.showFailTooltip(img, id);
          // 添加这个事件主要是防止页面滚动导致tooltip覆盖层错位，后续可以监听滚动事件，但是有性能问题
          img.addEventListener('mouseenter', (e) => this.showFailTooltip(e.target, id));
          if (uploadFailCB) uploadFailCB(error);
        });
    }
  }

  /**
   * Convert a base64 string in a Blob according to the data and contentType.
   *
   * @param b64Data {String} Pure base64 string without contentType
   * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
   * @param sliceSize {Int} SliceSize to process the byteCharacters
   * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
   * @return Blob
   */
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  b64ToUrl(base64) {
    return new Promise((resolve, reject) => {
      // Split the base64 string in data and contentType
      const block = base64.split(';');
      // Get the content type of the image
      const contentType = block[0].split(':')[1];
      // get the real base64 content of the file
      const realData = block[1].split(',')[1];
      // Convert it to a blob to upload
      const blob = this.b64toBlob(realData, contentType);

      const { imgUploadApi } = this.imageHandler;
      toolbarHandler.uploadImg(
        blob,
        imgUploadApi,
        (url) => {
          resolve(url);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  showFailTooltip(img, id) {
    if (img) {
      const base64Str = img.getAttribute('src');
      if ((typeof base64Str === 'string' && base64Str.length > this.options.urlLength) || 100) {
        const rect = img.getBoundingClientRect();
        const parent = this.quill.root.parentNode;
        const tooltip = parent.querySelector(`div.i-${id}`);
        const containerRect = parent.getBoundingClientRect();
        if (tooltip) {
          tooltip.style.cssText = `${tooltip.style.cssText}left:${
            rect.left - containerRect.left - 1 + parent.scrollLeft
          }px;top:${rect.top - containerRect.top + parent.scrollTop}px;max-height:${
            img.height
          }px;max-width:${img.width}px;display: block;`;
          setTimeout(() => {
            tooltip.style.display = 'none';
          }, 2000);
        }
      } else {
        // 已经上传成功的图片删除失败tooltip
        this.quill.root.parentNode.removeChild(
          this.quill.root.parentNode.querySelector(`div.i-${id}`),
        );
      }
    }
  }

  onDelete() {
    const imgTooltip = this.quill.root.parentNode.querySelectorAll('div.upload-fail');
    if (imgTooltip.length > 0) {
      const base64Img = this.quill.container.querySelectorAll('img[src^="data:"]');
      let classList = [];
      base64Img.forEach((img) => {
        classList = classList.concat(img.className.split(' '));
      });
      imgTooltip.forEach((tooltip) => {
        const match = tooltip.className.split(' ').filter((css) => /i-\w/.test(css));
        if (!classList.includes(match[0])) this.quill.root.parentNode.removeChild(tooltip);
      });
    }
  }
}

exports.ImageDrop = ImageDrop;
