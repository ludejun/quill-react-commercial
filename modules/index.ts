// import Quill from 'quill';
import { ImageDrop } from './imagePasteDrop';
import ImageResize from './imageResize';
import { MagicUrl } from './magic-url';
import MarkdownShortcuts from './markdown-shortcuts';
import ToolbarTable from './toolbar-table';
import highlightInit from './highlight';
import QuillBetterTable from './quill-better-table/quill-better-table';
import Image from './image';

// Quill.register(
//   {
//     'modules/imageResize': ImageResize,
//     'modules/imageDrop': ImageDrop,
//     'modules/magicUrl': MagicUrl,
//     'modules/markdownShortcuts': MarkdownShortcuts,
//     'modules/toolbarTable': ToolbarTable,
//   },
//   true,
// );

export {
  highlightInit,
  ImageDrop,
  Image,
  ImageResize,
  MagicUrl,
  MarkdownShortcuts,
  ToolbarTable,
  QuillBetterTable,
};
