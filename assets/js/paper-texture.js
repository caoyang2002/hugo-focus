/* ==========================================================
   paper-texture.js
   程序化宣纸背景（移植自 papper_matrix.html）
   纹理由 Canvas 算法生成成无缝平铺图，作为 body 背景，
   随文章内容一起滚动，不再固定悬浮在视口。
   ========================================================== */
(function () {
    "use strict";

    var root = document.documentElement;
    var TILE = 1024; // 纹理块分辨率（可无缝平铺）
    var CACHE_KEY = "paper-tile-v2";
    var running = false;
    var currentObjectURL = null;

    /* =========================================================
       1. 随机 / 噪声工具
       ========================================================= */
    function mulberry32(a) {
        return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            var t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function hash2(x, y, s) {
        var n =
            Math.imul(x, 374761393) ^
            Math.imul(y, 668265263) ^
            Math.imul(s, 1442695041);
        n = Math.imul(n ^ (n >>> 13), 1274126177);
        n ^= n >>> 16;
        return (n >>> 0) / 4294967296;
    }

    /* 周期性值噪声：格点坐标对 period 取模，保证纹理块边界无缝 */
    function vnoise(x, y, period, seed) {
        var xi = Math.floor(x),
            yi = Math.floor(y);
        var xf = x - xi,
            yf = y - yi;
        var u = xf * xf * (3 - 2 * xf);
        var v = yf * yf * (3 - 2 * yf);
        var x0 = ((xi % period) + period) % period;
        var y0 = ((yi % period) + period) % period;
        var x1 = (x0 + 1) % period;
        var y1 = (y0 + 1) % period;
        var a = hash2(x0, y0, seed),
            b = hash2(x1, y0, seed);
        var c = hash2(x0, y1, seed),
            d = hash2(x1, y1, seed);
        var top = a + (b - a) * u;
        var bot = c + (d - c) * u;
        return top + (bot - top) * v;
    }

    /* =========================================================
       2. 底纹：高度场 + 伪法线光照
       ========================================================= */
    function buildPaper(seed, size) {
        var c = document.createElement("canvas");
        c.width = c.height = size;
        var gc = c.getContext("2d");

        var H = new Float32Array(size * size);

        var sG1 = seed + 11,
            sG2 = seed + 77,
            sG3 = seed + 333,
            sFine = seed + 555,
            sBump = seed + 777,
            sMid = seed + 999,
            sLow = seed + 2222;

        var i = 0;
        for (var y = 0; y < size; y++) {
            var yn = y / size;
            for (var x = 0; x < size; x++) {
                var xn = x / size;

                var g1 = vnoise(xn * 128, yn * 128, 128, sG1);
                var g2 = vnoise(xn * 256, yn * 256, 256, sG2);
                var g3 = vnoise(xn * 512, yn * 512, 512, sG3);
                var fine = hash2(x, y, sFine);
                var bump = vnoise(xn * 48, yn * 48, 48, sBump);
                var mid = vnoise(xn * 96, yn * 96, 96, sMid);

                H[i++] =
                    0.31 * g1 +
                    0.27 * g2 +
                    0.16 * g3 +
                    0.11 * fine +
                    0.09 * bump +
                    0.06 * mid;
            }
        }

        var img = gc.createImageData(size, size);
        var data = img.data;
        var p = 0;

        var Lx = -0.62,
            Ly = -0.62;
        var K = 1.6;

        for (var y2 = 0; y2 < size; y2++) {
            var yU = (y2 + size - 1) % size;
            var yD = (y2 + 1) % size;
            var rU = yU * size,
                rD = yD * size,
                rC = y2 * size;
            var yn2 = y2 / size;

            for (var x2 = 0; x2 < size; x2++) {
                var xL = (x2 + size - 1) % size;
                var xR = (x2 + 1) % size;

                var hc = H[rC + x2];
                var dx = H[rC + xR] - H[rC + xL];
                var dy = H[rD + x2] - H[rU + x2];

                var shade = 1 - K * (dx * Lx + dy * Ly);
                if (shade < 0.55) shade = 0.55;
                else if (shade > 1.45) shade = 1.45;

                var low = vnoise((x2 / size) * 8, yn2 * 8, 8, sLow);
                var ao = (0.88 + 0.24 * hc) * (0.96 + 0.08 * low);

                var v = shade * ao;
                if (v < 0.46) v = 0.46;
                else if (v > 1.09) v = 1.09;

                var R = 236 * v;
                var G = 230 * v;
                var B = 218 * v;

                if (v < 1) {
                    var d = (1 - v) * (1 - v);
                    R -= d * 26;
                    G -= d * 44;
                    B -= d * 74;
                }

                data[p++] = R;
                data[p++] = G;
                data[p++] = B;
                data[p++] = 255;
            }
        }

        gc.putImageData(img, 0, 0);
        return c;
    }

    /* =========================================================
       3. 纤维层：长纤维 + 短绒毛 + 团块 + 砂点
       ========================================================= */
    function buildFibers(c, size, seed) {
        var g = c.getContext("2d");
        var rnd = mulberry32(seed ^ 0x9e3779b9);

        g.lineCap = "round";
        g.lineJoin = "round";

        function strokeCurve(x0, y0, cx, cy, x1, y1, style, width) {
            var minX = Math.min(x0, cx, x1),
                maxX = Math.max(x0, cx, x1);
            var minY = Math.min(y0, cy, y1),
                maxY = Math.max(y0, cy, y1);
            var m = width + 2;

            var dxs = [0],
                dys = [0];
            if (minX - m < 0) dxs.push(size);
            if (maxX + m > size) dxs.push(-size);
            if (minY - m < 0) dys.push(size);
            if (maxY + m > size) dys.push(-size);

            g.strokeStyle = style;
            g.lineWidth = width;

            for (var i = 0; i < dxs.length; i++) {
                for (var j = 0; j < dys.length; j++) {
                    var dx = dxs[i],
                        dy = dys[j];
                    g.beginPath();
                    g.moveTo(x0 + dx, y0 + dy);
                    g.quadraticCurveTo(cx + dx, cy + dy, x1 + dx, y1 + dy);
                    g.stroke();
                }
            }
        }

        function wrapped(x, y, margin, fn) {
            var dxs = [0],
                dys = [0];
            if (x - margin < 0) dxs.push(size);
            if (x + margin > size) dxs.push(-size);
            if (y - margin < 0) dys.push(size);
            if (y + margin > size) dys.push(-size);

            for (var i = 0; i < dxs.length; i++) {
                for (var j = 0; j < dys.length; j++) {
                    var dx = dxs[i],
                        dy = dys[j];
                    if (dx === 0 && dy === 0) {
                        fn();
                    } else {
                        g.save();
                        g.translate(dx, dy);
                        fn();
                        g.restore();
                    }
                }
            }
        }

        /* --- 3.1 长纤维 --- */
        for (var i = 0; i < 900; i++) {
            var x0 = rnd() * size;
            var y0 = rnd() * size;
            var len = 40 + Math.pow(rnd(), 2.2) * 320;
            var ang = rnd() * Math.PI * 2;
            var x1 = x0 + Math.cos(ang) * len;
            var y1 = y0 + Math.sin(ang) * len;

            var bend = (rnd() - 0.5) * len * 0.55;
            var cx = (x0 + x1) / 2 + Math.cos(ang + Math.PI / 2) * bend;
            var cy = (y0 + y1) / 2 + Math.sin(ang + Math.PI / 2) * bend;

            var bright = rnd() < 0.45;
            var a = bright ? 0.09 + rnd() * 0.22 : 0.04 + rnd() * 0.13;
            var style = bright
                ? "rgba(255,253,246," + a.toFixed(3) + ")"
                : "rgba(140,122,94," + a.toFixed(3) + ")";

            var w = 0.4 + rnd() * rnd() * 2.8;
            strokeCurve(x0, y0, cx, cy, x1, y1, style, w);
        }

        /* --- 3.2 短绒毛 --- */
        for (var k = 0; k < 2200; k++) {
            var sx = rnd() * size;
            var sy = rnd() * size;
            var sl = 4 + Math.pow(rnd(), 1.6) * 46;
            var sa = rnd() * Math.PI * 2;
            var ex = sx + Math.cos(sa) * sl;
            var ey = sy + Math.sin(sa) * sl;
            var sb = (rnd() - 0.5) * sl * 0.9;
            var scx = (sx + ex) / 2 + Math.cos(sa + Math.PI / 2) * sb;
            var scy = (sy + ey) / 2 + Math.sin(sa + Math.PI / 2) * sb;

            var sbright = rnd() < 0.5;
            var sa2 = sbright ? 0.05 + rnd() * 0.14 : 0.03 + rnd() * 0.08;
            var sstyle = sbright
                ? "rgba(255,254,248," + sa2.toFixed(3) + ")"
                : "rgba(148,130,102," + sa2.toFixed(3) + ")";

            strokeCurve(sx, sy, scx, scy, ex, ey, sstyle, 0.4 + rnd() * 1.1);
        }

        /* --- 3.3 纤维结 / 小团块 --- */
        for (var m = 0; m < 70; m++) {
            var bx = rnd() * size;
            var by = rnd() * size;
            var n = 3 + ((rnd() * 6) | 0);
            for (var q = 0; q < n; q++) {
                var rr = 3 + rnd() * 20;
                var a0 = rnd() * Math.PI * 2;
                var a1 = a0 + (0.5 + rnd()) * Math.PI;
                var ba = 0.05 + rnd() * 0.08;
                var bw = 0.5 + rnd() * 1.2;
                (function (rr, a0, a1, ba, bw) {
                    wrapped(bx, by, rr + 4, function () {
                        g.strokeStyle = "rgba(146,128,100," + ba.toFixed(3) + ")";
                        g.lineWidth = bw;
                        g.beginPath();
                        g.arc(bx, by, rr, a0, a1);
                        g.stroke();
                    });
                })(rr, a0, a1, ba, bw);
            }
        }

        /* --- 3.4 杂质小点 --- */
        for (var s = 0; s < 800; s++) {
            var px = rnd() * size;
            var py = rnd() * size;
            var pr = 0.3 + Math.pow(rnd(), 2) * 1.8;
            var pa = 0.03 + rnd() * 0.09;
            (function (px, py, pr, pa) {
                wrapped(px, py, pr + 2, function () {
                    g.fillStyle = "rgba(110,92,66," + pa.toFixed(3) + ")";
                    g.beginPath();
                    g.arc(px, py, pr, 0, Math.PI * 2);
                    g.fill();
                });
            })(px, py, pr, pa);
        }

        /* --- 3.5 极亮小凸起（纤维头） --- */
        for (var t = 0; t < 300; t++) {
            var tx = rnd() * size;
            var ty = rnd() * size;
            var tr = 0.5 + rnd() * 1.4;
            var ta = 0.12 + rnd() * 0.3;
            (function (tx, ty, tr, ta) {
                wrapped(tx, ty, tr + 2, function () {
                    g.fillStyle = "rgba(255,255,250," + ta.toFixed(3) + ")";
                    g.beginPath();
                    g.arc(tx, ty, tr, 0, Math.PI * 2);
                    g.fill();
                });
            })(tx, ty, tr, ta);
        }

        /* --- 3.6 像素级砂点 --- */
        var brightStyles = [],
            darkStyles = [];
        for (var q2 = 0; q2 < 8; q2++) {
            brightStyles.push(
                "rgba(255,255,250," + (0.1 + q2 * 0.038).toFixed(3) + ")",
            );
            darkStyles.push(
                "rgba(120,102,78," + (0.06 + q2 * 0.024).toFixed(3) + ")",
            );
        }
        var SAND = 14000;
        for (var z = 0; z < SAND; z++) {
            var zx = (rnd() * size) | 0;
            var zy = (rnd() * size) | 0;
            g.fillStyle =
                rnd() < 0.5
                    ? brightStyles[(rnd() * 8) | 0]
                    : darkStyles[(rnd() * 8) | 0];
            g.fillRect(zx, zy, 1, 1);
        }
    }

    function generateTile(seed) {
        var tile = buildPaper(seed, TILE);
        buildFibers(tile, TILE, seed);
        return tile;
    }

    /* =========================================================
       4. 应用到整页长度的背景层（绝对定位，随文档一起滚动）
       说明：iOS Safari 对 body 背景的 background-attachment 支持有缺陷，
       会导致背景像 fixed 一样不滚动；因此改用铺满文档高度的绝对定位层。
       ========================================================= */
    var paperEl = null;

    function ensurePaperEl() {
        if (paperEl && paperEl.isConnected) return paperEl;
        paperEl = document.getElementById("paper-bg");
        if (!paperEl) {
            paperEl = document.createElement("div");
            paperEl.id = "paper-bg";
            paperEl.setAttribute("aria-hidden", "true");
            document.body.insertBefore(paperEl, document.body.firstChild);
        }
        return paperEl;
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

    // 用 Blob URL 而不是超长 data URL 作为背景，兼容性更好（某些浏览器会丢弃超大 data URL）
    function applyDataURL(dataURL) {
        if (!dataURL || !document.body) return;
        var el = ensurePaperEl();
        var bg = "";
        try {
            if (currentObjectURL) {
                try {
                    URL.revokeObjectURL(currentObjectURL);
                } catch (e) {}
                currentObjectURL = null;
            }
            currentObjectURL = URL.createObjectURL(dataURLToBlob(dataURL));
            bg = 'url("' + currentObjectURL + '")';
        } catch (e) {
            bg = 'url("' + dataURL + '")';
        }
        el.style.backgroundImage = bg;
        el.style.backgroundRepeat = "repeat";
        el.style.backgroundPosition = "top left";
        el.style.backgroundSize = "auto";
        root.classList.add("has-paper");
    }

    function startGenerate() {
        if (running) return;
        running = true;
        var seed = (Math.random() * 1e9) | 0;
        var t0 = performance.now();
        var tile;
        try {
            tile = generateTile(seed);
        } catch (e) {
            console.warn("[paper] 纹理生成失败", e);
            running = false;
            return;
        }

        var url = "";
        try {
            url = tile.toDataURL("image/webp", 0.9);
            if (url.indexOf("data:image/webp") !== 0) {
                url = tile.toDataURL("image/png");
            }
        } catch (e) {
            try {
                url = tile.toDataURL("image/png");
            } catch (e2) {
                url = "";
            }
        }

        if (url) {
            applyDataURL(url);
            try {
                sessionStorage.setItem(CACHE_KEY, url);
            } catch (e) {
                /* 缓存失败不影响显示 */
            }
            console.info(
                "[paper] 宣纸纹理生成完成：" +
                    Math.round(performance.now() - t0) +
                    "ms",
            );
        }
        running = false;
    }

    function start() {
        var cached = null;
        try {
            cached = sessionStorage.getItem(CACHE_KEY);
        } catch (e) {
            cached = null;
        }
        if (cached) {
            applyDataURL(cached);
            return;
        }
        // 避免阻塞首屏：空闲时再生成
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(startGenerate, { timeout: 2000 });
        } else {
            setTimeout(startGenerate, 200);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
