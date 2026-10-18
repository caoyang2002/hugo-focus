/**
 * ========================================
 * 滚动场景核心模块
 * ========================================
 * 每个场景 = 一条高轨道（.scene）+ 钉在屏幕上的舞台（.scene-stage, sticky）。
 * 轨道高度按内容测算，场景内的所有动画都由「该场景已滚过的像素 s」决定，
 * 所以上下滚动完全对称、连续：
 *
 *   s: 0 ──────── Z ───────────── panStart ─────── panEnd ── P
 *      标题放大淡出   内容逐项擦入      内容随滚动上移    停留
 *
 * 场景之间：下一条轨道与上一条重叠 100vh，下一个舞台（实色背景）从下方覆盖上来，
 * 覆盖期间上一场景保持完整展示。
 */

import { SCENE as S, EASING } from './config.js';
import { scenes } from './dom.js';
import { clamp, seg } from './utils.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = EASING.easeInOut;

let vh = window.innerHeight;
let activeListener = () => {};

/** 注册「当前场景变化」回调（由 main.js 连接到导航，避免模块循环依赖） */
export function setActiveListener(fn) {
    activeListener = fn;
}

/**
 * 测算所有场景：视窗高度、内容溢出、每一项的擦入时间点、轨道总高度
 * 在初始化、窗口变化、字体/图片加载后调用
 */
export function measure() {
    vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const last = scenes.length - 1;

    scenes.forEach((sc, idx) => {
        const availH = sc.viewport.clientHeight;
        // offsetHeight 是布局高度，不受上移 transform 影响
        const overflow = Math.max(0, Math.ceil(sc.body.offsetHeight - availH));
        const Z = sc.title ? Math.round(S.zoom * vh) : 0;

        const bodyTop = sc.body.getBoundingClientRect().top;
        const limit = availH * S.inView;
        const stag = (sc.itemEls.length > S.denseAfter ? S.staggerDense : S.stagger) * vh;
        const dur = S.itemDur * vh;

        // 首屏可见的项：标题放大过程中按顺序错峰擦入
        let rank = 0;
        let visEnd = Z;
        const items = sc.itemEls.map((el) => {
            const top = el.getBoundingClientRect().top - bodyTop;
            const it = { el, mode: el.dataset.reveal || 'up', top, off: top >= limit, start: 0, dur };
            if (!it.off) {
                it.start = Z * S.itemStart + rank * stag;
                rank += 1;
                visEnd = Math.max(visEnd, it.start + dur);
            }
            return it;
        });

        // 首屏之外的项：内容上移到它进入视窗时再擦入
        const panStart = visEnd;
        let maxEnd = visEnd;
        items.forEach((it) => {
            if (it.off) it.start = panStart + (it.top - limit);
            maxEnd = Math.max(maxEnd, it.start + dur);
        });

        const hold = sc.title || items.length ? S.hold * vh : 0;
        const P = Math.round(Math.max(panStart + overflow + hold, items.length ? maxEnd + 0.15 * vh : 0));

        sc.items = items;
        sc.m = { availH, overflow, Z, panStart, P };

        // 轨道高度 = 舞台 + 动画行程 +（有下一场景时）被覆盖的 100vh
        sc.el.style.height = `${vh + P + (idx < last ? vh : 0)}px`;
    });
}

/** 擦入：up = 自下而上；right = 自左向右 */
function wipe(el, mode, e) {
    if (e >= 1) {
        el.style.clipPath = 'none';
        return;
    }
    const p = ((1 - e) * 100).toFixed(2);
    el.style.clipPath = mode === 'right' ? `inset(0 ${p}% 0 0)` : `inset(${p}% 0 0 0)`;
}

/** 渲染单个场景。rect 为轨道的 getBoundingClientRect() */
function renderScene(sc, rect) {
    const m = sc.m;
    if (!m) return;

    // 舞台完全不在屏幕附近：跳过（回到屏幕前会重新按位置渲染）
    if (rect.bottom < -80 || rect.top > vh + 80) return;

    const raw = -rect.top;
    const s = clamp(raw, 0, m.P);

    // 1) 标题：屏幕正中放大 → 淡出
    if (sc.title) {
        const zoom = reduceMotion ? 1 : Math.pow(S.maxScale, ease(seg(s, 0, m.Z)));
        const opacity = 1 - ease(seg(s, m.Z * S.fadeFrom, m.Z));
        sc.title.style.transform = `scale(${zoom.toFixed(4)})`;
        sc.title.style.opacity = opacity.toFixed(3);
        sc.title.style.visibility = opacity <= 0.002 ? 'hidden' : 'visible';
    }

    // 2) 墨黑面（作品）：纸白 → 墨黑
    if (sc.tone === 'ink') {
        const k = ease(seg(s, m.Z * S.veilStart, m.Z * S.veilEnd));
        sc.stage.style.setProperty('--veil', k.toFixed(3));
        const dark = k > S.darkAt;
        if (dark !== sc.dark) {
            sc.stage.classList.toggle('is-dark', dark);
            sc.dark = dark;
        }
    }

    // 3) 内容上移（内容比视窗高时）
    const pan = clamp(s - m.panStart, 0, m.overflow);

    if (sc.hero) {
        // 首屏被下一场景覆盖时：轻微上移 + 淡出
        const x = seg(raw, m.P, m.P + vh);
        sc.body.style.transform = `translate3d(0, ${(-pan - x * 0.06 * vh).toFixed(1)}px, 0)`;
        sc.body.style.opacity = (1 - S.heroExit * x).toFixed(3);
        if (sc.hint) sc.hint.style.opacity = (1 - seg(raw, 0, 0.2 * vh)).toFixed(3);
    } else {
        sc.body.style.transform = pan ? `translate3d(0, ${(-pan).toFixed(1)}px, 0)` : 'none';
    }

    // 4) 逐项擦入
    for (const it of sc.items) {
        wipe(it.el, it.mode, ease(seg(s, it.start, it.start + it.dur)));
    }

    // 5) 标题还在放大时，内容不可点击 / 聚焦
    const ready = s >= m.Z * S.readyAt;
    if (ready !== sc.ready) {
        sc.body.inert = !ready;
        sc.ready = ready;
    }

    // 6) 场景进度
    if (sc.progress) {
        const pct = m.P > 0 ? Math.round((s / m.P) * 100) : 0;
        sc.progress.textContent = String(pct).padStart(3, '0');
    }
}

/**
 * 主滚动处理函数
 */
export function handleScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    const docProgress = clamp(window.scrollY / max, 0, 1);
    document.documentElement.style.setProperty('--scroll', docProgress.toFixed(4));

    const rects = scenes.map((sc) => sc.el.getBoundingClientRect());
    scenes.forEach((sc, i) => renderScene(sc, rects[i]));

    // 导航高亮：最后一个「顶边已越过视口中线」的场景
    let active = scenes[0].id;
    for (let i = 0; i < scenes.length; i++) {
        if (rects[i].top < vh * 0.5) active = scenes[i].id;
    }
    activeListener(active);
}

/**
 * 窗口大小 / 字体 / 图片变化后重新测算
 */
export function handleResize() {
    measure();
    handleScroll();
}

/**
 * 计算某场景的「目标滚动位置」：内容刚好全部展示的位置（首屏为顶部）
 */
export function getSceneScrollTop(id) {
    const sc = scenes.find((s) => s.id === id);
    if (!sc || !sc.m) return 0;
    const top = sc.el.getBoundingClientRect().top + window.scrollY;
    return Math.round(top + (sc.hero ? 0 : Math.min(sc.m.panStart, sc.m.P)));
}
