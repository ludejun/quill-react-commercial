import '@testing-library/jest-dom/vitest';

// Quill reads getBoundingClientRect while laying the editor out, and jsdom
// returns an all-zero rect that makes its selection code divide by zero.
if (!Element.prototype.getClientRects.length) {
  Element.prototype.getClientRects = function getClientRects() {
    return Object.assign([], { item: () => null }) as unknown as DOMRectList;
  };
}

// jsdom implements neither of these, and Quill's clipboard/table modules call
// them during setup.
document.execCommand ??= () => false;
if (!window.getSelection) {
  window.getSelection = () => null;
}
