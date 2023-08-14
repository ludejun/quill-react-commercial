'use strict';

var unlink = require('../../assets/icons/unlink.svg.js');
var jump = require('../../assets/icons/jump.svg.js');

var iconsConfig = {
    unlinkIcon: unlink.default,
    jumpIcon: jump.default,
};
var genIconDom = function (icon, title, className) {
    return "<span class=\"" + (className || 'flex flex-center') + "\" onmouseenter=\"showTitle(this, '" + title + "')\" style=\"width:100%;height:100%;\">" + icon + "</span>";
};

exports.genIconDom = genIconDom;
exports.iconsConfig = iconsConfig;
