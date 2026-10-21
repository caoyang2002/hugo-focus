/* ==========================================================================
   article.js — 文章页交互
   读取 single.html 里的 data-* 配置，按需注入第三方评论脚本
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 通用：进入视口前 200px 时执行一次 ---------- */
  function onNear(el, cb) {
    if (!('IntersectionObserver' in window)) return cb();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          io.disconnect();
          cb();
        }
      });
    }, { rootMargin: '200px 0px' });
    io.observe(el);
  }

  /* ---------- Disqus ---------- */
  function initDisqus(el) {
    var shortname = el.dataset.disqusShortname;
    if (!shortname) return;
    onNear(el, function () {
      window.disqus_config = function () {};
      var s = document.createElement('script');
      s.src = 'https://' + shortname + '.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(Date.now()));
      document.head.appendChild(s);
    });
  }

  /* ---------- GraphComment ---------- */
  function initGraphComment(el) {
    var id = el.dataset.graphcommentId;
    if (!id) return;
    onNear(el, function () {
      window.__semio__params = {
        graphcommentId: id,
        behaviour: {}
      };
      window.__semio__onload = function () {
        if (window.__semio__gc_graphlogin) {
          window.__semio__gc_graphlogin(window.__semio__params);
        }
      };
      var s = document.createElement('script');
      s.async = true;
      s.defer = true;
      s.onload = window.__semio__onload;
      s.src = 'https://integration.graphcomment.com/gc_graphlogin.js?' + Date.now();
      (document.head || document.body).appendChild(s);
    });
  }

  /* ---------- Giscus ---------- */
  function initGiscus(el) {
    if (!el.dataset.repo) return;
    onNear(el, function () {
      var s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.crossOrigin = 'anonymous';
      s.async = true;
      [
        'repo', 'repoId', 'category', 'categoryId', 'mapping', 'strict',
        'reactionsEnabled', 'emitMetadata', 'inputPosition', 'theme', 'lang', 'loading'
      ].forEach(function (k) {
        var camel = k;
        // data-repo-id ↔ data-repoId 的映射
        var val = el.dataset[camel];
        if (val == null) return;
        var attr = 'data-' + k.replace(/[A-Z]/g, function (m) {
          return '-' + m.toLowerCase();
        });
        s.setAttribute(attr, val);
      });
      el.appendChild(s);
    });
  }

  /* ---------- 主题联动（giscus 需要显式切换主题） ---------- */
  function watchTheme() {
    var giscus = document.querySelector('.giscus');
    if (!giscus || !giscus.querySelector('iframe')) return;

    function currentTheme() {
      var root = document.documentElement;
      var t = root.getAttribute('data-theme');
      if (t === 'dark' || t === 'light') return t;
      if (root.classList.contains('dark')) return 'dark';
      if (root.classList.contains('light')) return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function post(theme) {
      var frame = giscus.querySelector('iframe.giscus-frame');
      if (!frame) return;
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: theme } } },
        'https://giscus.app'
      );
    }

    // 初始同步
    post(currentTheme());

    // 监听手动切换
    new MutationObserver(function () { post(currentTheme()); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

    // 监听系统切换
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function () { post(currentTheme()); });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    var disqus = document.getElementById('disqus_thread');
    if (disqus && disqus.dataset.disqusShortname) initDisqus(disqus);

    var gc = document.getElementById('graphcomment');
    if (gc && gc.dataset.graphcommentId) initGraphComment(gc);

    var giscus = document.querySelector('.giscus');
    if (giscus) {
      initGiscus(giscus);
      watchTheme();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
