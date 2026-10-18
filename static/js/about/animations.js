/**
 * ========================================
 * 动画效果模块
 * ========================================
 * 场景内的所有动画（放大淡出、擦入、上移）都由 parallax.js 按滚动位置驱动。
 * 首屏入场、下滑提示是纯 CSS 动画；这里只负责打上「页面已加载」标记。
 *
 * 注：旧版的 3D 卡片倾斜 / 依次淡入会写内联 transform / opacity，
 *     与瑞士风格的平面版式及场景引擎冲突，已移除。
 */

export function initPageLoadAnimation() {
    const mark = () => document.body.classList.add('loaded');
    if (document.readyState === 'complete') {
        mark();
    } else {
        window.addEventListener('load', mark, { once: true });
    }
}

/**
 * 初始化所有动画效果
 */
export function initAllAnimations() {
    initPageLoadAnimation();
}
