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
    worksTrigger: document.querySelector('.section-works-trigger'), // 作品「轨道」（高 500vh）
    worksIllusion: document.querySelector('.section-works-illusion'),
    contact: document.querySelector('.section-contact')              // 联系「轨道」（高 200vh）
};
// 技能相关元素
export const about = {
  section: document.querySelector('.section-about'),
  title: document.querySelector('.about-title'),
  bio: document.querySelector('.about-bio'),
  avatar: document.querySelector('.avatar'),
  skills: document.querySelector('.skills-container'),
  skillItems: document.querySelectorAll('.skill-item'),
};
// 作品相关元素
export const works = {
    stage: document.querySelector('.works-stage'),                   // 固定舞台
    text: document.querySelector('.works-text'),

    illusion: document.querySelector('.section-works-illusion'),
    container: document.querySelector('.works-container'),
    items: document.querySelectorAll('.work-item'),
    progress: document.querySelector('[data-works-progress]')
};

// 联系相关元素
export const contact = {
    track: document.querySelector('.section-contact'),
    stage: document.querySelector('.contact-stage'),
    title: document.querySelector('.contact-title'),
    items: document.querySelectorAll('.contact-item')
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

    if (!works.stage) missing.push('works-stage');
    if (!contact.stage) missing.push('contact-stage');

    if (missing.length > 0) {
        console.warn('Missing elements:', missing);
        return false;
    }

    return true;
}
