/* header.js — 站点顶栏交互
 * 主题优先级与 color.css 对齐：
 *   手动 localStorage('theme')  >  系统 prefers-color-scheme  >  默认亮
 * 用 data-theme 表达手动状态（而不是 .dark class）
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var btnDark = document.querySelector('.btn-dark');
  var btnMenu = document.querySelector('.btn-menu');
  var header  = document.querySelector('.site-header');
  var mq      = window.matchMedia('(prefers-color-scheme: dark)');

  // ---- 首屏：移除 not-ready ----
  root.classList.remove('not-ready');

  // ---- 移动菜单 ----
  if (btnMenu) {
    btnMenu.addEventListener('click', function () {
      root.classList.toggle('open');
      root.classList.toggle('close');
    });
  }

  // ---- 主题 ----
  function savedMode() {
    var v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : 'auto';
  }

  function effectiveMode() {
    var m = savedMode();
    return m === 'auto' ? (mq.matches ? 'dark' : 'light') : m;
  }

  function applyTheme() {
    var mode = savedMode();
    var eff  = effectiveMode();

    // auto → 删掉属性，让 CSS 自己走 light-dark()/prefers-color-scheme
    if (mode === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', mode);
    }

    // meta theme-color：从 header 的 data-bg-* 读，兜底用 color.css 基色
    if (meta) {
      var light = (header && header.dataset.bgLight) || '#f2f2ef';
      var dark  = (header && header.dataset.bgDark)  || '#161616';
      meta.setAttribute('content', eff === 'dark' ? dark : light);
    }
  }

  applyTheme();

  // 系统变化：只在 auto 状态下跟随（修复原代码"系统变化覆盖手动选择"的 bug）
  mq.addEventListener('change', function () {
    if (savedMode() === 'auto') applyTheme();
  });

  // 手动切换按钮
  if (btnDark) {
    btnDark.addEventListener('click', function () {
      localStorage.setItem('theme', effectiveMode() === 'dark' ? 'light' : 'dark');
      applyTheme();
    });
  }
})();
