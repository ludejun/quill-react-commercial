import { describe, expect, it, vi } from 'vitest';
import type Quill from 'quill';
import type { Range } from 'quill';
import { keyboardBindsFn } from '../modules/keyboard';
import type { KeyboardBindingThis, KeyboardContext } from '../quillTypes';

const range = (index = 0, length = 0): Range => ({ index, length });

const context = (over: Partial<KeyboardContext> = {}): KeyboardContext => ({
  prefix: '',
  suffix: '',
  offset: 0,
  format: {},
  ...over,
});

/** Stands in for the Keyboard module Quill binds handlers to. */
const bindingThis = (quill: Partial<Quill>): KeyboardBindingThis =>
  ({ quill }) as KeyboardBindingThis;

describe('keyboardBindsFn', () => {
  it('registers the bindings the editor wires up', () => {
    const bindings = keyboardBindsFn({});
    expect(Object.keys(bindings)).toEqual(['list autofill', 'code backspace', 'save']);
  });

  describe('save', () => {
    // Regression: the editor used to call keyboardBindsFn({ save: onSave })
    // while this function reads options.onSave, so the onSave prop never fired.
    it('invokes onSave and swallows the keystroke', () => {
      const onSave = vi.fn();
      const { save } = keyboardBindsFn({ onSave });

      const handled = save.handler.call(bindingThis({}), range(), context());

      expect(onSave).toHaveBeenCalledTimes(1);
      expect(handled).toBe(false);
    });

    it('lets the browser keep Ctrl+S when no handler was given', () => {
      const { save } = keyboardBindsFn({});
      expect(save.handler.call(bindingThis({}), range(), context())).toBe(true);
    });

    it('binds to the platform shortcut key', () => {
      const { save } = keyboardBindsFn({});
      expect(save.key).toBe('s');
      expect(save.shortKey).toBe(true);
    });
  });

  describe('list autofill', () => {
    it('starts an ordered list at the typed number', () => {
      const formatLine = vi.fn();
      const deleteText = vi.fn();
      const binding = keyboardBindsFn({})['list autofill'];

      binding.handler.call(
        bindingThis({ formatLine, deleteText } as Partial<Quill>),
        range(7),
        context({ prefix: '30.' }),
      );

      expect(formatLine).toHaveBeenCalledWith(7, 1, 'list', 'ordered-30');
      expect(deleteText).toHaveBeenCalledWith(4, 3);
    });

    it('uses a plain ordered list when the prefix is "1."', () => {
      const formatLine = vi.fn();
      const binding = keyboardBindsFn({})['list autofill'];

      binding.handler.call(
        bindingThis({ formatLine, deleteText: vi.fn() } as Partial<Quill>),
        range(2),
        context({ prefix: '1.' }),
      );

      expect(formatLine).toHaveBeenCalledWith(2, 1, 'list', 'ordered');
    });

    it('only fires on a bare number prefix', () => {
      const binding = keyboardBindsFn({})['list autofill'];
      expect(binding.prefix.test('30.')).toBe(true);
      expect(binding.prefix.test('a.')).toBe(false);
      expect(binding.prefix.test('30')).toBe(false);
    });
  });

  describe('code backspace', () => {
    const lineWith = (innerHTML: string) =>
      context({ line: { parent: { domNode: { innerHTML } as HTMLElement } } });

    it('drops list formatting when backspacing at the start of a line', () => {
      const removeFormat = vi.fn();
      const binding = keyboardBindsFn({})['code backspace'];

      const handled = binding.handler.call(
        bindingThis({ removeFormat, getFormat: () => ({ list: 'ordered' }) } as Partial<Quill>),
        range(4, 0),
        lineWith(''),
      );

      expect(removeFormat).toHaveBeenCalledWith(4, 0);
      expect(handled).toBe(false);
    });

    it('drops code-block formatting once the block is empty', () => {
      const removeFormat = vi.fn();
      const binding = keyboardBindsFn({})['code backspace'];

      const handled = binding.handler.call(
        bindingThis({
          removeFormat,
          getFormat: () => ({ 'code-block': 'plain' }),
        } as Partial<Quill>),
        range(0, 0),
        lineWith('\n'),
      );

      expect(removeFormat).toHaveBeenCalled();
      expect(handled).toBe(false);
    });

    it('falls through to Quill when the code block still has content', () => {
      const removeFormat = vi.fn();
      const binding = keyboardBindsFn({})['code backspace'];

      const handled = binding.handler.call(
        bindingThis({
          removeFormat,
          getFormat: () => ({ 'code-block': 'plain' }),
        } as Partial<Quill>),
        range(3, 0),
        lineWith('const a = 1;'),
      );

      expect(removeFormat).not.toHaveBeenCalled();
      expect(handled).toBe(true);
    });
  });
});
