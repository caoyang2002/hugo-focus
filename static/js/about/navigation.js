/**
 * ========================================
 * 导航控制模块
 * ========================================
 */

import { nav, scenes } from './dom.js';
import { getSceneScrollTop } from './parallax.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 当前激活的导航项
let currentActiveSection = scenes[0] ? scenes[0].id : 'about';

/**
 * 更新导航激活状态（桌面侧栏与移动端底栏同步）
 */
export function updateNavigation(activeSection) {
    if (currentActiveSection === activeSection) return;
    currentActiveSection = activeSection;

    nav.items.forEach((item) => {
        const isActive = item.dataset.section === activeSection;
        item.classList.toggle('active', isActive);
        if (isActive) {
            item.setAttribute('aria-current', 'location');
        } else {
            item.removeAttribute('aria-current');
        }
    });
}

/**
 * 获取当前激活的场景 id
 */
export function getCurrentSection() {
    return currentActiveSection;
}

/**
 * 滚动到某个场景（固定舞台场景要滚到「内容全部展示」的位置）
 */
export function goToScene(id, behavior) {
    if (!scenes.some((s) => s.id === id)) return;
    window.scrollTo({
        top: getSceneScrollTop(id),
        behavior: behavior || (reduceMotion ? 'auto' : 'smooth')
    });
}

function bindJump(el, id) {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        goToScene(id);
    });
}

/**
 * 初始化导航事件
 */
export function initNavigation() {
    // 目录项
    nav.items.forEach((item) => bindJump(item, item.dataset.section));

    // 侧栏 Action：只拦截页内锚点，「返回主页」等外部链接保持默认跳转
    nav.actions.forEach((action) => {
        const href = action.getAttribute('href') || '';
        if (href.startsWith('#')) bindJump(action, href.slice(1));
    });

    // 首屏「向下滚动」提示
    nav.jumps.forEach((el) => bindJump(el, el.dataset.jump));
}
