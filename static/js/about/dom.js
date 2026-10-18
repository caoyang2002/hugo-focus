/**
 * ========================================
 * DOM 元素获取和缓存
 * ========================================
 */

const q = (sel, root = document) => root.querySelector(sel);
const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * 场景列表（与页面从上到下的顺序一致）
 * 每个场景：轨道 el / 舞台 stage / 标题 title / 视窗 viewport / 内容 body / 逐项擦入的 itemEls
 * m（测算结果）、items（带时间线的项）由 parallax.js 的 measure() 填充
 */
export const scenes = qa('.scene').map((el) => ({
    id: el.id,
    el,
    hero: el.dataset.type === 'hero',
    tone: el.dataset.tone || 'paper',
    stage: q('.scene-stage', el),
    title: q('.scene-title', el),
    viewport: q('.scene-viewport', el),
    body: q('.scene-body', el),
    itemEls: qa('[data-reveal]', el),
    progress: q('[data-scene-progress]', el),
    hint: q('[data-scroll-hint]', el),
    dark: null,
    ready: null,
    m: null,
    items: []
}));

// 导航元素（桌面侧栏 + 移动端底栏）
export const nav = {
    items: qa('.nav-item'),
    actions: qa('.nav-action'),
    jumps: qa('[data-jump]')
};

// 检查必要元素是否存在
export function checkElements() {
    if (scenes.length === 0) {
        console.warn('Missing elements: .scene');
        return false;
    }
    const broken = scenes.filter((s) => !s.stage || !s.viewport || !s.body);
    if (broken.length) {
        console.warn('Incomplete scenes:', broken.map((s) => s.id));
        return false;
    }
    return true;
}
