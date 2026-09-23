# Changelog

All notable changes to this project are documented here. Versions follow
[Semantic Versioning](https://semver.org/).

## 2.1.0 — 2026-09-23

### Added

- **Video embeds.** A `video` button in the toolbar opens a small dialog that
  takes a URL. Page URLs copied from the address bar are converted to embed
  URLs automatically for **YouTube** (including `youtu.be`, `/shorts/` and the
  `t=` start offset), **Vimeo** (including unlisted `?h=` links) and
  **Bilibili**; any other URL — an embed URL, a self-hosted player — is used
  as-is. Turn the button off with `modules.video = false`, or size the iframe
  with `modules.video = { width, height }`.

### Fixed

- **A saved video came back as a link.** Quill 2's own `video` format renders an
  `<iframe>` in the editor but its `html()` returns `<a href="…">…</a>`, so
  every embed silently degraded to a bare link the moment content was read
  through `getSemanticHTML()` — what you saw was not what you stored. The
  bundled `VideoBlot` overrides `html()` to emit the iframe, and leaves Quill's
  `create`, `formats`, `sanitize` and `value` alone. Reported by
  [@RTAndrew](https://github.com/RTAndrew) in
  [#19](https://github.com/ludejun/quill-react-commercial/issues/19).
- **The same `html()` interpolated the URL unescaped**, so a video URL
  containing `">` put arbitrary markup — a `<script>` tag, for instance — into
  the saved HTML. Attribute values are now escaped. A test covers it.

## 2.0.0 — 2026-09-23

### Breaking

- **`exports` now defines the package surface.** Only the package root and
  `quill-react-commercial/lib/index.css` are reachable. Deep imports into other
  paths — none of which were ever documented — no longer resolve.
- **The tarball ships `lib/` only.** `src`, `dist`, `example/` and the build
  configs are gone, which takes the published package from 9.4 MB / 98 files to
  ~151 kB / 74 files. Anything that imported from those paths breaks.
- **Runtime dependencies are external in the ESM build.** `quill`,
  `quill-delta`, `highlight.js` and `normalize-url` are resolved by the consumer
  instead of being bundled in, so a project that already uses Quill now gets one
  copy rather than two. Assets taken from inside those packages (Quill's toolbar
  icons and stylesheet) are still inlined.
- **Node >= 18** is declared in `engines`.

### Fixed

- `onSave` never fired. The editor called `keyboardBindsFn({ save: onSave })` while that function
  reads `options.onSave`, so <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>S</kbd> was silently a no-op.
- Rendering with the table and code-highlight modules turned off threw
  `Cannot convert undefined or null to object`. Disabled controls were left in the toolbar config as
  `undefined`, and Quill 2 calls `Object.keys()` on every entry.
- `htmlDecode` used `innerText`, which collapses runs of whitespace and so destroyed the indentation
  of decoded code blocks. It now uses `textContent`.

### Changed

- The published tarball dropped from 9.4 MB / 98 files to ~151 kB / 74 files: `files` now limits it
  to `lib`, the READMEs, the changelog and the licence.
- `types` and `exports` are declared in `package.json`, and real `.d.ts` files are emitted from
  `tsconfig.build.json`. Previously `tsc` ran with both `noEmit` and `declaration` set.
- Runtime dependencies (`quill`, `quill-delta`, `highlight.js`, `normalize-url`) stay external in
  the ESM bundle, so consumers get one copy rather than a bundled duplicate. Assets pulled out of
  those packages are still inlined.
- Toolchain: TypeScript 3.9 → 5.9, Rollup 3 → 4, Babel 7 → 8. TypeScript 3.9 could not parse the
  type definitions Quill 2 ships, which is why the bugs above went unnoticed.
- The project now uses pnpm; `package-lock.json` and `yarn.lock` were removed.
- `lib/` and `dist/` are no longer tracked in git — they are rebuilt by `prepublishOnly`.

### Added

- ESLint 9 flat config (typescript-eslint, react, react-hooks) and Prettier.
- Vitest and Testing Library, with 40 tests covering the utilities, the i18n tables, the keyboard
  bindings and the mounted editor — including regressions for the two bugs above.
- `CONTRIBUTING.md`, in English and Chinese.

## 1.6.3

- Add Spanish (`es`) translations to the i18n tables.

## 1.6.2

- Add a LICENSE file, matching Quill's.
- Accept WebP when uploading images.
- Fix an error thrown when `divider` was removed from `toolbarOptions`.
- Add theme support: `bubble` and `snow`.

## 1.6.1

- Clicking the highlighted code icon now clears the code format.
- Fix ordered lists and blockquotes that could not be deleted once they contained text.

## 1.6.0

- Upgrade Quill to 2.0.2.
- Add a custom divider format with several built-in styles, persisted to the Delta and re-rendered
  correctly.

## 1.5.9

- Add a save-shortcut callback.
- Upgrade Quill to 2.0.1.

## 1.5.8

- Change how `quill.snow.css` is imported.
- Upgrade to quill@2.0.0-rc.5.

## 1.5.5 / 1.5.6 / 1.5.7

- Emit ES modules from the build.
- Rework the Rollup config to fix the breakage introduced by the Quill upgrade.

## 1.5.4

- Switch the default shell highlighting from `shell` to `bash`.
- Upgrade Quill from 2.0.0-dev.4 to 2.0.0-rc.4.
- Vendor `quill.snow.css` locally: importing it from `quill/dist/` never bundled reliably.
- Move CSS out of the JS bundle.

## 1.5.3

- Fix `readOnly` having no effect.

## 1.5.2

- Rewrite `ListItem` so an ordered list can start at any number and that number survives in the Delta.
- Fix the link tooltip not showing the text and URL.
- Narrow the "system font" picker.
- Insert a trailing empty line after a code block so typing can continue below it.
- Move where the default modules are registered.

## 1.5.1

- Fix indentation having no effect.
- Adjust ordered-list styling.

## 1.5.0

- Add English/Chinese internationalisation, including the table configuration.
- Replace the table operation icons with Ant Design SVGs.
- Overhaul the styling and settle on a primary colour.
- Rebuild code blocks: copy support and line numbers.
- Upgrade the link, table and image toolbar handlers.
- Align local image upload with paste/drop: show the Base64 preview first, then upload.
- Switch the paste/drop tooltip to a pseudo-element instead of an overlaid div keyed by id. The
  trade-off is slightly less precise positioning.
- Fix a selected (clicked) image not being removable with Delete, in `imageResize.checkImage`.
- Rebuild the link tooltip styling and add "go to" and "remove" actions.
- Extract a shared helper for icon tooltips.
- Fix the placeholder not disappearing while typing with an IME such as Pinyin.
- Rework both READMEs.

## 1.4.2

- Increase the top padding of the content area so a table on the first line does not hide its resize
  bar, and shrink that bar.
- Move the image-deletion part of the markdown `onDelete` handling into `imagePasteDrop.js`.
- Tidy up the dev dependencies.
- Rework how the link tooltip is positioned, fixing it not appearing when the cursor sits at the very
  start of a link.
- Remove the title.
- Styling adjustments.
- Fix stale content staying on screen when `content` was set to empty.

## 1.4.1

- Fix the styling regressions from 1.4.0.

## 1.4.0

- Persist and restore image alignment in the Delta.
- The link tooltip falls back to the URL when no text is entered, and normalises the URL.
- Fix being unable to remove formatting with Backspace when the document starts with a code block,
  list or blockquote.
- Fix repeated inserts when adding local images several times: the listener was re-registered on
  every insert.
- Fix inserting a table with a custom size producing a single-cell table.
- Drop the `quill-magic-url` dependency.

## 1.3.9

- Make the title both controlled and uncontrolled: `value` and `defaultValue`.

## 1.3.7 / 1.3.8

- Build with Rollup instead of tsc/webpack, which makes the SVG handling simpler and the npm package
  friendlier.
- Drop the webpack SVG workaround from the README.

## 1.3.6

- Add `onFocus` and `onBlur` to the title input.

## 1.3.5

- Add a title prop, modelled on Evernote's built-in title.

## 1.3.4

- Fix the malformed DOM added in 1.3.3.

## 1.3.3

- Add the `onFocus` and `onBlur` props.

## 1.3.2

- Fix images pasted or dragged in re-uploading in a loop after a failed upload.
- First pass at keeping the failure tooltip aligned when the page scrolls.
- Give the Base64 blobs produced by paste/drop a default filename and type.

## 1.3.1

- Rebuild the paste/drop module around a different approach: show the Base64 preview immediately and
  upload in the background.
- Support API upload, with upload status, for pasted and dragged images.
- Adjust the close icon in the image upload modal.

## 1.3.0

- Add an upload modal that also accepts an image URL.
- Remove the `editor-change` listener, which was stealing focus from the link and image modals.
- Update `readme.md`.

## 1.2.9

- Disallow headers, lists, code blocks and blockquotes inside tables, and stop the list and markdown
  triggers from firing in a table cell.
- Extend the markdown triggers to delete block formats, and fix `hr` not working.
- Stop the markdown triggers from firing inside code blocks.
- Highlight `shell` using the `vim` rules: highlight.js's shell keywords are missing many everyday
  commands, because they are not part of standard shell
  ([highlightjs/highlight.js#630](https://github.com/highlightjs/highlight.js/issues/630#issuecomment-61978331)).

## 1.2.8

- Use the editor instance as the boundary instead of `document.body`.
- Styling adjustments.

## 1.2.7

- Upgrade `quill-magic-url` so URLs are recognised automatically.
- Adjust list styling and indentation.
- Default table column width is now 120.
- Adjust the `keyboard.bindings['list autofill'].prefix` trigger.
- Adjust the markdown regex that triggers a list.
- Add a "go to" action to the popup shown when clicking a URL.

## 1.2.6

- Add this changelog.
- Document the development workflow in the README.
- Shorten the heading labels to H1, H2, H3, H4, Body.

## 1.2.5

- Support lists inside tables, fixing ordered lists in one cell continuing the numbering from the
  previous cell.
- An ordered list now starts at the number you typed — typing "30. " no longer produces a list
  starting at 1.

## 1.2.4

- Add a CLI for the local `example/` demo.
- Exclude React from the UMD webpack build.
- Fix the "hooks can't be used" error when importing the dist file directly in a React project.

## 1.2.3

- Fix the code highlighting error after the move to function components: the highlight initialiser
  has to run first.
- Fix the `imageResize` overlay not disappearing with multiple editors on one page.
- Convert `utils` to TypeScript.
- Vendor `better-table` locally and patch it to allow lists inside tables.

## 1.2.2

- Fix image upload.

## 1.2.1

- Fix the export broken in 1.2.0.

## 1.2.0

Major release:

- Resolve every TypeScript error.
- Add UMD and TypeScript builds.
- Rebuild the component with hooks.
- Update the README.

## 1.1.2

- Build to `lib/` with tsc.

## 1.1.0

- Change `main` to point at the source rather than the build output.

## 1.0.9

- Improve the image upload function, add system fonts and headings.

## 1.0.8

- The image upload API now returns a Promise.

## 1.0.6 / 1.0.7

- Replace Base64 images with an upload API, covering how the API is passed in and how the response
  is handled.

## 1.0.5

- Fix broken styling when several editors share a page.

## 1.0.3 / 1.0.4

- Add initial value and `readOnly` props; fix custom `toolbarOptions`.

## 1.0.2

- Fix the `codeHighlight` config and update the API.

## 1.0.1

- Add a user-defined toolbar, update the README, publish.

## 1.0.0

- A Quill rich text editor, usable as a UMD bundle.
