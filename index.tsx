import React, { useRef, useEffect, CSSProperties, FC } from 'react';
import Quill, { Range, EmitterSource } from 'quill';
import Delta from 'quill-delta';
import { quillImport, quillRegister } from './quillTypes';
import type { QuillIcons, WhitelistedAttributor } from './quillTypes';
import {
  highlightInit,
  // Image,
  // ImageDrop,
  // ImageResize,
  // MagicUrl,
  QuillBetterTable,
  // MarkdownShortcuts,
  toolbarInit,
  // LinkHandler,
  undoHandler,
  redoHandler,
  // TableHandler,
  // ImageHandler,
  // QSyntax,
  // ListItem,
  // CodeHandler,
  keyboardBindsFn,
} from './modules/index';
import { optionDisableToggle, setContent, throttle } from './utils';
import { getI18nText, i18nConfig } from './i18n';
import IconUndo from 'quill/assets/icons/undo.svg';
import IconRedo from 'quill/assets/icons/redo.svg';
import IconDivider from './assets/icons/divider.svg';
import 'quill/dist/quill.snow.css';
import './assets/richTextEditor.less';
import './assets/modules.less';
import './assets/toolbar.less';

interface IBetterTable {
  operationMenu?: {
    insertColumnRight?: {
      text: string;
    };
    insertColumnLeft?: {
      text: string;
    };
    insertRowUp?: {
      text: string;
    };
    insertRowDown?: {
      text: string;
    };
    mergeCells?: {
      text: string;
    };
    unmergeCells?: {
      text: string;
    };
    deleteColumn?: {
      text: string;
    };
    deleteRow?: {
      text: string;
    };
    deleteTable?: {
      text: string;
    };
  };
  backgroundColors?: {
    colors?: string[];
    text?: string;
  };
  toolbarOptions?: {
    dialogRows?: number;
    dialogColumns?: number;
    i18n?: 'en' | 'zh' | 'es';
  };
}
interface IModules {
  table?: boolean | IBetterTable;
  codeHighlight?: boolean | { key: string; label: string }[];
  imageResize?: boolean | Record<string, unknown>;
  imageDrop?: boolean | Record<string, unknown>;
  magicUrl?: boolean;
  markdown?: boolean;
  link?: boolean | Record<string, unknown>;
}
interface IEditorProps {
  placeholder?: string;
  readOnly?: boolean;
  modules?: {
    imageHandler?: {
      imgUploadApi?: (formData: any) => Promise<string>;
      uploadSuccCB?: (data: unknown) => void;
      uploadFailCB?: (error: unknown) => void;
      imgRemarkPre?: string;
      maxSize?: number;
      imageAccept?: string;
    };
    toolbarOptions?: [][];
  } & IModules;
  getQuill?: (quill: Quill, uploadedImgsList?: string[]) => void;
  content?: Delta | string;
  onChange?: (delta: Delta, old: Delta) => void;
  onFocus?: (range?: Range) => void;
  onBlur?: (oldRange?: Range) => void;
  onSave?: () => void;
  i18n?: 'en' | 'zh' | 'es';
  style?: CSSProperties;
  theme?: 'bubble' | 'snow';
}

