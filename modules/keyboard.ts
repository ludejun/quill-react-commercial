const keyboardBinds = {
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
    handler(range, context) {
      console.log(4444, range, context);
      const { prefix, line } = context;

      this.quill.formatLine(range.index, 1, 'list', 'ordered');

      // const ol = line?.next?.parent?.domNode;
      // ol.setAttribute('start', parseInt(prefix.replace('.', ''), 10));
      const li = line?.next?.domNode;
      li.dataset.reset = prefix.replace('.', '');

      this.quill.formatLine(range.index, 1, 'list', 'ordered');

      this.quill.deleteText(range.index - prefix.length, prefix.length);
      // this.quill.setSelection(range.index, 1);
    },
  },
  // bugfix: 当最开始是code块、list、引用块时，无法使用Backspace删除样式
  'code backspace': {
    key: 'Backspace',
    format: ['code-block', 'list', 'blockquote'],
    handler(
      range: RangeStatic,
      context: {
        line: { parent: { cachedText?: string } };
        suffix: string;
        prefix: string;
        offset: number;
      },
    ) {
      const quill = quillRef.current;
      if (quill) {
        const [line] = quill.getLine(range.index);
        const isEmpty = !line.children.head.text || line.children.head.text.trim() === '';
        const format = quill.getFormat(range);
        const allCode = context?.line?.parent?.cachedText;
        // 当是起始，代码块且整块中已无字符，或引用/列表且当前行为空，去除当前行格式；其他情况执行默认Backspace的handler
        if (
          range.index === 0 &&
          context.suffix === '' &&
          ((format['code-block'] && (allCode === '\n' || allCode === '')) ||
            (!format['code-block'] && isEmpty))
        ) {
          quill.removeFormat(range.index, range.length);
          return false;
        }
      }

      return true;
    },
  },
};
