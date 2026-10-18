/**
 * ========================================
 * 主入口 - 初始化所有模块
 * ========================================
 */

import { checkElements, scenes } from './dom.js';
import { measure, handleScroll, handleResize, setActiveListener, getSceneScrollTop } from './parallax.js';
import { initNavigation, updateNavigation } from './navigation.js';
import { initAllAnimations } from './animations.js';
import { debounce } from './utils.js';
import { initWorkDialog } from './work-dialog.js';

/**
 * 初始化应用
 */
function init() {
    // 先打上 has-js：CSS 据此把「待擦入」的内容设为隐藏初始态
    document.documentElement.classList.add('has-js');

    if (!checkElements()) {
        console.error('❌ 缺少必要的DOM元素');
        document.documentElement.classList.remove('has-js');
        return;
    }

    setActiveListener(updateNavigation);
    measure();
    initNavigation();
    initAllAnimations();
    initWorkDialog();
    bindEventListeners();

    // 触发一次滚动，初始化所有状态
    handleScroll();

    // 带 #hash 打开时，定位到对应场景
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && scenes.some((s) => s.id === id)) {
        window.scrollTo({ top: getSceneScrollTop(id), behavior: 'auto' });
        handleScroll();
    }
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 滚动：合并到每帧一次
    let ticking = false;
    window.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
        },
        { passive: true }
    );

    // 内容尺寸会变化的时机都要重新测算：窗口、字体、图片、内容自身
    const remeasure = debounce(handleResize, 150);
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', handleResize);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(handleResize);
    }
    if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(remeasure);
        scenes.forEach((s) => ro.observe(s.body));
    }

    // 页面可见性改变
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) handleScroll();
    });
}

/**
 * DOM加载完成后初始化
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/**
 * 导出全局API（可选，用于调试）
 */
window.Portfolio3D = {
    handleScroll,
    handleResize,
    version: '3.0.0'
};
