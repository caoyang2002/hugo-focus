/**
 * ========================================
 * 视差滚动核心模块
 * ========================================
 */

import { PARALLAX, THRESHOLD, EASING } from './config.js';
import { layers, works } from './dom.js';
import { updateNavigation } from './navigation.js';

// 滚动状态
let scrollState = {
    scrollTop: 0,
    windowHeight: 0,
    totalScroll: 0,
    scrollProgress: 0,
    isScrolling: false,
    scrollTimeout: null
};

/**
 * 初始化滚动状态
 */
export function initScrollState() {
    updateScrollMetrics();
}

/**
 * 更新滚动度量数据
 */
function updateScrollMetrics() {
    scrollState.windowHeight = window.innerHeight;
    scrollState.totalScroll = document.body.scrollHeight - scrollState.windowHeight;
}

/**
 * 获取当前滚动进度 (0-1)
 */
function getScrollProgress() {
    scrollState.scrollTop = window.scrollY;
    scrollState.scrollProgress = Math.max(0, Math.min(1, 
        scrollState.scrollTop / scrollState.totalScroll
    ));
    return scrollState.scrollProgress;
}

/**
 * 应用3D层级视差效果
 */
function applyParallax() {
    const baseOffset = scrollState.scrollTop * 0.6;
    
    // 背景层反向偏移
    if (layers.deepBg) {
        layers.deepBg.style.transform = 
            `translate3d(0, ${-baseOffset * PARALLAX.deepBg}px, var(--z-deep-bg))`;
    }
    
    if (layers.grid) {
        layers.grid.style.transform = 
            `translate3d(0, ${-baseOffset * PARALLAX.grid}px, var(--z-grid))`;
    }
    
    if (layers.line) {
        layers.line.style.transform = 
            `translate3d(0, ${-baseOffset * PARALLAX.line}px, var(--z-line))`;
    }
}

/**
 * 处理作品展示逻辑
 */
function handleWorksDisplay(progress) {
    if (!works.text || !works.illusion) return;
    
    // 阶段1：0 ~ 0.2 → 显示个人介绍，重置作品
    if (progress <= THRESHOLD.worksStart) {
        updateNavigation('about');
        resetWorks();
        works.text.style.transform = `translateZ(100px) scale(1)`;
    }
    // 阶段2：0.2 ~ 0.4 → 作品文字放大到35倍
    else if (progress > THRESHOLD.worksStart && progress <= THRESHOLD.worksFull) {
        updateNavigation('works');
        const stageProgress = (progress - THRESHOLD.worksStart) / 
                             (THRESHOLD.worksFull - THRESHOLD.worksStart);
        const scale = 1 + EASING.easeIn(stageProgress) * 34; // 1 → 35
        
        works.text.style.transform = `translateZ(100px) scale(${scale})`;
        works.text.style.opacity = 1 - stageProgress * 0.3;
        works.illusion.style.opacity = 0;
        works.illusion.style.pointerEvents = 'none';
    }
    // 阶段3：0.4 ~ 0.7 → 显示3D作品项
    else if (progress > THRESHOLD.worksFull && progress <= THRESHOLD.contactStart) {
        updateNavigation('works');
        works.text.style.transform = `translateZ(100px) scale(35)`;
        works.text.style.opacity = 0;
        works.illusion.style.opacity = 1;
        works.illusion.style.pointerEvents = 'all';
    }
    // 阶段4：0.7 ~ 0.9 → 作品项渐隐
    else if (progress > THRESHOLD.contactStart && progress <= THRESHOLD.contactFull) {
        updateNavigation('contact');
        const stageProgress = (progress - THRESHOLD.contactStart) / 
                             (THRESHOLD.contactFull - THRESHOLD.contactStart);
        works.illusion.style.opacity = 1 - EASING.easeOut(stageProgress);
        works.illusion.style.pointerEvents = 'none';
    }
    // 阶段5：0.9 ~ 1 → 完全显示联系方式
    else if (progress > THRESHOLD.contactFull) {
        updateNavigation('contact');
        works.illusion.style.opacity = 0;
    }
}

/**
 * 重置作品相关元素
 */
function resetWorks() {
    if (!works.text || !works.illusion) return;
    
    works.text.style.transform = `translateZ(100px) scale(1)`;
    works.text.style.opacity = 1;
    works.illusion.style.opacity = 0;
    works.illusion.style.pointerEvents = 'none';
}

/**
 * 主滚动处理函数
 */
export function handleScroll() {
    const progress = getScrollProgress();
    
    // 应用视差效果
    applyParallax();
    
    // 处理作品展示
    handleWorksDisplay(progress);
    
    // 标记滚动状态
    scrollState.isScrolling = true;
    clearTimeout(scrollState.scrollTimeout);
    scrollState.scrollTimeout = setTimeout(() => {
        scrollState.isScrolling = false;
    }, 150);
}

/**
 * 窗口大小改变处理
 */
export function handleResize() {
    updateScrollMetrics();
    handleScroll();
}

/**
 * 获取当前滚动状态
 */
export function getScrollState() {
    return { ...scrollState };
}

/**
 * 平滑滚动到指定位置
 */
export function smoothScrollTo(targetY, duration = 1000) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    
    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = EASING.easeInOut(progress);
        
        window.scrollTo(0, startY + distance * eased);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}