import '../node_modules/quill/quill.js';
import '../node_modules/quill/core.js';
import Quill from '../node_modules/quill/core/quill.js';

const BlockEmbed = Quill.import('blots/block/embed');

class HorizontalRule extends BlockEmbed {}
HorizontalRule.blotName = 'hr';
HorizontalRule.tagName = 'hr';

const Block = Quill.import('blots/block');

Quill.register('formats/horizontal', HorizontalRule);

class MarkdownShortcuts {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.ignoreElements = (options && options.ignore) || [];

    this.ignoreTags = ['PRE'];

    const elements = [
      {
        name: 'header',
        pattern: /^(#){1,6}\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text);
          if (!match) return;
          const size = match[0].length;
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.quill.formatLine(selection.index, 0, 'header', size - 1);
            this.quill.deleteText(selection.index - size, size);
          }, 0);
        },
      },
      {
        name: 'blockquote',
        pattern: /^(>)\s/g,
        action: (text, selection) => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'blockquote', true);
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'code-block',
        pattern: /^`{3}(?:\s|\n)/g,
        action: (text, selection) => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'code-block', true);
            this.quill.deleteText(selection.index - 4, 4);
          }, 0);
        },
      },
      {
        name: 'bolditalic',
        pattern: /(?:\*|_){3}(.+?)(?:\*|_){3}/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { bold: true, italic: true });
            this.quill.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'bold',
        pattern: /(?:\*|_){2}(.+?)(?:\*|_){2}/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { bold: true });
            this.quill.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'italic',
        pattern: /(?:\*|_){1}(.+?)(?:\*|_){1}/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { italic: true });
            this.quill.format('italic', false);
          }, 0);
        },
      },
      {
        name: 'strikethrough',
        pattern: /(?:~~)(.+?)(?:~~)/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { strike: true });
            this.quill.format('strike', false);
          }, 0);
        },
      },
      {
        name: 'code',
        pattern: /(?:`)(.+?)(?:`)/g,
        action: (text, selection, pattern, lineStart) => {
          let match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { code: true });
            this.quill.format('code', false);
            this.quill.insertText(this.quill.getSelection(), ' ');
          }, 0);
        },
      },
      {
        name: 'hr',
        pattern: /^([-*]\s?){3}/g,
        action: (text, selection) => {
          const startIndex = selection.index - text.length;
          setTimeout(() => {
            this.quill.deleteText(startIndex, text.length);

            this.quill.insertEmbed(startIndex + 1, 'hr', true, Quill.sources.USER);
            this.quill.insertText(startIndex + 2, '\n', Quill.sources.SILENT);
            this.quill.setSelection(startIndex + 2, Quill.sources.SILENT);
          }, 0);
        },
      },
      {
        name: 'plus-ul',
        // Quill 1.3.5 already treat * as another trigger for bullet lists
        pattern: /^\+\s$/g,
        action: (text, selection, pattern) => {
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'list', 'unordered');
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'asterisk-ul',
        pattern: /^(\-|\*)\s$/g,
        action: (text, selection) => {
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'list', 'bullet');
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'image',
        pattern: /(?:!\[(.+?)\])(?:\((.+?)\))/g,
        action: (text, selection, pattern) => {
          const startIndex = text.search(pattern);
          const matchedText = text.match(pattern)[0];
          // const hrefText = text.match(/(?:!\[(.*?)\])/g)[0]
          const hrefLink = text.match(/(?:\((.*?)\))/g)[0];
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.quill.deleteText(start, matchedText.length);
              this.quill.insertEmbed(start, 'image', hrefLink.slice(1, hrefLink.length - 1));
            }, 0);
          }
        },
      },
      {
        name: 'link',
        pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
        action: (text, selection, pattern) => {
          const startIndex = text.search(pattern);
          const matchedText = text.match(pattern)[0];
          const hrefText = text.match(/(?:\[(.*?)\])/g)[0];
          const hrefLink = text.match(/(?:\((.*?)\))/g)[0];
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.quill.deleteText(start, matchedText.length);
              this.quill.insertText(
                start,
                hrefText.slice(1, hrefText.length - 1),
                'link',
                hrefLink.slice(1, hrefLink.length - 1),
              );
            }, 0);
          }
        },
      },
    ];

    this.matches = elements.filter((element) => !this.ignoreElements.includes(element.name));

    // Handler that looks for insert deltas that match specific characters
    this.quill.on('text-change', (delta, oldContents, source) => {
      for (let i = 0; i < delta.ops.length; i++) {
        if (delta.ops[i].hasOwnProperty('insert')) {
          if (delta.ops[i].insert === ' ') {
            this.onSpace();
          } else if (delta.ops[i].insert === '\n') {
            this.onEnter();
          }
        } else if (delta.ops[i].hasOwnProperty('delete') && source === 'user') {
          this.onDelete();
        }
      }
    });
  }

  isValid(text, tagName) {
    return typeof text !== 'undefined' && text && this.ignoreTags.indexOf(tagName) === -1;
  }

  onSpace() {
    const selection = this.quill.getSelection();
    if (!selection) return;
    const [line, offset] = this.quill.getLine(selection.index);
    const text = line.domNode.textContent;
    const lineStart = selection.index - offset;
    if (this.isValid(text, line.domNode.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern);
        // 不要在代码块中使用markdown激活
        // 不在table中激活header、list、code、引用等
        // console.log('markdown matched:', match, matchedText, line.domNode.tagName, selection, this.quill.getFormat());
        const format = this.quill.getFormat() || {};
        const disableInTable = [
          'header',
          'blockquote',
          'code-block',
          'hr',
          'plus-ul',
          'asterisk-ul',
        ];
        if (matchedText && !format['code-block'] && !(format['table-cell-line'] && disableInTable.includes(match.name))) {
          // We need to replace only matched text not the whole line
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  }

  onEnter() {
    let selection = this.quill.getSelection();
    if (!selection) return;
    const [line, offset] = this.quill.getLine(selection.index);
    const text = line.domNode.textContent + ' ';
    const lineStart = selection.index - offset;
    selection.length = selection.index++;
    if (this.isValid(text, line.domNode.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern);
        // 不要在代码块中使用markdown激活
        // 不在table中激活header、list、code、引用等
        // console.log('markdown matched:', match, matchedText, line.domNode.tagName, selection, this.quill.getFormat());
        const format = this.quill.getFormat() || {};
        const disableInTable = [
          'header',
          'blockquote',
          'code-block',
          'hr',
          'plus-ul',
          'asterisk-ul',
        ];
        if (
          matchedText &&
          !format['code-block'] &&
          !(format['table-cell-line'] && disableInTable.includes(match.name))
        ) {
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  }

  onDelete() {
    const range = this.quill.getSelection();
    if (!range) {
      return;
    }
  }

  isLastBrElement(range) {
    const [block] = this.quill.scroll.descendant(Block, range.index);
    const isBrElement = block != null && block.domNode.firstChild instanceof HTMLBRElement;
    return isBrElement;
  }

  isEmptyLine(range) {
    const [line] = this.quill.getLine(range.index);
    const isEmpty = line.children.head.text.trim() === '';
    return isEmpty;
  }
}

export { MarkdownShortcuts as default };
