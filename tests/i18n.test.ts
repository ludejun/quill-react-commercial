import { describe, expect, it } from 'vitest';
import { getI18nText, i18nConfig } from '../i18n';

const locales = Object.keys(i18nConfig) as (keyof typeof i18nConfig)[];

describe('i18nConfig', () => {
  it('ships the three supported locales', () => {
    expect(locales.sort()).toEqual(['en', 'es', 'zh']);
  });

  it.each(locales)('%s defines every key English defines', (locale) => {
    expect(Object.keys(i18nConfig[locale]).sort()).toEqual(Object.keys(i18nConfig.en).sort());
  });

  it.each(locales)('%s leaves no value empty', (locale) => {
    const empty = Object.entries(i18nConfig[locale])
      .filter(([, value]) => typeof value !== 'string' || value.trim() === '')
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });
});

describe('getI18nText', () => {
  it('defaults to English', () => {
    expect(getI18nText('linkSave')).toBe(i18nConfig.en.linkSave);
  });

  it('reads the requested locale', () => {
    expect(getI18nText('linkSave', 'zh')).toBe(i18nConfig.zh.linkSave);
    expect(getI18nText('linkSave', 'es')).toBe(i18nConfig.es.linkSave);
  });

  it('maps an array of keys, preserving order', () => {
    expect(getI18nText(['linkWords', 'linkUrl'], 'zh')).toEqual([
      i18nConfig.zh.linkWords,
      i18nConfig.zh.linkUrl,
    ]);
  });
});
