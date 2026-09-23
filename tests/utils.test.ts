import { describe, expect, it, vi } from 'vitest';
import { htmlDecode, isColor, isEmail, isUrl, throttle } from '../utils';

describe('isUrl', () => {
  it('accepts urls with and without a protocol', () => {
    expect(isUrl('https://github.com/ludejun/quill-react-commercial')).toBe(true);
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('example.com')).toBe(true);
    expect(isUrl('www.example.com/a/b?c=1#d')).toBe(true);
    expect(isUrl('ftp://files.example.com')).toBe(true);
  });

  it('rejects strings that are not urls', () => {
    expect(isUrl('')).toBe(false);
    expect(isUrl('not a url')).toBe(false);
    expect(isUrl('example')).toBe(false);
  });
});

describe('isEmail', () => {
  it('accepts an address with a domain', () => {
    expect(isEmail('ludejun@live.cn')).toBe(true);
  });

  it('rejects incomplete addresses', () => {
    expect(isEmail('ludejun@live')).toBe(false);
    expect(isEmail('ludejun')).toBe(false);
    expect(isEmail('@live.cn')).toBe(false);
  });
});

describe('isColor', () => {
  it('accepts three- and six-digit hex', () => {
    expect(isColor('#fff')).toBe(true);
    expect(isColor('#1A2b3C')).toBe(true);
  });

  it('accepts rgb and rgba', () => {
    expect(isColor('rgb(0, 0, 0)')).toBe(true);
    expect(isColor('rgba(12, 34, 56, 0.5)')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isColor('red')).toBe(false);
    expect(isColor('#12345')).toBe(false);
    expect(isColor('')).toBe(false);
  });
});

describe('htmlDecode', () => {
  it('turns entities back into their characters', () => {
    expect(htmlDecode('&lt;b&gt;bold&lt;/b&gt;')).toBe('<b>bold</b>');
  });

  it('strips markup, returning only the rendered text', () => {
    expect(htmlDecode('<b>bold</b>')).toBe('bold');
  });
});

describe('throttle', () => {
  it('runs once per window no matter how often it is called', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();
    expect(fn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
