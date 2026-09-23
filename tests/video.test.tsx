import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import type Quill from 'quill';
import RichTextEditor from '../index';
import { toEmbedUrl } from '../utils';

async function mountEditor(props: Partial<Parameters<typeof RichTextEditor>[0]> = {}) {
  let quill: Quill | undefined;
  const utils = render(<RichTextEditor {...props} getQuill={(instance) => (quill = instance)} />);
  await waitFor(() => expect(quill).toBeDefined());
  return { ...utils, quill: quill as Quill };
}

const YOUTUBE_EMBED = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

describe('video embedding', () => {
  // The bug from https://github.com/ludejun/quill-react-commercial/issues/19:
  // Quill 2's own Video.html() returns `<a href="…">…</a>`, so a video that
  // renders as an iframe degrades to a link the moment content is saved.
  it('keeps a video as an iframe in getSemanticHTML(), not an anchor', async () => {
    const { quill } = await mountEditor();
    quill.insertEmbed(0, 'video', YOUTUBE_EMBED);

    const html = quill.getSemanticHTML();
    expect(html).toContain('<iframe');
    expect(html).toContain(YOUTUBE_EMBED);
    expect(html).not.toContain(`<a href="${YOUTUBE_EMBED}"`);
  });

  it('renders the video as an iframe in the editor too', async () => {
    const { quill } = await mountEditor();
    quill.insertEmbed(0, 'video', YOUTUBE_EMBED);

    const iframe = quill.root.querySelector('iframe.ql-video');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toBe(YOUTUBE_EMBED);
    expect(iframe?.getAttribute('allowfullscreen')).toBe('true');
  });

  it('survives a save/restore round trip through HTML', async () => {
    const { quill } = await mountEditor();
    quill.insertEmbed(0, 'video', YOUTUBE_EMBED);
    const saved = quill.getSemanticHTML();

    const { quill: second } = await mountEditor();
    second.clipboard.dangerouslyPasteHTML(saved);
    expect(second.root.querySelector('iframe.ql-video')?.getAttribute('src')).toBe(YOUTUBE_EMBED);
  });

  it('escapes the src so it cannot break out of the attribute', async () => {
    const { quill } = await mountEditor();
    quill.insertEmbed(0, 'video', 'https://example.com/a"><script>alert(1)</script>');

    const html = quill.getSemanticHTML();
    expect(html).not.toContain('<script>');
  });

  it('puts a video button in the toolbar, and honours modules.video === false', async () => {
    const { container } = await mountEditor();
    expect(container.querySelector('button.ql-video')).not.toBeNull();

    const off = await mountEditor({ modules: { video: false } });
    expect(off.container.querySelector('button.ql-video')).toBeNull();
  });
});

describe('toEmbedUrl', () => {
  it('converts YouTube watch urls', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(YOUTUBE_EMBED);
    expect(toEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(YOUTUBE_EMBED);
    expect(toEmbedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(YOUTUBE_EMBED);
    expect(toEmbedUrl('youtube.com/watch?v=dQw4w9WgXcQ')).toBe(YOUTUBE_EMBED);
  });

  it('keeps the start time', () => {
    expect(toEmbedUrl('https://youtu.be/dQw4w9WgXcQ?t=90')).toBe(`${YOUTUBE_EMBED}?start=90`);
    expect(toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m30s')).toBe(
      `${YOUTUBE_EMBED}?start=90`,
    );
  });

  it('converts Vimeo urls, including unlisted ones', () => {
    expect(toEmbedUrl('https://vimeo.com/123456789')).toBe(
      'https://player.vimeo.com/video/123456789',
    );
    expect(toEmbedUrl('https://vimeo.com/123456789/abc123')).toBe(
      'https://player.vimeo.com/video/123456789?h=abc123',
    );
  });

  it('converts Bilibili urls', () => {
    expect(toEmbedUrl('https://www.bilibili.com/video/BV1GJ411x7h7')).toBe(
      'https://player.bilibili.com/player.html?bvid=BV1GJ411x7h7',
    );
    expect(toEmbedUrl('https://www.bilibili.com/video/BV1GJ411x7h7?p=3')).toBe(
      'https://player.bilibili.com/player.html?bvid=BV1GJ411x7h7&p=3',
    );
  });

  it('leaves urls it does not recognise alone', () => {
    expect(toEmbedUrl(YOUTUBE_EMBED)).toBe(YOUTUBE_EMBED);
    expect(toEmbedUrl('https://cdn.example.com/player?id=7')).toBe(
      'https://cdn.example.com/player?id=7',
    );
    expect(toEmbedUrl('not a url')).toBe('not a url');
    expect(toEmbedUrl('')).toBe('');
  });
});
