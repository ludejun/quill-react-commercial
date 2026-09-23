import type VideoType from 'quill/formats/video';
import { quillImport } from '../../quillTypes';

const Video = quillImport<typeof VideoType>('formats/video');

/** Used when the embed carries no explicit size. */
export const DEFAULT_VIDEO_WIDTH = '100%';
export const DEFAULT_VIDEO_HEIGHT = '360';

/** `html()` builds an HTML string, so attribute values have to be escaped. */
const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Quill 2 renders a video as an `<iframe class="ql-video">` in the editor, but
 * its own `html()` returns `<a href="…">…</a>`:
 *
 *     // quill/formats/video.js
 *     html() {
 *       const { video } = this.value();
 *       return `<a href="${video}">${video}</a>`;
 *     }
 *
 * So the moment content is read back with `getSemanticHTML()` — which is what
 * most callers save — every embedded video silently degrades to a bare link.
 * What you see is not what you store.
 *
 * This subclass overrides only `html()`, keeping Quill's `create`, `formats`,
 * `sanitize` and `value` untouched. Reported in
 * https://github.com/ludejun/quill-react-commercial/issues/19.
 */
class VideoBlot extends Video {
  override html(): string {
    const src = this.domNode.getAttribute('src') ?? '';
    const width = this.domNode.getAttribute('width') ?? DEFAULT_VIDEO_WIDTH;
    const height = this.domNode.getAttribute('height') ?? DEFAULT_VIDEO_HEIGHT;
    return (
      `<iframe class="ql-video" src="${escapeAttribute(src)}"` +
      ` width="${escapeAttribute(width)}" height="${escapeAttribute(height)}"` +
      ` frameborder="0" allowfullscreen="true"></iframe>`
    );
  }
}

export default VideoBlot;
