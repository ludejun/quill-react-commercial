import Quill from 'quill';

/**
 * Quill 2 ships its own type definitions, and they are stricter than its
 * runtime contract in two places that this package relies on:
 *
 *  - `Quill.import()` is declared as returning `unknown`, so every imported
 *    blot/attributor has to be narrowed at the call site.
 *  - `Quill.register()` only accepts values that structurally match
 *    `BlotConstructor`. Custom formats built by extending an imported blot
 *    lose that shape (the base class is `unknown`), so they are rejected even
 *    though Quill accepts them at runtime.
 *
 * Keeping the casts in this one module means the rest of the source can stay
 * free of `any` and the assumptions are documented in a single place.
 */

/** A Quill attributor/blot class with the mutable `whitelist` Quill reads. */
export interface WhitelistedAttributor {
  whitelist: string[] | null;
}

/** The subset of Quill's toolbar module this package touches. */
export interface ToolbarModule {
  container: HTMLElement | null;
  addHandler: (format: string, handler: (value: unknown) => void) => void;
}

/** The subset of the bundled imageResize module this package touches. */
export interface ImageResizeModule {
  hide: () => void;
}

/** Mutable map of toolbar icons, keyed by format name. */
export type QuillIcons = Record<string, string>;

/** `Quill.import`, narrowed to the type the caller expects. */
export function quillImport<T>(path: string): T {
  return Quill.import(path) as T;
}

/**
 * `Quill.register`, accepting the custom formats whose base class came back
 * from `Quill.import` as `unknown`. See the module comment above.
 */
export function quillRegister(target: unknown, overwrite = true): void {
  Quill.register(target as Parameters<typeof Quill.register>[0], overwrite);
}

/** `quill.getModule`, narrowed to the module interface the caller expects. */
export function quillModule<T>(quill: Quill, name: string): T {
  return quill.getModule(name) as T;
}

/** `quill.getModule` for modules that may not be registered. */
export function optionalQuillModule<T>(quill: Quill, name: string): T | undefined {
  return quill.getModule(name) as T | undefined;
}

/**
 * Quill invokes keyboard binding handlers with `this` bound to the Keyboard
 * module, which exposes the editor instance. TypeScript cannot infer that from
 * the object literal, so handlers declare it via a `this` parameter.
 */
export interface KeyboardBindingThis {
  quill: Quill;
}

/** The binding context Quill passes as the second handler argument. */
export interface KeyboardContext {
  prefix: string;
  suffix: string;
  offset: number;
  format: Record<string, unknown>;
  empty?: boolean;
  collapsed?: boolean;
  line?: {
    parent?: { domNode?: HTMLElement };
    domNode?: HTMLElement;
  };
  event?: KeyboardEvent;
}
