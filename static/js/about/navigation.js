/**
 * ========================================
 * 导航控制模块
 * ========================================
 */

import { nav } from './dom.js';
import { handleScroll, getSceneScrollTop } from './parallax.js';

// 当前激活的导航项
let currentActiveSection = 'about';

/**
 * 更新导航激活状态
 */
export function updateNavigation(activeSection) {
    if (currentActiveSection === activeSection) return;

    currentActiveSection = activeSection;

    nav.items.forEach(item => {
        const isActive = item.dataset.section === activeSection;
        item.classList.toggle('active', isActive);
        if (isActive) {
            item.setAttribute('aria-current', 'true');
        } else {
            item.removeAttribute('aria-current');
        }
    });
}

/**
 * 获取当前激活的section
 */
export function getCurrentSection() {
    return currentActiveSection;
}

/**
 * 滚动到某个场景（作品/联系是固定舞台，要滚到正确的进度位置）
 */
function goToScene(id, mode) {
    window.scrollTo({ top: getSceneScrollTop(id, mode), behavior: 'smooth' });
    setTimeout(() => handleScroll(), 100);
}

/**
 * 导航项点击处理
 */
function handleNavClick(e) {
    e.preventDefault();
    goToScene(this.dataset.section, 'start');
}

/**
 * 初始化导航事件
 */
export function initNavigation() {
    nav.items.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });

    // 导航Action按钮：「浏览作品」直接到卡片展示位置
    nav.actions.forEach(action => {
        action.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                goToScene(href.substring(1), 'cards');
            }
        });
    });
}

/**
 * 添加导航项
 */
export function addNavItem(section, label, icon) {
    const navItem = document.createElement('a');
    navItem.href = `#${section}`;
    navItem.className = 'nav-item';
    navItem.dataset.section = section;
    navItem.innerHTML = `
        <i class="fa ${icon}"></i>
        <span>${label}</span>
    `;
    navItem.addEventListener('click', handleNavClick);

    if (nav.desktop) {
        nav.desktop.appendChild(navItem);
    }
}

/**
 * 移除导航项
 */
export function removeNavItem(section) {
    nav.items.forEach(item => {
        if (item.dataset.section === section) {
            item.remove();
        }
    });
}
