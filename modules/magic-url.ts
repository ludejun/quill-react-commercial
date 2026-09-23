// Fork and Edit from 'quill-magic-url'
import Delta from 'quill-delta';
import normalizeUrl, { Options as NormalizeUrlOptions } from 'normalize-url';
import Quill from 'quill';

declare global {
  interface Window {
    Quill?: typeof Quill;
  }
}

export type MagicUrlOptions = {
  globalRegularExpression: RegExp;
  urlRegularExpression: RegExp;
  globalMailRegularExpression: RegExp;
  mailRegularExpression: RegExp;
  normalizeRegularExpression: RegExp;
  normalizeUrlOptions: NormalizeUrlOptions;
};

export type Normalizer = (stringToNormalize: string) => string;

/**
 * `quill.getLeaf()` is typed as returning a `LeafBlot`, but only text leaves
 * expose the `text` and `parent.domNode` this module reads.
 */
interface TextLeaf {
  text?: string;
  parent?: { domNode?: HTMLElement };
}

const defaults = {
  globalRegularExpression: /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/gi,
  urlRegularExpression: /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/gi,
  globalMailRegularExpression: /([\w-\.]+@[\w-\.]+\.[\w-\.]+)/gi,
  mailRegularExpression: /([\w-\.]+@[\w-\.]+\.[\w-\.]+)/gi,
  normalizeRegularExpression: /(https?:\/\/|www\.)[\S]+/i,
  normalizeUrlOptions: {
    stripWWW: false,
  },
};

export class MagicUrl {
  quill: Quill;
  options: MagicUrlOptions;
  urlNormalizer: Normalizer;
  mailNormalizer: Normalizer;

  constructor(quill: Quill, options?: Partial<MagicUrlOptions>) {
    this.quill = quill;
    options = options || {};
    this.options = { ...defaults, ...options };
    this.urlNormalizer = (url) => this.normalize(url);
    this.mailNormalizer = (mail) => `mailto:${mail}`;
    this.registerTypeListener();
    this.registerPasteListener();
    this.registerBlurListener();
  }
  registerPasteListener() {
    // Preserves existing links
    this.quill.clipboard.addMatcher('A', (node, delta) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return delta;
      const href = (node as Element).getAttribute('href');
      const attributes = delta.ops[0]?.attributes;
      if (attributes?.link != null) {
        attributes.link = href;
      }
      return delta;
    });
    this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta): Delta => {
      const textNode = node as Text;
      if (typeof textNode.data !== 'string') {
        return undefined as unknown as Delta;
      }
      const urlRegExp = this.options.globalRegularExpression;
      const mailRegExp = this.options.globalMailRegularExpression;
      urlRegExp.lastIndex = 0;
      mailRegExp.lastIndex = 0;
      const newDelta = new Delta();
      let index = 0;
      let urlResult = urlRegExp.exec(textNode.data);
      let mailResult = mailRegExp.exec(textNode.data);
      const handleMatch = (result: RegExpExecArray, regExp: RegExp, normalizer: Normalizer) => {
        const head = textNode.data.substring(index, result.index);
        newDelta.insert(head);
        const match = result[0];
        newDelta.insert(match, { link: normalizer(match) });
        index = regExp.lastIndex;
        return regExp.exec(textNode.data);
      };
      while (urlResult !== null || mailResult !== null) {
        if (urlResult === null) {
          if (mailResult) mailResult = handleMatch(mailResult, mailRegExp, this.mailNormalizer);
        } else if (mailResult === null) {
          urlResult = handleMatch(urlResult, urlRegExp, this.urlNormalizer);
        } else if (mailResult.index <= urlResult.index) {
          while (urlResult !== null && urlResult.index < mailRegExp.lastIndex) {
            urlResult = urlRegExp.exec(textNode.data);
          }
          mailResult = handleMatch(mailResult, mailRegExp, this.mailNormalizer);
        } else {
          while (mailResult !== null && mailResult.index < urlRegExp.lastIndex) {
            mailResult = mailRegExp.exec(textNode.data);
          }
          urlResult = handleMatch(urlResult, urlRegExp, this.urlNormalizer);
        }
      }
      if (index > 0) {
        const tail = textNode.data.substring(index);
        newDelta.insert(tail);
        if (delta) delta!.ops = newDelta.ops;
      }
      return delta;
    });
  }
  registerTypeListener() {
    this.quill.on('text-change', (delta) => {
      const ops = delta.ops;
      // Only return true, if last operation includes whitespace inserts
      // Equivalent to listening for enter, tab or space
      if (!ops || ops.length < 1 || ops.length > 2) {
        return;
      }
      const lastOp = ops[ops.length - 1];
      if (!lastOp.insert || typeof lastOp.insert !== 'string' || !lastOp.insert.match(/\s/)) {
        return;
      }
      this.checkTextForUrl(!!lastOp.insert.match(/ |\t/));
    });
  }
  registerBlurListener() {
    this.quill.root.addEventListener('blur', () => {
      this.checkTextForUrl();
    });
  }
  checkTextForUrl(triggeredByInlineWhitespace = false) {
    const sel = this.quill.getSelection();
    if (!sel) {
      return;
    }
    const [rawLeaf] = this.quill.getLeaf(sel.index);
    if (!rawLeaf) {
      return;
    }
    // Only text leaves carry `text`; embeds (images, dividers) do not.
    const leaf = rawLeaf as unknown as TextLeaf;
    if (!leaf.text) {
      return;
    }
    const leafIndex = this.quill.getIndex(rawLeaf);

    // We only care about the leaf until the current cursor position
    const relevantLength = sel.index - leafIndex;
    const text: string = leaf.text.slice(0, relevantLength);
    if (!text || leaf.parent?.domNode?.localName === 'a') {
      return;
    }

    const nextLetter = leaf.text[relevantLength];
    // Do not proceed if we are in the middle of a word
    if (nextLetter != null && nextLetter.match(/\S/)) {
      return;
    }

    const bailOutEndingRegex = triggeredByInlineWhitespace ? /\s\s$/ : /\s$/;
    if (text.match(bailOutEndingRegex)) {
      return;
    }

    const urlMatches = text.match(this.options.urlRegularExpression);
    const mailMatches = text.match(this.options.mailRegularExpression);
    if (urlMatches) {
      this.handleMatches(leafIndex, text, urlMatches, this.urlNormalizer);
    } else if (mailMatches) {
      this.handleMatches(leafIndex, text, mailMatches, this.mailNormalizer);
    }
  }
  handleMatches(
    leafIndex: number,
    text: string,
    matches: RegExpMatchArray,
    normalizer: Normalizer,
  ) {
    const match = matches.pop();
    if (match) {
      const matchIndex = text.lastIndexOf(match);
      const after = text.split(match).pop();
      if (after && after.match(/\S/)) {
        return;
      }
      this.updateText(leafIndex + matchIndex, match.trim(), normalizer);
    }
  }
  updateText(index: number, string: string, normalizer: Normalizer) {
    const ops = new Delta().retain(index).retain(string.length, { link: normalizer(string) });
    this.quill.updateContents(ops);
  }
  normalize(url: string) {
    if (this.options.normalizeRegularExpression.test(url)) {
      try {
        return normalizeUrl(url, this.options.normalizeUrlOptions);
      } catch (error) {
        console.error(error);
      }
    }
    return url;
  }
}
