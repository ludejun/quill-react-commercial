import { quillRegister } from '../quillTypes';
import { ImageDrop } from './imagePasteDrop';
import ImageResize from './imageResize';
import { MagicUrl } from './magic-url';
import MarkdownShortcuts from './markdown-shortcuts';
import highlightInit from './highlight';
import QuillBetterTable from './quill-better-table/quill-better-table';
import { Image, ListItem, QSyntax, DividerBlot, VideoBlot } from './customeFormats';

import {
  toolbarInit,
  LinkHandler,
  undoHandler,
  redoHandler,
  TableHandler,
  ImageHandler,
  CodeHandler,
  DividerHandler,
  VideoHandler,
} from './toolbar';
import { showTitle } from './iconTitle/title';
import { keyboardBindsFn } from './keyboard';

quillRegister(Image); // 允许图片的样式保存在Delta中
quillRegister(ListItem); // 允许列表的起始值和类型保存在Delta中
quillRegister(DividerBlot); // 允许普通分隔线和样式保存在Delta中
quillRegister(VideoBlot); // 让视频以 iframe 而非锚点存进 HTML，见 issue #19
quillRegister(
  {
    'modules/imageResize': ImageResize,
    'modules/imageDrop': ImageDrop,
    'modules/magicUrl': MagicUrl,
    'modules/markdownShortcuts': MarkdownShortcuts,
    'modules/tableHandler': TableHandler,
    'modules/linkHandler': LinkHandler,
    'modules/imageHandler': ImageHandler,
    'modules/codeHandler': CodeHandler,
    'modules/qSyntax': QSyntax,
    'modules/dividerHandler': DividerHandler,
    'modules/videoHandler': VideoHandler,
  },
  true,
);

export {
  highlightInit,
  ImageDrop,
  ImageResize,
  MagicUrl,
  MarkdownShortcuts,
  QuillBetterTable,
  QSyntax,
  toolbarInit,
  showTitle,
  keyboardBindsFn,
  LinkHandler,
  TableHandler,
  ImageHandler,
  undoHandler,
  redoHandler,
  CodeHandler,
  DividerHandler,
  VideoHandler,
  VideoBlot,
};
