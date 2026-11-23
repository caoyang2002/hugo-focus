/* ==========================================================
   article-share.js
   放置：assets/js/article-share.js（或 static/js/）
   依赖（按需加载，多源回退）：qrcode@1.5.3、html2canvas@1.4.1
   建议自托管到 static/js/vendor/ 以避免 CDN 被拦：
     qrcode.min.js      ← https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js
     html2canvas.min.js ← https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
   ========================================================== */
(function () {
    "use strict";

    var root = document.querySelector("[data-sp-root]");
    var overlay = document.getElementById("sharePanel");
    if (!root || !overlay || root.getAttribute("data-sp-ready")) return;
    root.setAttribute("data-sp-ready", "1");

    // 把浮层移到 <body>：脱离文章容器，避免祖先的 transform / overflow / z-index 破坏 fixed 定位
    document.body.appendChild(overlay);

    /* ---------- 基础数据（来自 data-* 属性） ---------- */
    var D = root.dataset;
    var data = {
        title: D.title || document.title,
        desc: D.desc || "",
        url: D.url || location.href,
        site: D.site || "",
        vendor: D.vendor || "",
    };

    var dialog = overlay.querySelector(".sp-panel");
    var scrollBox = overlay.querySelector(".sp-scroll");
    var tabs = Array.from(overlay.querySelectorAll("[data-tab]"));
    var panes = Array.from(overlay.querySelectorAll("[data-pane]"));

    var $ = function (sel, el) {
        return (el || overlay).querySelector(sel);
    };
    var $$ = function (sel, el) {
        return Array.from((el || overlay).querySelectorAll(sel));
    };

    // 调试输出：默认开启，可在页面 URL 加 ?spdebug=0 关闭
    var SP_DEBUG = !/[?&]spdebug=0/.test(location.search);
    function logInfo(label, extra) {
        if (!SP_DEBUG) return;
        if (extra === undefined) console.info("[article-share] " + label);
        else console.info("[article-share] " + label, extra);
    }
    function logWarn(label, extra) {
        if (!SP_DEBUG) return;
        console.warn("[article-share] " + label, extra === undefined ? "" : extra);
    }

    /* ==========================================================
       第三方库：本地 → 多个 CDN 依次回退
       ========================================================== */
    // qrcode 库在隐藏 iframe 里加载（独立全局作用域），
    // 避免与站点已有的 QRCode 全局变量冲突（"Identifier 'QRCode' has already been declared"）
    var QR_SRCS = [
        data.vendor && data.vendor + "qrcode.min.js",
        // "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/lib/browser.min.js",
        // "https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js",
    ];

    var LIBS = {
        html2canvas: {
            test: function () {
                return typeof window.html2canvas === "function";
            },
            srcs: [
                data.vendor && data.vendor + "html2canvas.min.js",
                // 本地文件异常时回退到 CDN，避免移动端一直卡在加载
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
                "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
            ],
        },
    };

    function loadScript(src, ms) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement("script");
            var timer = setTimeout(function () {
                s.remove();
                reject(new Error("timeout " + src));
            }, ms);
            s.src = src;
            s.async = true;
            s.onload = function () {
                clearTimeout(timer);
                resolve();
            };
            s.onerror = function () {
                clearTimeout(timer);
                s.remove();
                reject(new Error("error " + src));
            };
            document.head.appendChild(s);
        });
    }

    function loadLib(name) {
        var lib = LIBS[name];
        if (lib.test()) return Promise.resolve();
        if (lib.pending) return lib.pending;
        lib.pending = (async function () {
            for (var i = 0; i < lib.srcs.length; i++) {
                if (!lib.srcs[i]) continue;
                try {
                    logInfo("加载依赖 " + name, lib.srcs[i]);
                    var startedAt = performance.now();
                    await loadScript(lib.srcs[i], 12000);
                    if (lib.test()) {
                        logInfo(
                            "依赖就绪 " + name +
                                "（" +
                                Math.round(performance.now() - startedAt) +
                                "ms）",
                        );
                        return;
                    }
                    logWarn("依赖加载后未挂载 " + name, lib.srcs[i]);
                } catch (e) {
                    logWarn("依赖加载失败 " + name, lib.srcs[i]);
                    /* 换下一个源 */
                }
            }
            throw new Error("lib failed: " + name);
        })();
        lib.pending.catch(function () {
            lib.pending = null;
        });
        return lib.pending;
    }

    // html2canvas 首次渲染会做 JIT/样式解析/画布初始化，明显比后续慢。
    // 先用一个极小的离屏元素预热一次，让真正导出不再“第一次特别久”。
    var h2cWarmPromise = null;
    var h2cWarmed = false;
    function warmUpHtml2canvas() {
        if (h2cWarmed) return Promise.resolve();
        if (h2cWarmPromise) return h2cWarmPromise;
        h2cWarmPromise = loadLib("html2canvas")
            .then(function () {
                var el = document.createElement("div");
                el.className = "sp-scope";
                el.style.cssText =
                    "position:absolute;left:-10000px;top:0;width:32px;height:32px;" +
                    "background:#f2f2ef;color:#111;font:12px/1 sans-serif;";
                el.textContent = "warm";
                document.body.appendChild(el);
                var startedAt = performance.now();
                return Promise.race([
                    window.html2canvas(el, {
                        scale: 1,
                        logging: false,
                        backgroundColor: "#f2f2ef",
                    }).then(function (c) {
                        try {
                            c.toDataURL();
                        } catch (e) {}
                    }),
                    new Promise(function (resolve) {
                        setTimeout(function () {
                            logWarn("html2canvas 预热超时，跳过");
                            resolve();
                        }, 8000);
                    }),
                ])
                    .catch(function (e) {
                        logWarn("html2canvas 预热失败", e && e.message);
                    })
                    .then(function () {
                        el.remove();
                        h2cWarmed = true;
                        logInfo(
                            "html2canvas 预热完成（" +
                                Math.round(performance.now() - startedAt) +
                                "ms）",
                        );
                    });
            })
            .catch(function () {
                h2cWarmPromise = null;
            });
        return h2cWarmPromise;
    }

    var qrWin = null;
    function loadQRLib() {
        if (qrWin) return Promise.resolve(qrWin);
        if (loadQRLib.pending) return loadQRLib.pending;
        loadQRLib.pending = (async function () {
            var qrT0 = performance.now();
            logInfo("加载二维码库…");
            var frame = document.createElement("iframe");
            frame.setAttribute("aria-hidden", "true");
            frame.tabIndex = -1;
            frame.style.cssText =
                "position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none";
            frame.srcdoc = "<!doctype html><html><head></head><body></body></html>";
            // 部分移动端 WebView 的 srcdoc iframe 可能不触发 load，必须加超时兜底
            try {
                await new Promise(function (resolve, reject) {
                    var timer = setTimeout(function () {
                        reject(new Error("iframe timeout"));
                    }, 6000);
                    frame.onload = function () {
                        clearTimeout(timer);
                        resolve();
                    };
                    document.body.appendChild(frame);
                });
            } catch (e) {
                frame.remove();
                throw e;
            }
            var win = frame.contentWindow;
            var doc = frame.contentDocument;
            for (var i = 0; i < QR_SRCS.length; i++) {
                var src = QR_SRCS[i];
                if (!src) continue;
                try {
                    await new Promise(function (resolve, reject) {
                        var s = doc.createElement("script");
                        var timer = setTimeout(function () {
                            reject(new Error("timeout"));
                        }, 8000);
                        s.onload = function () {
                            clearTimeout(timer);
                            resolve();
                        };
                        s.onerror = function () {
                            clearTimeout(timer);
                            reject(new Error("error"));
                        };
                        s.src = src;
                        doc.head.appendChild(s);
                    });
                    if (win.QRCode && typeof win.QRCode.toDataURL === "function") {
                        qrWin = win;
                        logInfo(
                            "二维码库就绪（" +
                                Math.round(performance.now() - qrT0) +
                                "ms）",
                        );
                        return win;
                    }
                } catch (e) {
                    /* 换下一个源 */
                }
            }
            frame.remove();
            throw new Error("lib failed: qrcode");
        })();
        loadQRLib.pending.catch(function () {
            loadQRLib.pending = null;
        });
        return loadQRLib.pending;
    }

    function qrDataURL(text, width, margin) {
        return loadQRLib().then(function (win) {
            return new Promise(function (resolve, reject) {
                win.QRCode.toDataURL(
                    text,
                    {
                        width: width,
                        margin: margin,
                        errorCorrectionLevel: "M",
                        color: { dark: "#111111", light: "#ffffff" },
                    },
                    function (err, url) {
                        err ? reject(err) : resolve(url);
                    },
                );
            });
        });
    }

    /* ==========================================================
       Toast
       ========================================================== */
    var toastTimer;
    function toast(msg) {
        var old = document.querySelector(".sp-toast");
        if (old) old.remove();
        clearTimeout(toastTimer);
        var el = document.createElement("div");
        el.className = "sp-scope sp-toast";
        el.setAttribute("role", "status");
        el.textContent = msg;
        document.body.appendChild(el);
        requestAnimationFrame(function () {
            el.classList.add("is-show");
        });
        toastTimer = setTimeout(function () {
            el.classList.remove("is-show");
            setTimeout(function () {
                el.remove();
            }, 300);
        }, 2800);
    }

    /* ==========================================================
       面板开关 / 焦点管理 / 滚动锁定
       ========================================================== */
    var lastFocus = null;

    function lockScroll(on) {
        var de = document.documentElement;
        if (on) {
            var sw = window.innerWidth - de.clientWidth;
            de.classList.add("sp-lock");
            if (sw > 0) document.body.style.paddingRight = sw + "px";
        } else {
            de.classList.remove("sp-lock");
            document.body.style.paddingRight = "";
        }
    }

    function openPanel() {
        lastFocus = document.activeElement;
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        lockScroll(true);
        initStats();
        renderContent();
        warmUpShare();
        var close = $("[data-action='close']");
        if (close) close.focus({ preventScroll: true });
    }

    // 提前预热：首次导出最常见的慢点就是依赖与图片，打开面板时先把它们准备好
    function prewarmCardImages(card) {
        if (!card) return;
        var mobile = isMobileDevice();
        var origin = location.origin;
        Array.from(card.querySelectorAll("img")).forEach(function (img) {
            var src = img.currentSrc || img.src;
            if (!src || src.indexOf("data:") === 0) return;
            // 移动端不预取外部图片，避免不同网络环境下的失败与等待
            if (mobile && src.indexOf("http") === 0 && src.indexOf(origin) !== 0) {
                return;
            }
            fetchDataURL(src, 1400).catch(function () {});
        });
    }

    function preloadHtml2canvas() {
        warmUpHtml2canvas().catch(function () {});
    }

    function warmUpShare() {
        preloadHtml2canvas();
        if (!qrOK) renderQR();
        prewarmCardImages(document.getElementById("shareCard"));
        prewarmCardImages(document.getElementById("spContentCard"));
    }

    function closePanel() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        lockScroll(false);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function trapFocus(e) {
        if (e.key !== "Tab") return;
        var scope = dialog;
        var list = $$(
            "button:not([disabled]), input, [href], [tabindex]:not([tabindex='-1'])",
            scope,
        ).filter(function (el) {
            return !el.closest("[hidden]") && el.getAttribute("tabindex") !== "-1";
        });
        if (!list.length) return;
        var first = list[0];
        var last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("is-open")) return;
        if (e.key === "Escape") {
            closePanel();
        } else {
            trapFocus(e);
        }
    });

    overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) closePanel();
    });

    /* ==========================================================
       标签切换：快速分享 / 图片分享 / 内容卡片
       ========================================================== */
    function setTab(name, focus) {
        tabs.forEach(function (t) {
            var on = t.dataset.tab === name;
            t.setAttribute("aria-selected", on ? "true" : "false");
            t.tabIndex = on ? 0 : -1;
            if (on && focus) t.focus();
        });
        panes.forEach(function (p) {
            p.hidden = p.dataset.pane !== name;
        });
        scrollBox.scrollTop = 0;
    }

    var tabList = $(".sp-tabs");
    tabList.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        var n = tabs.length;
        var next = -1;
        if (e.key === "ArrowRight") next = (i + 1) % n;
        else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = n - 1;
        if (next >= 0) {
            e.preventDefault();
            setTab(tabs[next].dataset.tab, true);
        }
    });

    /* ==========================================================
       二维码（所有 [data-sp-qr] 容器同步渲染；失败时给出重试入口）
       ========================================================== */
    var qrOK = false;
    var qrBusy = null;

    function showQRFail(box) {
        box.innerHTML =
            '<button type="button" class="sp-qr-retry" data-action="retry-qr">二维码加载失败<br>点击重试</button>';
    }

    function renderQR() {
        if (qrBusy) return qrBusy;
        var boxes = $$("[data-sp-qr]");
        qrBusy = (async function () {
            var url;
            try {
                url = await qrDataURL(data.url, 152, 0);
            } catch (e) {
                boxes.forEach(showQRFail);
                return false;
            }
            boxes.forEach(function (box) {
                box.innerHTML = "";
                var im = new Image();
                im.src = url;
                im.width = 76;
                im.height = 76;
                im.alt = "文章二维码";
                box.appendChild(im);
            });
            return true;
        })();
        qrBusy.then(function (ok) {
            qrOK = ok;
            qrBusy = null;
            if (!ok) toast("二维码加载失败，可点击二维码重试");
        });
        return qrBusy;
    }

    /* ==========================================================
       内容卡片：从 <template id="spContentSrc"> 读取正文节选
       ========================================================== */

       var LENS = { short: 300, mid: 800, long: 1600 };
       var lenKey = "mid";
       var srcEl = document.getElementById("spContentSrc");

       // 读取结构：把模板里的标题/段落转成 { type, text } 数组
       var blocks = [];
       (function () {
           var frag = srcEl && (srcEl.content || srcEl);
           if (!frag) return;
           var nodes = frag.querySelectorAll
               ? frag.querySelectorAll("h1,h2,h3,h4,h5,h6,p")
               : [];
           Array.from(nodes).forEach(function (node) {
               var text = node.textContent.replace(/\s+/g, " ").trim();
               if (!text) return;
               var isHead = /^h[1-6]$/.test(node.tagName.toLowerCase());
               blocks.push({ type: isHead ? "h" : "p", text: text });
           });
       })();

       function renderContent() {
           var body = $("#spContentBody");
           var more = $("#spContentMore");
           if (!body) return;
           body.textContent = "";

           if (!blocks.length) {
               var p0 = document.createElement("p");
               p0.textContent = data.desc || data.title;
               body.appendChild(p0);
               more.hidden = true;
               return;
           }

           var limit = LENS[lenKey];
           var used = 0;
           var truncated = false;

           for (var i = 0; i < blocks.length; i++) {
               var b = blocks[i];
               if (used >= limit) { truncated = true; break; }

               var remain = limit - used;
               var el;

               if (b.text.length > remain) {
                   var cut = b.text.slice(0, Math.max(1, remain)).replace(/[，,、；;：:\s]+$/, "");
                   if (cut) {
                       el = document.createElement(b.type === "h" ? "h5" : "p");
                       el.textContent = cut + "…";
                       body.appendChild(el);
                   }
                   truncated = true;
                   break;
               }

               el = document.createElement(b.type === "h" ? "h5" : "p");
               el.textContent = b.text;
               body.appendChild(el);
               used += b.text.length;
           }

           // 避免孤立小标题落在末尾；删空时兜底
           while (body.lastElementChild && body.lastElementChild.tagName === "H5") {
               body.lastElementChild.remove();
           }
           if (!body.firstElementChild) {
               var fallback = document.createElement("p");
               fallback.textContent = data.desc || data.title;
               body.appendChild(fallback);
           }

           more.hidden = !truncated;
       }

    function setLen(key) {
        if (!LENS[key]) return;
        lenKey = key;
        $$("[data-action='len']").forEach(function (b) {
            b.setAttribute("aria-pressed", b.dataset.len === key ? "true" : "false");
        });
        renderContent();
    }

    /* ==========================================================
       导出图片：离屏舞台 + 图片内联 + html2canvas
       ========================================================== */
    var dataCache = {};

    function fetchWithTimeout(url, ms, options) {
        options = options || {};
        if (typeof AbortController !== "function") return fetch(url, options);
        var ctrl = new AbortController();
        var timer = setTimeout(function () {
            ctrl.abort();
        }, ms);
        var opts = Object.assign({}, options, { signal: ctrl.signal });
        return fetch(url, opts).then(
            function (res) {
                clearTimeout(timer);
                return res;
            },
            function (err) {
                clearTimeout(timer);
                throw err;
            },
        );
    }

    function loadImageElement(src, ms) {
        return new Promise(function (resolve, reject) {
            var im = new Image();
            var timer = setTimeout(function () {
                im.src = "";
                reject(new Error("image timeout"));
            }, ms);
            im.onload = function () {
                clearTimeout(timer);
                resolve(im);
            };
            im.onerror = function () {
                clearTimeout(timer);
                reject(new Error("image error"));
            };
            im.src = src;
        });
    }

    // 拉取图片并降采样后转为 data URL：
    // 移动端对大图解码/排版极慢，先缩到合适尺寸可显著降低 html2canvas 耗时与内存占用。
    // 缓存的是 Promise，预取与导出并发时只请求一次。
    function fetchDataURL(src, maxSide) {
        var key = src + "|" + maxSide;
        if (dataCache[key]) return dataCache[key];
        dataCache[key] = (async function () {
            var objectURL = null;
            try {
                var r = await fetchWithTimeout(src, 6000, {
                    mode: "cors",
                    credentials: "omit",
                });
                if (!r.ok) throw new Error("http " + r.status);
                var blob = await r.blob();
                var type = blob.type || "";
                objectURL = URL.createObjectURL(blob);
                var im = await loadImageElement(objectURL, 8000);
                var nw = im.naturalWidth || im.width;
                var nh = im.naturalHeight || im.height;
                if (!nw || !nh) throw new Error("bad image");
                var ratio = Math.min(1, maxSide / Math.max(nw, nh));
                var cw = Math.max(1, Math.round(nw * ratio));
                var ch = Math.max(1, Math.round(nh * ratio));
                var canvas = document.createElement("canvas");
                canvas.width = cw;
                canvas.height = ch;
                var ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("no canvas context");
                ctx.drawImage(im, 0, 0, cw, ch);
                var isJpeg = /jpe?g/i.test(type);
                var url = isJpeg
                    ? canvas.toDataURL("image/jpeg", 0.85)
                    : canvas.toDataURL("image/png");
                logInfo("图片已内联", {
                    src: src,
                    size: nw + "x" + nh + " → " + cw + "x" + ch,
                });
                return url;
            } finally {
                if (objectURL) URL.revokeObjectURL(objectURL);
            }
        })();
        dataCache[key].catch(function () {
            delete dataCache[key];
        });
        return dataCache[key];
    }

    function onImageFail(img) {
        var wrap = img.closest(".sp-card-cover");
        if (wrap) {
            wrap.classList.add("sp-card-cover--plain");
            wrap.textContent = "";
            var s = document.createElement("span");
            s.className = "sp-card-cover-site";
            s.textContent = data.site || data.title;
            wrap.appendChild(s);
        } else {
            img.remove();
        }
    }

    // 移动端极端兜底：去掉图片、二维码和热力图，降低 html2canvas 渲染难度
    function simplifyClone(clone) {
        var cover = clone.querySelector(".sp-card-cover");
        if (cover) {
            cover.classList.add("sp-card-cover--plain");
            cover.textContent = "";
            var s = document.createElement("span");
            s.className = "sp-card-cover-site";
            s.textContent = data.site || data.title;
            cover.appendChild(s);
        }
        Array.from(clone.querySelectorAll("img")).forEach(function (img) {
            img.remove();
        });
        Array.from(clone.querySelectorAll(".sp-heat")).forEach(function (h) {
            h.remove();
        });
        Array.from(clone.querySelectorAll(".sp-qr")).forEach(function (q) {
            q.textContent = "";
        });
    }

    // 将克隆体里的图片全部内联为 data URL，避免跨域污染 canvas；失败则降级
    // mobile 为 true 时不请求任何跨域图片，直接降级为纯色封面，彻底避免外部请求
    async function inlineImages(clone, mobile) {
        var degraded = false;
        var imgs = Array.from(clone.querySelectorAll("img"));
        var maxSide = 1400;
        var origin = location.origin;
        var tasks = imgs.map(async function (img) {
            var src = img.currentSrc || img.src;
            if (!src || src.indexOf("data:") === 0) return;
            var isExternal = src.indexOf("http") === 0 && src.indexOf(origin) !== 0;
            if (mobile && isExternal) {
                logInfo("移动端跳过外部图片", src);
                degraded = true;
                onImageFail(img);
                return;
            }
            try {
                var d = await fetchDataURL(src, maxSide);
                if (img.dataset.fit === "cover") {
                    // html2canvas 对 object-fit 支持不稳定，改用背景图
                    var box = document.createElement("div");
                    box.className = img.className;
                    box.setAttribute("role", "img");
                    box.style.backgroundImage = 'url("' + d + '")';
                    box.style.backgroundSize = "cover";
                    box.style.backgroundPosition = "center";
                    box.style.backgroundRepeat = "no-repeat";
                    img.replaceWith(box);
                } else {
                    img.removeAttribute("loading");
                    img.src = d;
                    if (img.decode) await img.decode().catch(function () {});
                }
            } catch (e) {
                degraded = true;
                onImageFail(img);
            }
        });
        // 整体兜底：即使外链图片一直不返回，也不能阻塞后续渲染
        try {
            await withTimeout(Promise.all(tasks), 15000, "inline timeout");
        } catch (e) {
            degraded = true;
        }
        return degraded;
    }

    // cloneNode 不会复制 canvas 内容：把二维码 canvas 换成 <img>
    function freezeCanvases(card, clone) {
        var src = card.querySelectorAll("canvas");
        var dst = clone.querySelectorAll("canvas");
        src.forEach(function (c, i) {
            var im = new Image();
            im.src = c.toDataURL("image/png");
            im.width = 76;
            im.height = 76;
            if (dst[i]) dst[i].replaceWith(im);
        });
        clone.querySelectorAll(".sp-qr-retry").forEach(function (b) {
            b.remove();
        });
    }

    function nextFrames() {
        return new Promise(function (resolve) {
            requestAnimationFrame(function () {
                requestAnimationFrame(resolve);
            });
        });
    }

    function dataURLToBlob(dataURL) {
        var parts = String(dataURL).split(",");
        var header = parts[0] || "";
        var mime = (header.match(/data:([^;]+)/) || [])[1] || "image/png";
        var binary = atob(parts[1] || "");
        var len = binary.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }

    // 部分移动端 WebView 的 canvas.toBlob 会返回 null 或直接不可用，
    // 这里统一回退到 toDataURL，避免导出在最后一步“生成失败”。
    function toBlob(canvas) {
        return new Promise(function (resolve, reject) {
            function fromDataURL() {
                try {
                    resolve(dataURLToBlob(canvas.toDataURL("image/png")));
                } catch (e) {
                    reject(e);
                }
            }
            if (typeof canvas.toBlob !== "function") {
                fromDataURL();
                return;
            }
            try {
                canvas.toBlob(function (b) {
                    if (b) {
                        resolve(b);
                    } else {
                        logWarn("canvas.toBlob 返回空，改用 toDataURL");
                        fromDataURL();
                    }
                }, "image/png");
            } catch (e) {
                logWarn("canvas.toBlob 不可用，改用 toDataURL", e && e.message);
                fromDataURL();
            }
        });
    }

    function withTimeout(promise, ms, message) {
        return new Promise(function (resolve, reject) {
            var timer = setTimeout(function () {
                reject(new Error(message || "timeout"));
            }, ms);
            promise.then(
                function (value) {
                    clearTimeout(timer);
                    resolve(value);
                },
                function (error) {
                    clearTimeout(timer);
                    reject(error);
                },
            );
        });
    }

    function safeName(s) {
        return String(s).replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 60) || "share";
    }

    function triggerDownload(url, filename, revoke) {
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.rel = "noopener";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            a.remove();
        }, 1000);
        if (revoke) {
            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 60000);
        }
    }

    function isMobileDevice() {
        var ua = navigator.userAgent || "";
        if (
            navigator.userAgentData &&
            typeof navigator.userAgentData.mobile === "boolean" &&
            navigator.userAgentData.mobile
        ) {
            return true;
        }
        if (/Android|iPhone|iPad|iPod|HarmonyOS|Mobile|Mobi/i.test(ua)) {
            return true;
        }
        // iPadOS 13+ 的 UA 伪装成 macOS，用触点数判断
        if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;
        return false;
    }

    function canShareFile(file) {
        if (!navigator.share) return false;
        if (typeof navigator.canShare !== "function") return true;
        try {
            return navigator.canShare({ files: [file] });
        } catch (e) {
            return false;
        }
    }

    // 没有系统分享能力时（如微信内置浏览器）：打开图片，让用户长按保存到相册
    function openImageForSave(url, filename) {
        var win = null;
        try {
            win = window.open(url, "_blank");
        } catch (e) {
            win = null;
        }
        if (!win) {
            triggerDownload(url, filename, false);
            return false;
        }
        return true;
    }

    async function deliverBlob(blob, filename) {
        var mobile = isMobileDevice();
        var file = null;
        if (typeof File === "function") {
            try {
                file = new File([blob], filename, {
                    type: blob.type || "image/png",
                });
            } catch (e) {
                logWarn("创建文件失败，改用下载", e && e.message);
            }
        }

        // 移动端优先走系统分享面板：用户可选择「存储图像 / 保存到相册」
        if (mobile && file && canShareFile(file)) {
            try {
                await navigator.share({
                    files: [file],
                    title: data.title,
                    text: data.title,
                });
                logInfo("已调用系统分享（可保存到相册）");
                return "shared";
            } catch (err) {
                if (err && err.name === "AbortError") {
                    logInfo("用户取消了系统分享");
                    return "cancelled";
                }
                logWarn("系统分享失败，尝试长按保存", err && err.name);
            }
        }

        var url = URL.createObjectURL(blob);
        if (mobile) {
            var opened = openImageForSave(url, filename);
            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 60000);
            logInfo(opened ? "已打开图片供长按保存" : "已触发文件下载");
            return opened ? "opened" : "downloaded";
        }

        triggerDownload(url, filename, true);
        return "downloaded";
    }

    async function deliver(canvas, filename) {
        var blob = await toBlob(canvas);
        return deliverBlob(blob, filename);
    }

    async function exportCard(cardId, filename, btn) {
        var card = document.getElementById(cardId);
        if (!card || (btn && btn.disabled)) return;
        var label = btn ? btn.querySelector("span") : null;
        var labelText = label ? label.textContent : "";
        if (btn) {
            btn.disabled = true;
            btn.setAttribute("aria-busy", "true");
        }
        if (label) label.textContent = "正在生成…";
        toast("正在生成图片…");
        var stage = null;
        var t0 = performance.now();
        function mark(label, extra) {
            if (!SP_DEBUG) return;
            var ms = Math.round(performance.now() - t0);
            console.info(
                "[article-share] +" + ms + "ms " + label,
                extra === undefined ? "" : extra,
            );
        }
        var isMobile = isMobileDevice();
        try {
            mark("开始导出", {
                cardId: cardId,
                width: Math.round(card.getBoundingClientRect().width),
                mobile: isMobile,
            });
            await loadLib("html2canvas");
            warmUpHtml2canvas();
            mark("html2canvas 就绪");
            // 二维码只是装饰，不阻塞导出：没准备好就导出不含二维码的版本
            if (!qrOK) renderQR();

            var width = Math.round(card.getBoundingClientRect().width);
            if (!width || width < 280) width = 360;
            width = Math.min(width, 640);
            stage = document.createElement("div");
            stage.className = "sp-scope sp-stage";
            stage.style.width = width + "px";
            var clone = card.cloneNode(true);
            clone.removeAttribute("id");
            clone.style.width = "100%";
            stage.appendChild(clone);
            document.body.appendChild(stage);
            mark("离屏舞台就绪", {
                width: width,
                height: Math.round(clone.getBoundingClientRect().height),
            });

            freezeCanvases(card, clone);
            var degraded = await inlineImages(clone, isMobile);
            mark("图片处理完成", { degraded: degraded });
            if (document.fonts && document.fonts.ready) {
                await Promise.race([
                    document.fonts.ready,
                    new Promise(function (resolve) {
                        setTimeout(resolve, 1500);
                    }),
                ]);
            }
            mark("字体就绪");
            await nextFrames();
            mark("渲染前帧就绪");

            // 移动端降低像素倍率：html2canvas 在低端手机上会因大画布长时间卡住
            var targetWidth = isMobile ? 900 : 1024;
            var scale = Math.min(
                isMobile ? 2 : 3,
                Math.max(isMobile ? 1.5 : 2, targetWidth / width),
            );

            function renderCanvas(scaleValue, timeoutMs) {
                return withTimeout(
                    window.html2canvas(clone, {
                        backgroundColor: "#f2f2ef",
                        scale: scaleValue,
                        useCORS: true,
                        allowTaint: false,
                        logging: false,
                        imageTimeout: 12000,
                        removeContainer: true,
                    }),
                    timeoutMs,
                    "generate timeout",
                );
            }

            mark("开始 html2canvas", {
                scale: scale,
                width: Math.round(clone.getBoundingClientRect().width),
                height: Math.round(clone.getBoundingClientRect().height),
            });
            var canvas;
            try {
                canvas = await renderCanvas(scale, 30000);
                mark("html2canvas 完成", {
                    width: canvas.width,
                    height: canvas.height,
                });
            } catch (renderErr) {
                logWarn("渲染失败，尝试降级", {
                    name: renderErr && renderErr.name,
                    message: renderErr && renderErr.message,
                });
                if (!/timeout/.test(String(renderErr && renderErr.message))) {
                    if (!isMobile) throw renderErr;
                }
                // 1) 先降倍率重试
                try {
                    await nextFrames();
                    canvas = await renderCanvas(1, 20000);
                    mark("降级重试完成", {
                        width: canvas.width,
                        height: canvas.height,
                    });
                } catch (retryErr) {
                    if (!isMobile) throw retryErr;
                    // 2) 移动端再失败：移除图片/热力图等重元素后重试
                    logWarn("降级重试仍失败，使用简化卡片重试", {
                        name: retryErr && retryErr.name,
                        message: retryErr && retryErr.message,
                    });
                    simplifyClone(clone);
                    await nextFrames();
                    canvas = await renderCanvas(1.5, 15000);
                    mark("简化重试完成", {
                        width: canvas.width,
                        height: canvas.height,
                    });
                }
            }

            var result = await deliver(canvas, filename);
            if (result === "shared") {
                toast(
                    degraded
                        ? "已调用系统保存（部分图片因跨域无法导出），请选择“存储图像”"
                        : "已调用系统保存，请选择“存储图像”保存到相册",
                );
            } else if (result === "cancelled") {
                toast("已取消保存");
            } else if (result === "opened") {
                toast("已打开图片，长按选择“保存图片/存储到相册”");
            } else {
                toast(
                    degraded
                        ? "已下载（部分图片因跨域无法导出，已使用默认样式）"
                        : "图片已下载",
                );
            }
            bumpStats();
            mark("交付完成", result);
        } catch (err) {
            console.error("[article-share] 导出失败", err);
            if (SP_DEBUG) {
                console.info(
                    "[article-share] 失败耗时 " +
                        Math.round(performance.now() - t0) +
                        "ms",
                );
            }
            var message = String(err && err.message);
            toast(
                /lib failed/.test(message)
                    ? "组件加载失败，请检查网络后重试"
                    : /timeout/.test(message)
                      ? "生成超时，请重试"
                      : "生成失败，请重试",
            );
        } finally {
            if (stage) stage.remove();
            if (btn) {
                btn.disabled = false;
                btn.removeAttribute("aria-busy");
            }
            if (label) label.textContent = labelText;
        }
    }

    function deliverURL(url, filename) {
        triggerDownload(url, filename, false);
    }

    async function downloadQR() {
        try {
            var url = await qrDataURL(data.url, 512, 2);
            deliverURL(url, "qrcode-" + safeName(data.title) + ".png");
            toast("二维码已下载");
        } catch (e) {
            toast("二维码生成失败，请检查网络后重试");
        }
    }

    /* ==========================================================
       分享渠道 / 复制链接 / 系统分享
       ========================================================== */
    function shareTo(platform) {
        var u = encodeURIComponent(data.url);
        var t = encodeURIComponent(data.title);
        var d = encodeURIComponent(data.desc);
        var link = "";
        switch (platform) {
            case "wechat":
                setTab("image");
                toast("微信：保存图片或扫描二维码即可分享");
                bumpStats();
                return;
            case "qq":
                link =
                    "https://connect.qq.com/widget/shareqq/index.html?url=" +
                    u + "&title=" + t + "&summary=" + d;
                break;
            case "weibo":
                link = "https://service.weibo.com/share/share.php?url=" + u + "&title=" + t;
                break;
            case "twitter":
                link = "https://twitter.com/intent/tweet?url=" + u + "&text=" + t;
                break;
            case "linkedin":
                link = "https://www.linkedin.com/sharing/share-offsite/?url=" + u;
                break;
        }
        if (link) {
            window.open(link, "_blank", "noopener,noreferrer,width=600,height=500");
            bumpStats();
        }
    }

    function copyLink() {
        var input = $("#spLinkInput");
        var done = function () {
            toast("链接已复制到剪贴板");
            bumpStats();
        };
        var fallback = function () {
            var ok = false;
            try {
                input.focus();
                input.select();
                input.setSelectionRange(0, 99999);
                ok = document.execCommand("copy");
            } catch (e) {
                /* ignore */
            }
            ok ? done() : toast("复制失败，请手动复制");
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(data.url).then(done).catch(fallback);
        } else {
            fallback();
        }
    }

    function nativeShare() {
        navigator
            .share({ title: data.title, text: data.desc, url: data.url })
            .then(bumpStats)
            .catch(function () {});
    }

    var nativeBtn = $("[data-action='native']");
    if (nativeBtn && navigator.share) nativeBtn.hidden = false;

    var linkInput = $("#spLinkInput");
    if (linkInput) {
        linkInput.addEventListener("focus", function () {
            linkInput.select();
        });
    }

    /* ==========================================================
       分享统计（localStorage，仅本机）
       ========================================================== */
    function readStats() {
        try {
            return JSON.parse(localStorage.getItem("shareStats") || "{}");
        } catch (e) {
            return {};
        }
    }
    function paintStats(p) {
        var a = document.getElementById("share-count");
        var b = document.getElementById("today-share");
        if (a) a.textContent = p.total;
        if (b) b.textContent = p.today;
    }
    function initStats() {
        var p = readStats()[location.pathname] || { total: 0, today: 0, lastDate: "" };
        if (p.lastDate !== new Date().toDateString()) p.today = 0;
        paintStats(p);
    }
    function bumpStats() {
        var today = new Date().toDateString();
        var all = readStats();
        var p = all[location.pathname] || { total: 0, today: 0, lastDate: "" };
        p.total += 1;
        p.today = p.lastDate === today ? p.today + 1 : 1;
        p.lastDate = today;
        all[location.pathname] = p;
        try {
            localStorage.setItem("shareStats", JSON.stringify(all));
        } catch (e) {
            /* ignore */
        }
        paintStats(p);
    }

    /* ==========================================================
       事件委托：data-action
       ========================================================== */
    // 触发按钮被悬停/触摸/聚焦时提前加载 html2canvas，避免首次导出等待
    var openTrigger = root.querySelector("[data-action='open']");
    if (openTrigger) {
        ["pointerenter", "touchstart", "focus"].forEach(function (ev) {
            openTrigger.addEventListener(ev, preloadHtml2canvas, {
                once: true,
                passive: true,
            });
        });
    }

    root.addEventListener("click", function (e) {
        if (e.target.closest("[data-action='open']")) openPanel();
    });

    overlay.addEventListener("click", function (e) {
        var tab = e.target.closest("[data-tab]");
        if (tab) {
            setTab(tab.dataset.tab);
            return;
        }
        var el = e.target.closest("[data-action]");
        if (!el) return;
        switch (el.dataset.action) {
            case "close":
                closePanel();
                break;
            case "share":
                shareTo(el.dataset.platform);
                break;
            case "copy":
                copyLink();
                break;
            case "native":
                nativeShare();
                break;
            case "len":
                setLen(el.dataset.len);
                break;
            case "download-image":
                exportCard("shareCard", "share-" + safeName(data.title) + ".png", el);
                break;
            case "download-content":
                exportCard("spContentCard", "content-" + safeName(data.title) + ".png", el);
                break;
            case "download-qr":
                downloadQR();
                break;
            case "retry-qr":
                renderQR();
                break;
        }
    });

    /* ---------- 初始化 ---------- */
    setTab("quick");
    setLen("mid");
})();
