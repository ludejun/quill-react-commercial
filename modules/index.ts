import Quill from 'quill';
import { ImageDrop } from './imagePasteDrop';
import ImageResize from './imageResize';
import { MagicUrl } from './magic-url';
import MarkdownShortcuts from './markdown-shortcuts';
import highlightInit from './highlight';
import QuillBetterTable from './quill-better-table/quill-better-table';
import { Image, ListItem, QSyntax, DividerBlot } from './customeFormats';

import { toolbarInit, LinkHandler, undoHandler, redoHandler, TableHandler, ImageHandler, CodeHandler, DividerHandler } from './toolbar';
import { showTitle } from './iconTitle/title';
import { keyboardBindsFn } from './keyboard';

Quill.register(Image, true); // 允许图片的样式保存在Delta中
Quill.register(ListItem, true); // 允许列表的起始值和类型保存在Delta中
Quill.register(DividerBlot, true); // 允许普通分隔线和样式保存在Delta中
Quill.register(
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
};
