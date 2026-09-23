import Quill from 'quill';
import { getI18nText, i18nConfig } from '../../i18n';
import { isUrl, toEmbedUrl } from '../../utils';
import { quillImport, quillModule } from '../../quillTypes';
import type { ToolbarModule } from '../../quillTypes';

/**
 * `core/module` is Quill's bare base class — a constructor that stores the
 * editor and its options. Quill types `import()` as `unknown`, so the shape is
 * declared here the same way the other handlers' base classes are.
 */
const Module = quillImport<new (quill: Quill, options: unknown) => object>('core/module');

export interface VideoHandlerOptions {
  i18n?: keyof typeof i18nConfig;
  /** Default `width` attribute on the inserted iframe. */
  width?: string;
  /** Default `height` attribute on the inserted iframe. */
  height?: string;
}

/**
 * Toolbar entry for inserting a video. Quill ships the `video` format but no
 * way to reach it, so this adds the button, a small URL dialog, and the
 * page-URL → embed-URL conversion users expect when they paste a link straight
 * out of the address bar.
 */
class VideoHandler extends Module {
  quill: Quill;
  options: VideoHandlerOptions;
  toolbar?: ToolbarModule;
  videoDialog?: HTMLDivElement;

  constructor(quill: Quill, options: VideoHandlerOptions) {
    super(quill, options);

    this.quill = quill;
    this.options = options || {};
    this.toolbar = quillModule<ToolbarModule>(quill, 'toolbar');
    if (typeof this.toolbar !== 'undefined') {
      this.toolbar.addHandler('video', () => this.handleVideoClick());
    }
  }

  handleVideoClick() {
    this.videoDialogOpen();
    // Same dismissal behaviour as the image and divider dialogs.
    this.quill.container.parentNode?.addEventListener('click', () => this.videoDialogClose());
    window.addEventListener('resize', () => this.videoDialogClose());
  }

  videoDialogOpen() {
    if (this.toolbar?.container?.querySelector('.ql-video-dialog')) {
      this.videoDialogClose();
    } else {
      this.showVideoDialog();
    }
  }

  showVideoDialog() {
    const toolbarContainer = this.toolbar?.container;
    if (!toolbarContainer) return;

    if (!this.videoDialog) {
      const words = getI18nText(['videoDialogUrlLabel', 'videoDialogInsert'], this.options.i18n);
      this.videoDialog = document.createElement('div');
      this.videoDialog.classList.add('ql-video-dialog', 'ql-toolbar-dialog');
      this.videoDialog.innerHTML = `
      <p class="url-label">${words[0]}</p>
      <div class="video-url-form"><input class="text-input" type="text" placeholder="https://www.youtube.com/watch?v=..." /><span class="url-submit">${words[1]}</span></div>
      <p class="err-tips err-url"></p>
      `;

      const urlInput = this.videoDialog.querySelector<HTMLInputElement>('input.text-input');
      // Stop the click from bubbling up and closing the dialog again.
      urlInput?.addEventListener('click', (e) => e.stopPropagation());
      urlInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submit(urlInput);
        }
      });
      this.videoDialog.querySelector('.url-submit')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (urlInput) this.submit(urlInput);
      });
    }

    toolbarContainer.append(this.videoDialog);
    this.videoDialog.querySelector<HTMLInputElement>('input.text-input')?.focus();
  }

  private submit(urlInput: HTMLInputElement) {
    const url = urlInput.value.trim();
    if (url && isUrl(url)) {
      this.insertVideo(toEmbedUrl(url));
      this.videoDialogClose();
      urlInput.value = '';
      this.quill.enable(true);
      return;
    }
    const tips = this.videoDialog?.querySelector<HTMLElement>('.err-tips.err-url');
    if (tips) {
      tips.innerText = getI18nText('linkUrlErr', this.options.i18n) as string;
      urlInput.addEventListener('input', () => {
        if (tips.innerText) tips.innerText = '';
      });
    }
    urlInput.focus();
  }

  videoDialogClose() {
    this.videoDialog?.remove();
  }

  insertVideo(url: string) {
    this.quill.enable(true);
    const range = this.quill.getSelection(true);
    this.quill.insertEmbed(range.index, 'video', url, Quill.sources.USER);
    const { width, height } = this.options;
    if (width || height) {
      if (width) this.quill.formatText(range.index, 1, 'width', width, Quill.sources.USER);
      if (height) this.quill.formatText(range.index, 1, 'height', height, Quill.sources.USER);
    }
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
  }
}

export default VideoHandler;
