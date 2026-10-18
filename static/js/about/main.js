/**
 * ========================================
 * 主入口 - 初始化所有模块
 * ========================================
 */

import { checkElements } from './dom.js';
import { initScrollState, handleScroll, handleResize } from './parallax.js';
import { initNavigation } from './navigation.js';
import { initAllAnimations } from './animations.js';
import { throttle, debounce } from './utils.js';

/**
 * 初始化应用
 */
function init() {
    document.documentElement.classList.add('has-js');
    console.log('🚀 初始化 3D 视差个人主页...');
    
    // 检查必要元素是否存在
    if (!checkElements()) {
        console.error('❌ 缺少必要的DOM元素');
        return;
    }
    
    // 初始化滚动状态
    initScrollState();
    
    // 初始化导航
    initNavigation();
    
    // 初始化动画效果
    initAllAnimations();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 触发一次滚动，初始化所有状态
    handleScroll();
    
    console.log('✅ 初始化完成');
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 滚动事件 - 使用节流优化性能
    window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
    
    // 窗口大小改变事件 - 使用防抖优化性能
    window.addEventListener('resize', debounce(handleResize, 250));
    
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
    version: '1.0.0'
};