'use strict';

// 给 Icon 添加 Tooltip 提示：在 offsetParent 中插入 Dom
var showTitle = function (target, title) {
    var offsetLeft = target.offsetLeft, offsetTop = target.offsetTop, offsetHeight = target.offsetHeight, offsetParent = target.offsetParent;
    var position = "left:" + offsetLeft + "px;top:" + (offsetTop + offsetHeight + 6) + "px;";
    var tooltip = document.getElementsByClassName('quill-icon-tooltip');
    if (tooltip.length > 0) {
        tooltip[0].innerText = title;
        tooltip[0].setAttribute('style', position);
        target.addEventListener('mouseleave', function () {
            tooltip[0].style.display = 'none';
        }, false);
    }
    else {
        var t_1 = document.createElement('div');
        t_1.classList.add('quill-icon-tooltip');
        t_1.innerText = title;
        t_1.setAttribute('style', position);
        target.addEventListener('mouseleave', function () {
            t_1.style.display = 'none';
        }, false);
        (offsetParent || document.body).appendChild(t_1);
    }
};

exports.showTitle = showTitle;
