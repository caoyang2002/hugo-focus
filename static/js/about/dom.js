/**
 * ========================================
 * DOM 元素获取和缓存
 * ========================================
 */

// 3D层级元素
export const layers = {
    deepBg: document.querySelector('.layer-deep-bg'),
    grid: document.querySelector('.layer-grid'),
    line: document.querySelector('.layer-line'),
    content: document.querySelector('.layer-content'),
    nav: document.querySelector('.layer-nav')
};

// 内容板块元素
export const sections = {
    about: document.querySelector('.section-about'),
    worksTrigger: document.querySelector('.section-works-trigger'),
    worksIllusion: document.querySelector('.section-works-illusion'),
    contact: document.querySelector('.section-contact')
};

// 作品相关元素
export const works = {
    text: document.querySelector('.works-text'),
    illusion: document.querySelector('.section-works-illusion'),
    container: document.querySelector('.works-container'),
    items: document.querySelectorAll('.work-item')
};

// 导航元素
export const nav = {
    desktop: document.querySelector('.nav-desktop'),
    mobile: document.querySelector('.nav-mobile'),
    items: document.querySelectorAll('.nav-item'),
    actions: document.querySelectorAll('.nav-action')
};

// 获取特定section ID的元素
export function getSectionById(id) {
    return document.getElementById(id) || sections[id];
}

// 检查元素是否存在
export function checkElements() {
    const missing = [];
    
    Object.entries(layers).forEach(([key, el]) => {
        if (!el) missing.push(`layer-${key}`);
    });
    
    Object.entries(sections).forEach(([key, el]) => {
        if (!el) missing.push(`section-${key}`);
    });
    
    if (missing.length > 0) {
        console.warn('Missing elements:', missing);
        return false;
    }
    
    return true;
}