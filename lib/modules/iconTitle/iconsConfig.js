import unlinkIcon from '../../assets/icons/unlink.svg.js';
import jumpIcon from '../../assets/icons/jump.svg.js';

var iconsConfig = {
    unlinkIcon: unlinkIcon,
    jumpIcon: jumpIcon,
};
var genIconDom = function (icon, title, className) {
    return "<span class=\"" + (className || 'flex flex-center') + "\" onmouseenter=\"showTitle(this, '" + title + "')\" style=\"width:100%;height:100%;\">" + icon + "</span>";
};

export { genIconDom, iconsConfig };
