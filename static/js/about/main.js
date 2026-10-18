/**
 * ========================================
 * 主入口 - 初始化所有模块
 * ========================================
 */

import { checkElements } from './dom.js';
import { initScrollState, handleScroll, handleResize } from './parallax.js';
import { initNavigation } from './navigation.js';
import { initAllAnimations } from './animations.js';
import { debounce } from './utils.js';
import { initWorkDialog } from './work-dialog.js';

/**
 * 初始化应用
 */
function init() {
    document.documentElement.classList.add('has-js');

    // 检查必要元素是否存在
    if (!checkElements()) {
        console.error('❌ 缺少必要的DOM元素');
        return;
    }

    initScrollState();
    initNavigation();
  initAllAnimations();

  initWorkDialog();
    bindEventListeners();

    // 触发一次滚动，初始化所有状态
    handleScroll();
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 滚动：用 requestAnimationFrame 合并到每帧一次（比 16ms 节流更顺滑）
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

    // 窗口大小改变事件 - 使用防抖优化性能
    window.addEventListener('resize', debounce(handleResize, 150));

    // 页面可见性改变事件
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            handleScroll();
        }
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
    version: '2.0.0'
};
