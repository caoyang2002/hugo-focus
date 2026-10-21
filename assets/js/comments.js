/* comments.js —— 放在 body 末尾或 defer 引入 */
(function () {
  const WRAP = document.querySelector('.giscus-wrap');
  if (!WRAP) return;

  const ORIGIN = 'https://giscus.app';
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  // 与 color.css 的优先级保持一致：
  // 手动 data-theme  >  系统 prefers-color-scheme  >  默认亮
  function resolveTheme() {
    const manual = document.documentElement.dataset.theme;
    if (manual === 'dark' || manual === 'light') return manual;
    return mq.matches ? 'dark' : 'light';
  }

  function sendTheme() {
    const iframe = WRAP.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: resolveTheme() } } },
      ORIGIN
    );
  }

  // giscus iframe 就绪后会向宿主 postMessage，借此确认可通信
  let ready = false;
  window.addEventListener('message', (e) => {
    if (e.origin !== ORIGIN || !e.data || !e.data.giscus) return;

    const iframe = WRAP.querySelector('iframe.giscus-frame');
    if (!ready) {
      ready = true;
      sendTheme();                       // 首次纠正主题
      iframe?.classList.add('is-ready'); // 淡入，掩盖闪烁
    }
  });

  // 宿主主题切换 → 推给 iframe
  new MutationObserver(() => {
    if (ready) sendTheme();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  });

  // 系统主题变化：仅在"未手动指定"时生效
  mq.addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) sendTheme();
  });
})();
