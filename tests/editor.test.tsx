import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import type Quill from 'quill';
import RichTextEditor from '../index';

/** Mounts the editor and resolves once Quill has handed back its instance. */
async function mountEditor(props: Partial<Parameters<typeof RichTextEditor>[0]> = {}) {
  let quill: Quill | undefined;
  const utils = render(
    <RichTextEditor
      {...props}
      getQuill={(instance) => {
        quill = instance;
        props.getQuill?.(instance);
      }}
    />,
  );
  await waitFor(() => expect(quill).toBeDefined());
  return { ...utils, quill: quill as Quill };
}

describe('<RichTextEditor />', () => {
  it('mounts a Quill instance and exposes it through getQuill', async () => {
    const { quill } = await mountEditor();
    expect(quill.root).toBeInstanceOf(HTMLElement);
    expect(quill.root.classList.contains('ql-editor')).toBe(true);
  });

  it('renders a toolbar above the editing surface', async () => {
    const { container } = await mountEditor();
    expect(container.querySelector('.ql-toolbar')).toBeInTheDocument();
    expect(container.querySelector('.ql-editor')).toBeInTheDocument();
  });

  it('gives each instance its own container id, so two can coexist', async () => {
    const first = await mountEditor();
    const second = await mountEditor();
    const id = (view: { container: HTMLElement }) =>
      view.container.querySelector('[id^="editor"]')?.id;
    expect(id(first)).toBeTruthy();
    expect(id(first)).not.toBe(id(second));
  });

  it('applies the placeholder it was given', async () => {
    const { quill } = await mountEditor({ placeholder: 'Write something' });
    expect(quill.root.getAttribute('data-placeholder')).toBe('Write something');
  });

  it('loads string content as HTML', async () => {
    const { quill } = await mountEditor({ content: '<p>hello</p>' });
    await waitFor(() => expect(quill.getText()).toContain('hello'));
  });

  it('starts disabled when readOnly is set', async () => {
    const { quill } = await mountEditor({ readOnly: true });
    await waitFor(() => expect(quill.isEnabled()).toBe(false));
  });

  it('reports user edits through onChange but stays quiet for api writes', async () => {
    const onChange = vi.fn();
    const { quill } = await mountEditor({ onChange });

    quill.insertText(0, 'typed', 'user');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

    quill.insertText(0, 'programmatic', 'api');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // Regression: disabled controls used to be left in the toolbar config as
  // `undefined`, and Quill 2 throws "Cannot convert undefined or null to
  // object" on them — so the editor could not render without table + code.
  it('renders with every optional module turned off', async () => {
    const { container, quill } = await mountEditor({
      modules: { table: false, codeHighlight: false, link: false },
    });
    expect(quill.root).toBeInstanceOf(HTMLElement);
    expect(container.querySelector('.ql-table')).toBeNull();
    expect(container.querySelector('.ql-code-block')).toBeNull();
    expect(container.querySelector('.ql-link')).toBeNull();
  });

  it('renders with every optional module turned on', async () => {
    const { container } = await mountEditor({
      modules: { table: true, codeHighlight: true, link: true, markdown: true },
    });
    expect(container.querySelector('.ql-table')).toBeInTheDocument();
    expect(container.querySelector('.ql-code-block')).toBeInTheDocument();
  });

  it('translates the toolbar into the requested locale', async () => {
    const { container } = await mountEditor({ i18n: 'zh' });
    const label = container.querySelector('.ql-picker.ql-header .ql-picker-label');
    await waitFor(() => expect(label?.getAttribute('data-before')).toBeTruthy());
  });
});
