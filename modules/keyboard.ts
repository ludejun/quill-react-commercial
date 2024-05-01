import { Range } from 'quill';

export const keyboardBindsFn = (options) => {
  const { onSave } = options;
  return {
    // 有序列表只能输入“1. ”才会触发，改变比如输入“30. ”会变为“1. ”开始的有序列表的行为
    'list autofill': {
      key: ' ',
      collapsed: true,
      prefix: /^\d+\.$/,
      format: {
        list: false,
        'code-block': false,
        blockquote: false,
        header: false,
        table: false,
        'table-cell-line': false, // 在table中不触发有序列表
      },
      handler(range: Range, context) {
        const { prefix, line } = context;

        const start = parseInt(prefix.replace('.', ''), 10);
        if (start !== 1) {
          this.quill.formatLine(range.index, 1, 'list', `ordered-${start}`);

          // // 这个ol在编辑器中本身没啥作用，编辑器css已经将ol的样式设置为none，主要样式在li的伪类中定义；主要给转html等富文本使用
          // const ol = line?.next?.parent?.domNode;
          // ol.setAttribute('start', start);
          // ol.style.setProperty('--list-item-start', start);
          // // 真正设置有序列表起始值
          // const li = line?.next?.domNode;
          // li.dataset.reset = parseInt(prefix.replace('.', ''), 10);
          // li.style.setProperty('counter-set', `list-0 ${parseInt(prefix.replace('.', ''), 10)}`);

          this.quill.formatLine(range.index, 1, 'list', `ordered-${start}`);
        } else {
          this.quill.formatLine(range.index, 1, 'list', 'ordered');
          this.quill.formatLine(range.index, 1, 'list', 'ordered');
        }

        this.quill.deleteText(range.index - prefix.length, prefix.length);
        // this.quill.setSelection(range.index, 1);
      },
    },
    // bugfix: 当最开始是code块、list、引用块时，无法使用Backspace删除样式
    'code backspace': {
      key: 'Backspace',
      format: ['code-block', 'list', 'blockquote'],
      handler(
        range: Range,
        context: {
          line: { parent: { cachedText?: string } };
          suffix: string;
          prefix: string;
          offset: number;
        },
      ) {
        if (this.quill) {
          const [line] = this.quill.getLine(range.index);
          const isEmpty = !line.children.head.text || line.children.head.text.trim() === '';
          const format = this.quill.getFormat(range);
          const allCode = context?.line?.parent?.cachedText;
          // 当是起始，代码块且整块中已无字符，或引用/列表且当前行为空，去除当前行格式；其他情况执行默认Backspace的handler
          if (
            range.index === 0 &&
            context.suffix === '' &&
            ((format['code-block'] && (allCode === '\n' || allCode === '')) ||
              (!format['code-block'] && isEmpty))
          ) {
            this.quill.removeFormat(range.index, range.length);
            return false;
          }
        }

        return true;
      },
    },
    save: {
      key: 's',
      shortKey: true,
      handler(range: Range, context) {
        console.log('keyboard save!');
        if (onSave) {
          onSave();
          return false;
        }
        return true;
      },
    },
  };
};
