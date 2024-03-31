import '../node_modules/quill/quill.js';
import { ImageDrop } from './imagePasteDrop.js';
import ImageResize from './imageResize.js';
import { MagicUrl } from './magic-url.js';
import MarkdownShortcuts from './markdown-shortcuts.js';
import '../node_modules/highlight.js/lib/core.js';
import '../node_modules/highlight.js/lib/languages/swift.js';
export { default as QuillBetterTable } from './quill-better-table/quill-better-table.js';
import Image from './customeFormats/image.js';
import { ListItem } from './customeFormats/listItem.js';
import { LinkHandler } from './toolbar/link.js';
import TableHandler from './toolbar/table.js';
import ImageHandler from './toolbar/image.js';
import CodeHandler from './toolbar/code.js';
import QSyntax from './customeFormats/syntax.js';
import '../node_modules/quill/core.js';
import Quill from '../node_modules/quill/core/quill.js';

Quill.register(Image, true); // 允许图片的样式保存在Delta中
Quill.register(ListItem, true); // 允许图片的样式保存在Delta中
Quill.register({
    'modules/imageResize': ImageResize,
    'modules/imageDrop': ImageDrop,
    'modules/magicUrl': MagicUrl,
    'modules/markdownShortcuts': MarkdownShortcuts,
    'modules/tableHandler': TableHandler,
    'modules/linkHandler': LinkHandler,
    'modules/imageHandler': ImageHandler,
    'modules/codeHandler': CodeHandler,
    'modules/qSyntax': QSyntax,
}, true);

export { CodeHandler, Image, ImageDrop, ImageHandler, ImageResize, LinkHandler, ListItem, MagicUrl, MarkdownShortcuts, QSyntax, TableHandler };
