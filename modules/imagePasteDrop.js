// Copy/paste or drag images into the rich-text editor.
/* 原改编自 'quill-image-drop-module'，主要Bug是
		1. Quill已支持Drop成Base64图片，当本Module运行时Drop会插入两次base64图片
		2. paste到table中还是Base64
		3. 无法上传到服务器
*/
import { getI18nText } from '../i18n';
import { throttle } from '../utils';

// 新的Module原理：在text-change时将所有编辑器中有base64的图片都上传，增加uploading状态
// https://github.com/quilljs/quill/issues/1089#issuecomment-614313509
export class ImageDrop {
  /**
   * Instantiate the module given a quill instance and any options
   * @param {Quill} quill
   * @param {Object} options
   */
  constructor(quill, options = {}) {
    this.quill = quill; // save the quill reference
    this.options = options;
    this.editorContainer = quill.root.parentNode;
    this.imageHandler = options.imageHandler; // 添加图片上传方法
    this.uploadedImgsList = options.uploadedImgsList;
    // if (this.uploadTimer) clearTimeout(this.uploadTimer);
    this.quill.on('text-change', (delta, oldDelta, source) => {
      if (this.imageHandler && this.imageHandler.imgUploadApi) {
        throttle(() => {
          const imgs = quill.container.querySelectorAll(
            'img[src^="data:"]:not(img[data-status=uploading]):not(img[data-status=fail])',
          );

          if (imgs && imgs.length > 0) {
            imgs.forEach((img) => {
              this.uploadBase64Img(img);
            });
          }
        })();
      }

      // // 当删除图片，该图片的失败tooltip应该删除，此tooltip是在ImageDrop Module中添加
      // for (let i = 0; i < delta.ops.length; i++) {
      //   if (delta.ops[i].hasOwnProperty('delete') && source === 'user') {
      //     // 判断所有 delete 的 img url
      //     const deleted = ImageDrop.getImgUrls(this.quill.getContents().diff(oldDelta));
      //     // getImgUrls(this.quill.getContents()) 能拿到所有现存 img url
      //     if (deleted && deleted.length > 0) {
      //       this.onDelete();
      //     }
      //   }
      // }
      this.onDelete(); // 图片删除、图片后新增换行时去除格式
    });
    // this.b64ToUrl = this.b64ToUrl.bind(this);
  }

  uploadBase64Img(img) {
    console.log('upload img');
    const base64Str = img.getAttribute('src');
    if (typeof base64Str === 'string' && /data:image\/.*;base64,/.test(base64Str)) {
      const words = getI18nText(['imgStatusUploading', 'imgStatusFail'], this.options.i18n);
      img.setAttribute('data-status', 'uploading');
      img.parentNode.classList.add('img-container'); // 只能给图片的父元素添加 after 伪元素，img无法添加
      img.parentNode.setAttribute('data-after', words[0]);
      // const statusDiv = document.createElement('div');
      // statusDiv.classList.add('img-status', 'uploading');
      // statusDiv.innerHTML = '<p>图片上传中...</p>';
      // statusDiv.style.cssText = `left:${img.offsetLeft}px;top:${img.offsetTop}px;display:block;`;
      // this.editorContainer.append(statusDiv);
      const { uploadSuccCB, uploadFailCB } = this.imageHandler;
      this.b64ToUrl(base64Str)
        .then((url) => {
          img.setAttribute('src', url);
          img.setAttribute('data-status', 'success');
          img.parentNode.setAttribute('data-after', '');
          this.uploadedImgsList.push(url);
          if (uploadSuccCB) uploadSuccCB(url);
        })
        .catch((error) => {
          console.log(error);
          img.setAttribute('data-status', 'fail');
          img.parentNode.setAttribute('data-after', words[1]);
          if (uploadFailCB) uploadFailCB(error);
          img.parentNode.onclick = () => this.uploadBase64Img(img);
        });
    }
  }

  onDelete() {
    const allContainers = this.quill.container.querySelectorAll('.img-container[data-after]');
    if (allContainers && allContainers.length > 0) {
      allContainers.forEach((container) => {
        const imgs = container.querySelectorAll('img[src^="data:"]');
        if (!imgs || imgs.length === 0) {
          container.removeAttribute('data-after');
          container.removeAttribute('class');
        }
      });
    }
    // const imgTooltip = this.quill.root.parentNode.querySelectorAll('div.upload-fail');
    // if (imgTooltip.length > 0) {
    //   const base64Img = this.quill.container.querySelectorAll('img[src^="data:"]');
    //   let classList = [];
    //   base64Img.forEach((img) => {
    //     classList = classList.concat(img.className.split(' '));
    //   });
    //   imgTooltip.forEach((tooltip) => {
    //     const match = tooltip.className.split(' ').filter((css) => /i-\w/.test(css));
    //     if (!classList.includes(match[0])) this.quill.root.parentNode.removeChild(tooltip);
    //   });
    // }
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
      const blob = ImageDrop.b64toBlob(realData, contentType);

      const { imgUploadApi } = this.imageHandler;
      ImageDrop.uploadImg(
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

  // 获取 delta 中所有图片 URL：https://github.com/quilljs/quill/issues/2041#issuecomment-492488030
  static getImgUrls(delta) {
    return delta.ops.filter((i) => i.insert && i.insert.image).map((i) => i.insert.image);
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
  static b64toBlob(b64Data, contentType, sliceSize) {
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

  static uploadImg = (blob, imgUploadApi, uploadSuccCB, uploadFailCB) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, blob.name || `default.${blob.type.split('/')[1]}`);
      imgUploadApi(formData)
        .then((url) => {
          uploadSuccCB(url);
        })
        .catch((error) => {
          console.log('upload img error: ', error);
          uploadFailCB(error);
        });
    } catch (e) {
      console.log('uploadImg: ', e);
      uploadFailCB(e);
    }
  };
  // showFailTooltip(img, id) {
  //   if (img) {
  //     const base64Str = img.getAttribute('src');
  //     if (typeof base64Str === 'string' && /data:image\/.*;base64,/.test(base64Str)) {
  //       const rect = img.getBoundingClientRect();

  //       const tooltip = this.editorContainer.querySelector(`div.i-${id}`);
  //       const tooltip = img.parent.querySelector('.img-status');
  //       img.parent.style.position = 'relative';
  //       const containerRect = img.parent.getBoundingClientRect();
  //       if (tooltip) {
  //         tooltip.style.cssText = `${tooltip.style.cssText}left:${
  //           rect.left - containerRect.left - 1 + this.editorContainer.scrollLeft
  //         }px;top:${rect.top - containerRect.top + this.editorContainer.scrollTop}px;max-height:${
  //           img.height
  //         }px;max-width:${img.width}px;display: block;`;
  //         // setTimeout(() => {
  //         //   tooltip.style.display = 'none';
  //         // }, 2000);
  //       }
  //     } else {
  //       // 已经上传成功的图片删除失败tooltip
  //       img.parentNode.removeChild(
  //         // this.quill.root.parentNode.querySelector(`div.i-${id}`),
  //         img.parent.querySelector('.img-status'),
  //       );
  //     }
  //   }
  // }
}
