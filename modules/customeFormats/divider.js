import Quill from 'quill';
import { isColor } from '../../utils';
const BlockEmbed = Quill.import('blots/block/embed');

export const styleConfig = (color) => ({
  solid: `border:none;border-top:1px solid ${color};`,
  dashed: `border:none;border-top:1px dashed ${color};`,
  double: `border:none;border-top:3px double ${color};`,
  gradient: `border:0;padding-top:2px;background:linear-gradient(to right,transparent, ${color},transparent);`,
  italic: `border:0;padding-top:4px;background: repeating-linear-gradient(135deg,${color} 0px, ${color} 1px,transparent 1px,transparent 6px);`,
  colorItalic: `border:0;padding-top:4px;background:linear-gradient(135deg,red,orange,${color},blue,purple);mask-image: repeating-linear-gradient(135deg,#000 0px, #000 1px,transparent 1px,transparent 6px);`,
});
export const defaultColor = '#999';
class DividerBlot extends BlockEmbed {
  // 通过Delta数据重构Dom
  static create(value) {
    const node = super.create();
    if (value && value instanceof Object) {
      node.setAttribute('style', styleConfig(value.color || defaultColor)[value.type || 'solid']);
      node.setAttribute('data-type', value.type);
      if (isColor(value.color)) node.setAttribute('data-color', value.color);
    }
    return node;
  }

  // 保存在Delta中
  static formats(domNode) {
    if (domNode.hasAttribute('data-type')) {
      return {
        style: `${domNode.getAttribute('data-type')}-${
          domNode.getAttribute('data-color') !== defaultColor
            ? domNode.getAttribute('data-color')
            : ''
        }`,
        background: undefined,
      };
    }
    return undefined;
  }

  // Delta中的属性如何变为Dom上的数据
  format(name, value) {
    if (name === 'style' && value) {
      const data = value.split('-');
      this.domNode.setAttribute(name, styleConfig(isColor(data[1]) ? data[1] : defaultColor)[data[0]]);
    } else {
      super.format(name, value);
    }
  }

  // 没有使用divider的Name，是因为原Quill的SDK会点击divider会弹出一个prompts
  static blotName = 'QDivider';
  static tagName = 'hr';
}

export default DividerBlot;
