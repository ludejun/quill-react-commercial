// 给 Icon 添加 Tooltip 提示：在 offsetParent 中插入 Dom
export const showTitle = (target: HTMLElement, title: string) => {
  const { offsetLeft, offsetTop, offsetHeight, offsetParent } = target;
  const position = `left:${offsetLeft}px;top:${offsetTop + offsetHeight + 6}px;`;
  const tooltip = document.getElementsByClassName('quill-icon-tooltip') as unknown as HTMLDivElement[];

  if (tooltip.length > 0) {
    tooltip[0].innerText = title;
    tooltip[0].setAttribute('style', position);
    target.addEventListener(
      'mouseleave',
      () => {
        tooltip[0].style.display = 'none';
      },
      false,
    );
  } else {
    const t = document.createElement('div');
    t.classList.add('quill-icon-tooltip');
    t.innerText = title;
    t.setAttribute('style', position);
    target.addEventListener(
      'mouseleave',
      () => {
        t.style.display = 'none';
      },
      false,
    );
    (offsetParent || document.body).appendChild(t);
  }
};
