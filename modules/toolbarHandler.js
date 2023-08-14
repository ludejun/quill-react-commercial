// import Quill from 'quill';
// import normalizeUrl from 'normalize-url';
// import { isUrl, isEmail } from '../utils';
// import close from '../assets/icons/icon_close.svg';

// export function imageUpload(quill, imgUploadApi, uploadSuccCB, uploadFailCB) {
//   quill.disable();

//   let modal = quill.container.querySelector('div.image-tooltip');
//   let fileInput = null;

//   if (modal === null) {
//     modal = document.createElement('div');
//     modal.classList.add('image-tooltip');
//     modal.innerHTML = `
//       <input type="file" class="ql-image" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon" />
//       <div class="image-upload-btn">选择本地图片</div>
//       <p class="image-url-label">您也可以输入网络图片URL</p>
//       <div class="image-url-form"><input type="text" placeholder="http://example.com/image.png" class="image-url-input" /><span class="url-submit">插入</span></div>
//       <div class="image-close">${close}</div>
//       `;
//     quill.container.append(modal);
//     fileInput = modal.querySelector('input.ql-image[type=file]');
//     const urlInput = modal.querySelector('input.image-url-input');
//     modal.querySelector('.image-close').addEventListener('click', (e) => {
//       modal.classList.add('ql-hidden');
//       quill.enable(true);
//       e.stopPropagation();
//     });
//     modal.querySelector('.url-submit').onclick = (e) => {
//       e.stopPropagation();
//       const url = urlInput.value;
//       if (url && isUrl(url)) {
//         const range = quill.getSelection(true);
//         quill.editor.insertEmbed(range.index, 'image', normalizeUrl(url));
//         quill.setSelection(range.index + 1, Quill.sources.SILENT);
//         modal.classList.add('ql-hidden');
//         urlInput.value = '';
//         quill.enable(true);
//       } else {
//         console.log('请输入正确URL');
//       }
//     };
//     modal.querySelector('.image-upload-btn').onclick = (e) => {
//       e.stopPropagation();
//       fileInput.click();
//     };
//   } else {
//     modal.classList.remove('ql-hidden');
//     fileInput = modal.querySelector('input.ql-image[type=file]');
//   }

//   // bugfix：多次插入本地图片时，由于每次都是addEventListener添加事件导致多次插入
//   // fileInput.addEventListener('change', () => {
//   fileInput.onchange = () => {
//     const { files } = fileInput;
//     const range = quill.getSelection(true);

//     if (!files || !files.length) {
//       console.log('没有选择文件');
//       return;
//     }

//     // 请求图片保存API
//     uploadImg(
//       files[0],
//       imgUploadApi,
//       (url) => {
//         modal.classList.add('ql-hidden');
//         quill.enable(true);
//         quill.editor.insertEmbed(range.index, 'image', url);
//         quill.setSelection(range.index + 1, Quill.sources.SILENT);
//         fileInput.value = '';
//         if (!!uploadSuccCB) uploadSuccCB(url);
//       },
//       (error) => {
//         quill.enable(true);
//         uploadFailCB(error);
//       },
//     );
//   };
// }

// // 上传图片，参数为blob File
// export const uploadImg = (blob, imgUploadApi, uploadSuccCB, uploadFailCB) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', blob, blob.name || `default.${blob.type.split('/')[1]}`);
//     imgUploadApi(formData)
//       .then((url) => {
//         uploadSuccCB(url);
//       })
//       .catch((error) => {
//         console.log('图片上传失败');
//         console.log(error);
//         uploadFailCB(error);
//       });
//     // uploadFailCB('1234');
//   } catch (e) {
//     console.log('uploadImg', e);
//     uploadFailCB(e);
//   }
// };
