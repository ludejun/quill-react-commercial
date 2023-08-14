import unlinkIcon from '../../assets/icons/unlink.svg';
import jumpIcon from '../../assets/icons/jump.svg';


export const iconsConfig = {
  unlinkIcon,
  jumpIcon,
};

export const genIconDom = (icon, title: string, className?: string) =>
  `<span class="${className || 'flex flex-center'}" onmouseenter="showTitle(this, '${title}')" style="width:100%;height:100%;">${icon}</span>`;
