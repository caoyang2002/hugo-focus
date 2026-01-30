/**
 * ========================================
 * 配置常量 - 视差系数和滚动阈值
 * ========================================
 */

// 视差系数配置（远层小，近层大，方向统一）
export const PARALLAX = {
    deepBg: 0.05,      // 最深层：反向极慢
    grid: 0.15,        // 网格层：反向慢
    line: 0.3,         // 线条层：反向中速
    worksText: 1.2     // 作品文字：正向快速
};

// 滚动阈值配置（0~1，基于300vh总高度）
export const THRESHOLD = {
    worksStart: 0.2,   // 1/5处开始放大作品文字
    worksFull: 0.4,    // 2/5处作品文字出屏，显示作品项
    contactStart: 0.7, // 7/10处开始过渡到联系方式
    contactFull: 0.9   // 9/10处完全显示联系方式
};

// 缓动函数
export const EASING = {
    // 线性
    linear: (t) => t,
    
    // 缓入
    easeIn: (t) => t * t,
    
    // 缓出
    easeOut: (t) => t * (2 - t),
    
    // 缓入缓出
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    // 弹性
    elastic: (t) => {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }
};

// 响应式断点
export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1440
};