const RichTextEditor: FC<IEditorProps> = (props) => {
  const {
    modules = {},
    content,
    i18n = 'en',
    style = {},
    readOnly = false,
    theme = 'snow',
  } = props;
  const quillModules = useRef<
    IModules & {
      'better-table'?: Record<string, unknown>;
      tableHandler?: IBetterTable['toolbarOptions'] | boolean;
      syntax?: any;
      markdownShortcuts?: boolean;
      linkHandler?: boolean | { i18n: keyof typeof i18nConfig };
      imageHandler?: (IEditorProps['modules'] & {})['imageHandler'] & {
        i18n: keyof typeof i18nConfig;
      };
      qSyntax?: any;
      codeHandler?: boolean | string;
      dividerHandler?: boolean | Record<string, unknown>;
    }
  >({});
  const toolbarHandlers = useRef<Record<string, unknown>>({});
  const quillRef = useRef<Quill | undefined>(undefined);
  const editorId = useRef<string>(new Date().getTime() + (100 * Math.random()).toFixed(0));
  const uploadedImgsList = useRef<string[]>([]); // 已上传图片，主要给onComplete使用，可以用来判断哪些已上传图片实际并没有被使用

  // 处理外部传入的modules
  useEffect(() => {
    if (Object.keys(modules).length > 0) {
      const {
        table,
        codeHighlight,
        imageResize = true,
        imageDrop = true,
        magicUrl = true,
        markdown = true,
        link = true,
        imageHandler,
      } = modules;
      if (table) {
        quillModules.current.table = false;
        quillModules.current['better-table'] = {
          i18n,
          operationMenu: {
            items:
              (typeof table !== 'boolean' && table.operationMenu) ||
              (i18n === 'zh'
                ? {
                    insertColumnRight: {
                      text: '右侧插入列',
                    },
                    insertColumnLeft: {
                      text: '左侧插入列',
                    },
                    insertRowUp: {
                      text: '上方插入行',
                    },
                    insertRowDown: {
                      text: '下方插入行',
                    },
                    mergeCells: {
                      text: '合并单元格',
                    },
                    unmergeCells: {
                      text: '取消单元格合并',
                    },
                    deleteColumn: {
                      text: '删除列',
                    },
                    deleteRow: {
                      text: '删除行',
                    },
                    deleteTable: {
                      text: '删除表格',
                    },
                  }
                : i18n === 'es'
                  ? {
                      insertColumnRight: {
                        text: 'Insertar columna a la derecha',
                      },
                      insertColumnLeft: {
                        text: 'Insertar columna a la izquierda',
                      },
                      insertRowUp: {
                        text: 'Insertar fila arriba',
                      },
                      insertRowDown: {
                        text: 'Insertar fila abajo',
                      },
                      mergeCells: {
                        text: 'Combinar celdas',
                      },
                      unmergeCells: {
                        text: 'Separar celdas',
                      },
                      deleteColumn: {
                        text: 'Eliminar columna',
                      },
                      deleteRow: {
                        text: 'Eliminar fila',
                      },
                      deleteTable: {
                        text: 'Eliminar tabla',
                      },
                    }
                  : {}),
            color: {
              colors: ['#dbc8ff', '#6918b4', '#4a90e2', '#999', '#fff'], // 背景色值, ['white', 'red', 'yellow', 'blue'] as default
              text: getI18nText('tableBackground', i18n), // subtitle, 'Background Colors' as default
              ...(typeof table !== 'boolean' ? table.backgroundColors : null),
            },
          },
        };

        quillModules.current.tableHandler = {
          i18n,
          ...(typeof table !== 'boolean' ? table.toolbarOptions : {}),
        }; // 添加table的工具栏处理函数，需要先registry，在DidMount中
      }

      if (codeHighlight) {
        // quillModules.current.syntax = {
        //   hljs: highlightInit(),
        // };
        quillModules.current.qSyntax = {
          i18n,
          hljs: highlightInit(),
          languages:
            typeof codeHighlight !== 'boolean'
              ? codeHighlight
              : [
                  { key: 'plain', label: 'Plain' },
                  { key: 'javascript', label: 'Javascript' },
                  { key: 'java', label: 'Java' },
                  { key: 'python', label: 'Python' },
                  { key: 'cpp', label: 'C++/C' },
                  { key: 'csharp', label: 'C#' },
                  { key: 'php', label: 'PHP' },
                  { key: 'sql', label: 'SQL' },
                  { key: 'json', label: 'JSON' },
                  { key: 'bash', label: 'Bash' },
                  { key: 'go', label: 'Go' },
                  { key: 'objectivec', label: 'Object-C' },
                  { key: 'xml', label: 'Html/xml' },
                  { key: 'css', label: 'CSS' },
                  { key: 'ruby', label: 'Ruby' },
                  { key: 'swift', label: 'Swift' },
                  { key: 'scala', label: 'Scala' },
                ],
        };
      }

      // 默认添加图片缩放功能
      if (imageResize) {
        quillModules.current.imageResize = {
          i18n,
          ...(typeof imageResize === 'object' ? imageResize : null),
        };
      }
      // 默认图片拖拽/复制到富文本
      if (imageDrop) {
        quillModules.current.imageDrop = {
          i18n,
          imageHandler,
          uploadedImgsList: uploadedImgsList.current,
          ...(typeof imageDrop === 'object' ? imageDrop : null),
        };
      }
      // 默认支持自动识别URL
      quillModules.current.magicUrl = magicUrl;
      // 默认支持自动识别markdown语法
      quillModules.current.markdownShortcuts = markdown;

      // toolbar handler处理
      if (link) {
        quillModules.current.linkHandler = { i18n };
      }
      quillModules.current.imageHandler = { i18n, ...imageHandler };
      quillModules.current.codeHandler = true;
      toolbarHandlers.current.undo = () => undoHandler(quillRef.current!);
      toolbarHandlers.current.redo = () => redoHandler(quillRef.current!);
      quillModules.current.dividerHandler = { i18n };
    }

    // 设置自定义字体/大小
    const { toolbarOptions } = modules;
    let fontList = ['system', 'wsYaHei', 'songTi', 'serif', 'arial'];
    let sizeList = ['12px', '14px', '18px', '36px'];
    if (toolbarOptions) {
      toolbarOptions.forEach((formats) => {
        if (Array.isArray(formats)) {
          formats.forEach((format: { font?: []; size?: [] }) => {
            if (typeof format === 'object') {
              if (format.font && Array.isArray(format.font)) {
                fontList = format.font;
              }
              if (format.size && Array.isArray(format.size)) {
                sizeList = format.size;
              }
            }
          });
        }
      });
    }
    const SizeStyle = quillImport<WhitelistedAttributor>('attributors/style/size');
    SizeStyle.whitelist = sizeList;
    quillRegister(SizeStyle);
    const FontStyle = quillImport<WhitelistedAttributor>('formats/font');
    FontStyle.whitelist = fontList;
    quillRegister(FontStyle);

    // 设置重做撤销Icon
    const icons = quillImport<QuillIcons>('ui/icons');
    icons.undo = IconUndo;
    icons.redo = IconRedo;
    icons.divider = IconDivider;
  }, [modules]);

  useEffect(() => {
    const { placeholder, getQuill, onChange, onFocus, onBlur, onSave } = props;
    if (quillModules.current['better-table']) {
      Quill.register(
        {
          'modules/better-table': QuillBetterTable,
        },
        true,
      );
    }

    // Quill.register(Image, true); // 允许图片的样式保存在Delta中
    // Quill.register(ListItem, true); // 允许图片的样式保存在Delta中
    // Quill.register(
    //   {
    //     'modules/imageResize': ImageResize,
    //     'modules/imageDrop': ImageDrop,
    //     'modules/magicUrl': MagicUrl,
    //     'modules/markdownShortcuts': MarkdownShortcuts,
    //     'modules/tableHandler': TableHandler,
    //     'modules/linkHandler': LinkHandler,
    //     'modules/imageHandler': ImageHandler,
    //     'modules/codeHandler': CodeHandler,
    //     'modules/qSyntax': QSyntax,
    //   },
    //   true,
    // );

    const lineBreakMatcher = () => {
      const newDelta = new Delta();
      newDelta.insert({ break: '' });
      return newDelta;
    };

    const toolbarOptions = modules.toolbarOptions || [
      ['undo', 'redo', 'clean'],
      [
        { font: ['system', 'wsYaHei', 'songTi', 'serif', 'arial'] },
        { size: ['12px', false, '18px', '36px'] },
        { header: [false, 1, 2, 3, 4] },
      ],
      ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { list: 'check' },
        { indent: '-1' },
        { indent: '+1' },
        { align: [] },
      ],
      [
        'blockquote',
        modules.codeHighlight ? 'code-block' : undefined,
        modules.link !== false ? 'link' : undefined,
        'image',
        { script: 'sub' },
        { script: 'super' },
        quillModules.current['better-table'] ? 'table' : undefined,
        'divider',
      ],
    ]
      // Disabled controls are left as `undefined` above; Quill 2 calls
      // Object.keys() on every entry and throws on the holes, so drop them.
      .map((group) => group.filter((control) => control !== undefined))
      .filter((group) => group.length > 0);

    const quill = new Quill(`#editor${editorId.current}`, {
      debug: false,
      modules: {
        // formula: true, // todo 公式，暂不支持
        ...quillModules.current,
        toolbar: {
          container: toolbarOptions, // Selector for toolbar container
          handlers: {
            ...toolbarHandlers.current,
          },
        },
        clipboard: {
          matchers: [['BR', lineBreakMatcher]],
        },
        keyboard: {
          bindings: {
            ...QuillBetterTable.keyboardBindings,
            ...keyboardBindsFn({
              onSave,
            }),
          },
        },

        history: {
          delay: 2000,
          maxStack: 100,
          userOnly: true,
        },
      },
      placeholder: placeholder || (getI18nText('placeholder', i18n) as string),
      readOnly,
      bounds: document.querySelector(`#editor${editorId.current}`) as HTMLElement,
      theme,
    });
    quillRef.current = quill;

    toolbarInit(quill, i18n);

    quill.on('selection-change', (range: Range, _oldRange: Range, _source: EmitterSource) => {
      if (range == null || !quill.hasFocus()) return;

      // 当新建table或者选中table时，禁止部分toolbar options，添加table时触发的source=api
      if (modules.table && quill) {
        const disableInTable = ['header', 'blockquote', 'code-block', 'hr', 'list'];
        const format = quill.getFormat() || {};
        if (format && format['table-cell-line']) {
          optionDisableToggle(quill, disableInTable, true);
        } else {
          optionDisableToggle(quill, disableInTable, false);
        }
      }
    });

    content && setContent(content, quill); // 设置初始内容

    getQuill && getQuill(quill, uploadedImgsList.current);

    if (onChange) {
      quill.on('text-change', (delta: Delta, old: Delta, source: EmitterSource) => {
        source === 'user' && onChange(delta, old);
      });
    }
    if (onFocus || onBlur) {
      quill.on('selection-change', (range: Range, oldRange: Range, _source: EmitterSource) => {
        const hasFocus = range && !oldRange;
        const hasBlur = !range && oldRange;
        if (onFocus && hasFocus) onFocus(range);
        if (onBlur && hasBlur) onBlur(oldRange);
      });
    }

    // 解决中文拼音输入时placeholder无法消失的问题
    const dom = document.getElementById(`editor${editorId.current}`)!.querySelector('.ql-editor');
    dom!.addEventListener(
      'input',
      throttle(() => {
        if ((dom as HTMLElement).innerText !== '\n' && dom!.classList.contains('ql-blank')) {
          quill.root.setAttribute('data-placeholder', '');
        } else if ((dom as HTMLElement).innerText === '\n') {
          quill.root.setAttribute(
            'data-placeholder',
            placeholder || (getI18nText('placeholder', i18n) as string),
          ); // 输入拼音又删除的情况，需要将placeholder再展示出来
        }
      }, 100),
    );
    // 当把placeholder置为空，当内容删为空时，placeholder无法出来
    quill.on(
      'text-change',
      throttle(() => {
        if (quill.getText() === '\n' && quill.root.getAttribute('data-placeholder') === '') {
          quill.root.setAttribute(
            'data-placeholder',
            placeholder || (getI18nText('placeholder', i18n) as string),
          );
        }
      }),
    );
  }, []);

  useEffect(() => {
    if (content) {
      setContent(content, quillRef.current!);
    }
  }, [content]);

  useEffect(() => {
    if (quillRef.current) {
      if (readOnly) {
        quillRef.current.enable(false);
      } else {
        quillRef.current.enable();
      }
    }
  }, [readOnly]);

  return (
    <div className="ql-editor-container" style={style}>
      <div id={`editor${editorId.current}`} />
    </div>
  );
};

export default RichTextEditor;
