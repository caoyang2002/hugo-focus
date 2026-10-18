/**
 * ========================================
 * 工具函数模块
 * ========================================
 */

/** 限制数值范围 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/** 把 v 在 [a, b] 内归一化到 0~1 */
export function seg(v, a, b) {
    if (b <= a) return v >= b ? 1 : 0;
    return clamp((v - a) / (b - a), 0, 1);
}

/** 防抖函数 */
export function debounce(func, delay = 250) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
