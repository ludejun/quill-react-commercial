// Copy/paste or drag images into the rich-text editor.
/* 原改编自 'quill-image-drop-module'，主要Bug是
		1. Quill已支持Drop成Base64图片，当本Module运行时Drop会插入两次base64图片
		2. paste到table中还是Base64
		3. 无法上传到服务器
*/
import { uploadImg } from './toolbarHandler';

// 新的Module原理：在text-change时将所有编辑器中有base64的图片都上传，增加uploading状态
// https://github.com/quilljs/quill/issues/1089#issuecomment-614313509
export class ImageDrop {
  /**
   * Instantiate the module given a quill instance and any options
   * @param {Quill} quill
   * @param {Object} options
   */
  constructor(quill, options = {}) {
    // save the quill reference
    this.quill = quill;
    this.imageHandler = options.imageHandler; // 添加图片上传方法
    this.quill.on('text-change', (delta, oldDelta, source) => {
      if (this.imageHandler.imgUploadApi) {
        const imgs = quill.container.querySelectorAll('img[src^="data:"]:not(.uploading)');
        imgs.forEach((img) => this.uploadBase64Img(img));
      }
    });
    this.b64ToUrl = this.b64ToUrl.bind(this);
    this.uploadBase64Img = this.uploadBase64Img.bind(this);
  }

  uploadBase64Img(img) {
    const base64Str = img.getAttribute('src');
    if (typeof base64Str === 'string' && base64Str.length > 100) {
      // 在图片上增加浮层，使用伪元素失败，在图片上建立位置一样元素div，div增加样式或者别的dom更有操作性
      const id = parseInt(Math.random() * 1000); // 用来删除图片时删除同className的tooltip，删除在markdown-shortcuts中
      img.classList.add('uploading', `i-${id}`); // text-change监听中图片选择器要用

      const statusDiv = document.createElement('div');
      statusDiv.classList.add('img-status', 'uploading');
      statusDiv.innerHTML = `<div class="uploading">Uploading...</div><div class="fail">上传失败</div>`;
      // 这个时候img dom已经插入了编辑器，但是还没有渲染，位置信息可能不对
      // const rect = img.getBoundingClientRect();
      const parent = this.quill.root.parentNode;
      const containerRect = parent.getBoundingClientRect();

      statusDiv.style.cssText = `left: ${img.offetLeft}px;
      top: ${img.offsetTop}px;
      display: block;
      `;

      parent.append(statusDiv);
      const { uploadSuccCB, uploadFailCB } = this.imageHandler;
      this.b64ToUrl(base64Str)
        .then((url) => {
          img.setAttribute('src', url);
          parent.removeChild(statusDiv);
          if (uploadSuccCB) uploadSuccCB(url);
        })
        .catch((error) => {
          console.log(error);
          img.classList.remove('uploading');
          img.classList.add('upload-fail');
          const rect = img.getBoundingClientRect();
          statusDiv.style.cssText = `${statusDiv.style.cssText}left:${
            rect.left - containerRect.left - 1 + parent.scrollLeft
          }px;top:${rect.top - containerRect.top + parent.scrollTop}px;height:${
            img.height
          }px;width:${img.width}px;`;
          statusDiv.classList.remove('uploading');
          statusDiv.classList.add('upload-fail', `i-${id}`);
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
      uploadImg(
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
}
