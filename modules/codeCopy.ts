// https://stackblitz.com/edit/typescript-hpk9vc?file=index.ts
// https://stackoverflow.com/questions/65501672/quilljs-copycode-module-failed-to-execute-insertbefore-on-node/65577686#65577686
import Quill from 'quill';

const copyContentIntoClipboard = (rawData: string) => {
  const encodedContent = encodeURIComponent(rawData);
  const filteredEncodedContent = encodedContent.replace(/%EF%BB%BF/g, '');
  const targetContent = decodeURIComponent(filteredEncodedContent);
  const tmpHolder = document.createElement('textarea');
  tmpHolder.value = targetContent;
  document.body.appendChild(tmpHolder);
  tmpHolder.select();
  document.execCommand('copy');
  document.body.removeChild(tmpHolder);
};

class CodeCopy {
  quill: Quill;
  options: any;
  container: HTMLElement;
  unusedBadges: HTMLElement[] = [];
  reference: {
    [index: string]: {
      parent: HTMLElement | null,
      copyBadge: HTMLElement | null,
    },
  } = {};

  constructor(quill: Quill, options: any) {
    this.quill = quill;
    this.options = options;
    this.container = this.quill.addContainer('ql-badge-container');
    (this.quill.root.parentNode as HTMLElement).style.position =
      (this.quill.root.parentNode as HTMLElement).style.position || 'relative';
    this.registerCodeBlock();
    this.quill.on('editor-change', () => {
      Object.values(this.reference).forEach((item) => {
        this.addCopyBadge(item);
        this.repositionCopyBadge(item);
      });
    });
  }

  registerCodeBlock = () => {
    const self = this;
    const CodeBlock = Quill.import('formats/code-block');
    let counter = 0;
    class CopyMode extends CodeBlock {
      domNode!: HTMLElement;
      insertInto(...args: any) {
        super.insertInto(...args);

        const index = String(counter);
        const _node = this.domNode;
        _node.setAttribute('data-index', index);
        counter++;
        self.reference[index] = { parent: _node, copyBadge: null };
      }
      remove() {
        const index = this.domNode.getAttribute('data-index');
        if (index) {
           if (self.reference[index] && self.reference[index]['copyBadge']) {
             const copyBadge = self.reference[index]['copyBadge'];
             copyBadge!.style.display = 'none';
             self.unusedBadges.push(copyBadge!);
           }
           delete self.reference[index];
        }
        super.remove();
      }
    }
    Quill.register(CopyMode, true);
  };

  addCopyBadge = (obj: any) => {
    if (obj.copyBadge != null || obj.parent == null) {
      return;
    }

    const index = obj.parent.getAttribute('data-index');
    const copyBadge = this.unusedBadges.length
      ? this.unusedBadges.shift()
      : document.createElement('span');
    copyBadge!.style.display = 'block';
    copyBadge!.contentEditable = 'false';
    copyBadge!.classList.add('ql-badge', 'ql-badge-copy');
    copyBadge!.textContent = 'copy';

    const copyHandler = (evt: MouseEvent) => {
      evt.stopPropagation();
      evt.preventDefault();
      const codeArea = obj.parent;
      const copyText = codeArea?.textContent?.trim() || '';
      if (!codeArea) {
        return;
      }
      copyBadge!.textContent = 'copied!';
      setTimeout(function () {
        copyBadge!.textContent = 'copy';
      }, 2000);
      copyContentIntoClipboard(copyText);
    };
    copyBadge!.addEventListener('click', copyHandler, true);
    this.container.appendChild(copyBadge!);
    this.reference[index]['copyBadge'] = copyBadge!;
  };

  repositionCopyBadge(obj: any) {
    const parent: HTMLElement = this.quill.root.parentNode as HTMLElement;
    const specRect = obj.parent.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    Object.assign(obj.copyBadge.style, {
      right: `${specRect.left - parentRect.left - 1 + parent.scrollLeft + 4}px`,
      top: `${specRect.top - parentRect.top + parent.scrollTop + 3}px`,
    });
  }
}

Quill.register('modules/codeCopy', CodeCopy);

