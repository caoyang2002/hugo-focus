/**
 * ========================================
 * 导航控制模块
 * ========================================
 */

import { nav, getSectionById } from './dom.js';
import { handleScroll } from './parallax.js';

// 当前激活的导航项
let currentActiveSection = 'about';

/**
 * 更新导航激活状态
 */
export function updateNavigation(activeSection) {
    if (currentActiveSection === activeSection) return;
    
    currentActiveSection = activeSection;
    
    nav.items.forEach(item => {
        const section = item.dataset.section;
        if (section === activeSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
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
 * 导航项点击处理
 */
function handleNavClick(e) {
    e.preventDefault();
    
    const target = this.dataset.section;
    const targetElement = getSectionById(target);
    
    if (targetElement) {
        // 平滑滚动到目标
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // 强制更新滚动状态
        setTimeout(() => handleScroll(), 100);
    }
}

/**
 * 初始化导航事件
 */
export function initNavigation() {
    nav.items.forEach(item => {
        item.addEventListener('click', handleNavClick);
        
        // 添加hover效果音效（可选）
        item.addEventListener('mouseenter', () => {
            // 可以在这里添加音效
        });
    });
    
    // 导航Action按钮特殊处理
    nav.actions.forEach(action => {
        action.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果是锚点链接，使用平滑滚动
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = href.substring(1);
                const targetElement = getSectionById(target);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
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