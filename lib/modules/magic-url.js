'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var Delta = require('../node_modules/quill-delta/dist/Delta.js');
var index = require('../node_modules/normalize-url/index.js');

var defaults = {
    globalRegularExpression: /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/gi,
    urlRegularExpression: /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/gi,
    globalMailRegularExpression: /([\w-\.]+@[\w-\.]+\.[\w-\.]+)/gi,
    mailRegularExpression: /([\w-\.]+@[\w-\.]+\.[\w-\.]+)/gi,
    normalizeRegularExpression: /(https?:\/\/|www\.)[\S]+/i,
    normalizeUrlOptions: {
        stripWWW: false,
    },
};
var MagicUrl = /** @class */ (function () {
    function MagicUrl(quill, options) {
        var _this = this;
        this.quill = quill;
        options = options || {};
        this.options = tslib_es6.__assign(tslib_es6.__assign({}, defaults), options);
        this.urlNormalizer = function (url) { return _this.normalize(url); };
        this.mailNormalizer = function (mail) { return "mailto:" + mail; };
        this.registerTypeListener();
        this.registerPasteListener();
        this.registerBlurListener();
    }
    MagicUrl.prototype.registerPasteListener = function () {
        var _this = this;
        // Preserves existing links
        this.quill.clipboard.addMatcher('A', function (node, delta) {
            var _a;
            var href = node.getAttribute('href');
            var attributes = (_a = delta.ops[0]) === null || _a === void 0 ? void 0 : _a.attributes;
            if ((attributes === null || attributes === void 0 ? void 0 : attributes.link) != null) {
                attributes.link = href;
            }
            return delta;
        });
        this.quill.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
            if (typeof node.data !== 'string') {
                return undefined;
            }
            var urlRegExp = _this.options.globalRegularExpression;
            var mailRegExp = _this.options.globalMailRegularExpression;
            urlRegExp.lastIndex = 0;
            mailRegExp.lastIndex = 0;
            var newDelta = new Delta.default();
            var index = 0;
            var urlResult = urlRegExp.exec(node.data);
            var mailResult = mailRegExp.exec(node.data);
            var handleMatch = function (result, regExp, normalizer) {
                var head = node.data.substring(index, result.index);
                newDelta.insert(head);
                var match = result[0];
                newDelta.insert(match, { link: normalizer(match) });
                index = regExp.lastIndex;
                return regExp.exec(node.data);
            };
            while (urlResult !== null || mailResult !== null) {
                if (urlResult === null) {
                    if (mailResult)
                        mailResult = handleMatch(mailResult, mailRegExp, _this.mailNormalizer);
                }
                else if (mailResult === null) {
                    urlResult = handleMatch(urlResult, urlRegExp, _this.urlNormalizer);
                }
                else if (mailResult.index <= urlResult.index) {
                    while (urlResult !== null && urlResult.index < mailRegExp.lastIndex) {
                        urlResult = urlRegExp.exec(node.data);
                    }
                    mailResult = handleMatch(mailResult, mailRegExp, _this.mailNormalizer);
                }
                else {
                    while (mailResult !== null && mailResult.index < urlRegExp.lastIndex) {
                        mailResult = mailRegExp.exec(node.data);
                    }
                    urlResult = handleMatch(urlResult, urlRegExp, _this.urlNormalizer);
                }
            }
            if (index > 0) {
                var tail = node.data.substring(index);
                newDelta.insert(tail);
                if (delta)
                    delta.ops = newDelta.ops;
            }
            return delta;
        });
    };
    MagicUrl.prototype.registerTypeListener = function () {
        var _this = this;
        this.quill.on('text-change', function (delta) {
            var ops = delta.ops;
            // Only return true, if last operation includes whitespace inserts
            // Equivalent to listening for enter, tab or space
            if (!ops || ops.length < 1 || ops.length > 2) {
                return;
            }
            var lastOp = ops[ops.length - 1];
            if (!lastOp.insert || typeof lastOp.insert !== 'string' || !lastOp.insert.match(/\s/)) {
                return;
            }
            _this.checkTextForUrl(!!lastOp.insert.match(/ |\t/));
        });
    };
    MagicUrl.prototype.registerBlurListener = function () {
        var _this = this;
        this.quill.root.addEventListener('blur', function () {
            _this.checkTextForUrl();
        });
    };
    MagicUrl.prototype.checkTextForUrl = function (triggeredByInlineWhitespace) {
        if (triggeredByInlineWhitespace === void 0) { triggeredByInlineWhitespace = false; }
        var sel = this.quill.getSelection();
        if (!sel) {
            return;
        }
        var leaf = this.quill.getLeaf(sel.index)[0];
        var leafIndex = this.quill.getIndex(leaf);
        if (!leaf.text) {
            return;
        }
        // We only care about the leaf until the current cursor position
        var relevantLength = sel.index - leafIndex;
        var text = leaf.text.slice(0, relevantLength);
        if (!text || leaf.parent.domNode.localName === 'a') {
            return;
        }
        var nextLetter = leaf.text[relevantLength];
        // Do not proceed if we are in the middle of a word
        if (nextLetter != null && nextLetter.match(/\S/)) {
            return;
        }
        var bailOutEndingRegex = triggeredByInlineWhitespace ? /\s\s$/ : /\s$/;
        if (text.match(bailOutEndingRegex)) {
            return;
        }
        var urlMatches = text.match(this.options.urlRegularExpression);
        var mailMatches = text.match(this.options.mailRegularExpression);
        if (urlMatches) {
            this.handleMatches(leafIndex, text, urlMatches, this.urlNormalizer);
        }
        else if (mailMatches) {
            this.handleMatches(leafIndex, text, mailMatches, this.mailNormalizer);
        }
    };
    MagicUrl.prototype.handleMatches = function (leafIndex, text, matches, normalizer) {
        var match = matches.pop();
        if (match) {
            var matchIndex = text.lastIndexOf(match);
            var after = text.split(match).pop();
            if (after && after.match(/\S/)) {
                return;
            }
            this.updateText(leafIndex + matchIndex, match.trim(), normalizer);
        }
    };
    MagicUrl.prototype.updateText = function (index, string, normalizer) {
        var ops = new Delta.default().retain(index).retain(string.length, { link: normalizer(string) });
        this.quill.updateContents(ops);
    };
    MagicUrl.prototype.normalize = function (url) {
        if (this.options.normalizeRegularExpression.test(url)) {
            try {
                return index.default(url, this.options.normalizeUrlOptions);
            }
            catch (error) {
                console.error(error);
            }
        }
        return url;
    };
    return MagicUrl;
}());

exports.MagicUrl = MagicUrl;
