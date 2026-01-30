/**
 * ========================================
 * 工具函数模块
 * ========================================
 */

/**
 * 节流函数
 */
export function throttle(func, delay = 16) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

/**
 * 防抖函数
 */
export function debounce(func, delay = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 线性插值
 */
export function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

/**
 * 限制数值范围
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * 映射数值范围
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * 检测设备类型
 */
export function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

/**
 * 检测是否为触摸设备
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 获取元素在视口中的位置
 */
export function getElementViewportPosition(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    return {
        top: rect.top,
        bottom: rect.bottom,
        isVisible: rect.top < windowHeight && rect.bottom > 0,
        visiblePercent: clamp(
            (windowHeight - rect.top) / (windowHeight + rect.height),
            0,
            1
        )
    };
}

/**
 * 平滑滚动到元素
 */
export function scrollToElement(element, offset = 0, behavior = 'smooth') {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: behavior
    });
}

/**
 * 生成随机数
 */
export function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 生成随机整数
 */
export function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}

/**
 * 延迟执行
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 检测元素是否在视口中
 */
export function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = rect.top <= windowHeight - threshold && rect.bottom >= threshold;
    const horInView = rect.left <= windowWidth - threshold && rect.right >= threshold;
    
    return vertInView && horInView;
}

/**
 * 格式化日期
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('复制失败:', err);
        return false;
    }
}

/**
 * 预加载图片
 */
export function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * 预加载多张图片
 */
export async function preloadImages(srcArray) {
    const promises = srcArray.map(src => preloadImage(src));
    return Promise.all(promises);
}

/**
 * 获取URL参数
 */
export function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 设置URL参数
 */
export function setUrlParameter(name, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
}