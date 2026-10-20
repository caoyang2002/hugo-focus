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
    var preview = overlay.querySelector("#spPreview");
    var tabs = Array.from(overlay.querySelectorAll("[data-tab]"));
    var panes = Array.from(overlay.querySelectorAll("[data-pane]"));

    var $ = function (sel, el) {
        return (el || overlay).querySelector(sel);
    };
    var $$ = function (sel, el) {
        return Array.from((el || overlay).querySelectorAll(sel));
    };

    var UA_NO_DOWNLOAD =
        /MicroMessenger|iPhone|iPad|iPod|QQBrowser|MQQBrowser|Weibo|UCBrowser|Quark/i.test(
            navigator.userAgent,
        );

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
                // "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
                // "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js",
                // "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
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
                    await loadScript(lib.srcs[i], 8000);
                    if (lib.test()) return;
                } catch (e) {
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

    var qrWin = null;
    function loadQRLib() {
        if (qrWin) return Promise.resolve(qrWin);
        if (loadQRLib.pending) return loadQRLib.pending;
        loadQRLib.pending = (async function () {
            var frame = document.createElement("iframe");
            frame.setAttribute("aria-hidden", "true");
            frame.tabIndex = -1;
            frame.style.cssText =
                "position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none";
            frame.srcdoc = "<!doctype html><html><head></head><body></body></html>";
            await new Promise(function (resolve) {
                frame.onload = resolve;
                document.body.appendChild(frame);
            });
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
        if (!qrOK) renderQR();
        var close = $("[data-action='close']");
        if (close) close.focus({ preventScroll: true });
    }

    function closePanel() {
        hidePreview();
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        lockScroll(false);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function trapFocus(e) {
        if (e.key !== "Tab") return;
        var scope = preview && !preview.hidden ? preview : dialog;
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
            if (preview && !preview.hidden) hidePreview();
            else closePanel();
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
    var fullText = srcEl ? (srcEl.content || srcEl).textContent || "" : "";
    var paragraphs = fullText
        .split(/\r?\n+/)
        .map(function (s) {
            return s.replace(/\s+/g, " ").trim();
        })
        .filter(Boolean);

    function renderContent() {
        var body = $("#spContentBody");
        var more = $("#spContentMore");
        if (!body) return;
        body.textContent = "";

        if (!paragraphs.length) {
            var p0 = document.createElement("p");
            p0.textContent = data.desc || data.title;
            body.appendChild(p0);
            more.hidden = true;
            return;
        }

        var limit = LENS[lenKey];
        var used = 0;
        var truncated = false;

        for (var i = 0; i < paragraphs.length; i++) {
            var para = paragraphs[i];
            if (used >= limit) {
                truncated = true;
                break;
            }
            var text = para;
            if (used + para.length > limit) {
                text = para.slice(0, limit - used).replace(/[，,、；;：:\s]+$/, "") + "…";
                truncated = true;
            }
            var isHead = para.length <= 24 && !/[。！？.!?：:；;，,]$/.test(para);
            var el = document.createElement(isHead ? "h5" : "p");
            el.textContent = text;
            body.appendChild(el);
            used += para.length;
            if (truncated) break;
        }
        // 避免孤立小标题落在末尾
        while (body.lastElementChild && body.lastElementChild.tagName === "H5") {
            body.lastElementChild.remove();
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

    async function fetchDataURL(src) {
        if (dataCache[src]) return dataCache[src];
        var r = await fetch(src, { mode: "cors", credentials: "omit" });
        if (!r.ok) throw new Error("http " + r.status);
        var blob = await r.blob();
        var url = await new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function () {
                resolve(fr.result);
            };
            fr.onerror = reject;
            fr.readAsDataURL(blob);
        });
        dataCache[src] = url;
        return url;
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

    // 将克隆体里的图片全部内联为 data URL，避免跨域污染 canvas；失败则降级
    async function inlineImages(clone) {
        var degraded = false;
        var imgs = Array.from(clone.querySelectorAll("img"));
        await Promise.all(
            imgs.map(async function (img) {
                var src = img.currentSrc || img.src;
                if (!src || src.indexOf("data:") === 0) return;
                try {
                    var d = await fetchDataURL(src);
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
            }),
        );
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

    function toBlob(canvas) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (b) {
                b ? resolve(b) : reject(new Error("blob"));
            }, "image/png");
        });
    }

    function safeName(s) {
        return String(s).replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 60) || "share";
    }

    async function deliver(canvas, filename) {
        if (UA_NO_DOWNLOAD) {
            showPreview(canvas.toDataURL("image/png"));
            return;
        }
        var blob = await toBlob(canvas);
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 5000);
    }

    async function exportCard(cardId, filename, btn) {
        var card = document.getElementById(cardId);
        if (!card || (btn && btn.disabled)) return;
        if (btn) btn.disabled = true;
        toast("正在生成图片…");
        var stage = null;
        try {
            await loadLib("html2canvas");
            if (!qrOK) await renderQR();

            var width = 640;
            stage = document.createElement("div");
            stage.className = "sp-scope sp-stage";
            stage.style.width = width + "px";
            var clone = card.cloneNode(true);
            clone.removeAttribute("id");
            clone.style.width = "100%";
            stage.appendChild(clone);
            document.body.appendChild(stage);

            freezeCanvases(card, clone);
            var degraded = await inlineImages(clone);
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            await nextFrames();

            var canvas = await window.html2canvas(clone, {
                backgroundColor: "#f2f2ef",
                scale: Math.min(3, Math.max(2, window.devicePixelRatio || 1)),
                useCORS: true,
                allowTaint: false,
                logging: false,
            });

            await deliver(canvas, filename);
            toast(
                degraded
                    ? "已生成（部分图片因跨域无法导出，已使用默认样式）"
                    : UA_NO_DOWNLOAD
                      ? "请长按图片保存"
                      : "图片已下载",
            );
            bumpStats();
        } catch (err) {
            console.error("[article-share]", err);
            toast(
                /lib failed/.test(String(err && err.message))
                    ? "组件加载失败，请检查网络后重试"
                    : "生成失败，请重试",
            );
        } finally {
            if (stage) stage.remove();
            if (btn) btn.disabled = false;
        }
    }

    function deliverURL(url, filename) {
        if (UA_NO_DOWNLOAD) {
            showPreview(url);
            return;
        }
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async function downloadQR() {
        try {
            var url = await qrDataURL(data.url, 512, 2);
            deliverURL(url, "qrcode-" + safeName(data.title) + ".png");
            toast(UA_NO_DOWNLOAD ? "请长按二维码保存" : "二维码已下载");
        } catch (e) {
            toast("二维码生成失败，请检查网络后重试");
        }
    }

    /* ---------- 预览层 ---------- */
    function showPreview(dataURL) {
        if (!preview) return;
        var img = $(".sp-preview-body img", preview);
        img.src = dataURL;
        preview.hidden = false;
        var b = $("[data-action='preview-close']", preview);
        if (b) b.focus();
    }
    function hidePreview() {
        if (!preview || preview.hidden) return;
        preview.hidden = true;
        var img = $(".sp-preview-body img", preview);
        if (img) img.removeAttribute("src");
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
            case "preview-close":
                hidePreview();
                break;
        }
    });

    /* ---------- 初始化 ---------- */
    setTab("quick");
    setLen("mid");
})();
