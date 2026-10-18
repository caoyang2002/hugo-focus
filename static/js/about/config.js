/**
 * ========================================
 * 配置常量 - 滚动场景参数
 * ========================================
 * 作品区 / 联系区都是「固定舞台」：各自用自己的滚动进度（0~1）驱动，
 * 不再依赖整页 300vh 的假设，所以个人介绍区高度怎么变都不会错位。
 */

// 背景层视差（层本身固定在视口，按整页进度运动）
export const PARALLAX = {
    lineTravelVh: 28,  // 几何圆线层随整页进度向上移动的距离（vh）
    lineGrow: 0.5      // 几何圆线层整页进度内放大比例
};

// 关于区：info（标题/简介/头像）与 skills 的滚动放大
export const INFO = {
  scaleStart: 0.92,   // 进入视口时的初始缩放
  start: 0.05,        // 在 about 进度里开始放大
  end: 0.35,          // 放大完成
};

// 技能区
export const SKILLS = {
  scaleStart: 0.94,
  start: 0.1,
  end: 0.45,
  stagger: 0.04,      // 每个 skill-item 的错峰
  itemDur: 0.18,      // 单个 item 放大时长
};

// 作品区：进度 t = 0~1（固定舞台从钉住到结束）
// 轨道高 500vh，最后 100vh 与联系区重叠（联系区从下方覆盖上来），
// 所以 t 的 0.75~1 是「联系区上升」阶段，作品内容保持展示。
export const WORKS = {
    maxScale: 12,        // 中心放大倍数（指数缓动，视觉均匀）
    zoomEnd: 0.24,       // 放大结束
    textFadeStart: 0.13, // 文字开始淡出
    bgStart: 0.06,       // 舞台背景 纸白 → 墨黑 开始
    bgEnd: 0.22,         // 舞台背景 纸白 → 墨黑 结束
    darkAt: 0.45,        // 背景过渡超过该比例后切到浅色文字
    overlayStart: 0.22,  // 作品覆盖层开始出现
    cardsStart: 0.24,    // 第一张卡片开始擦入
    cardStagger: 0.035,  // 卡片之间的错开
    cardDur: 0.12        // 单张卡片擦入时长
};

// 联系区：进度 q = 0~1（从刚进入视口底部，到页面最底部）
export const CONTACT = {
    titleStart: 0.22,
    titleEnd: 0.5,
    itemsStart: 0.42,
    itemStep: 0.07,
    itemDur: 0.2
};

// 缓动函数
export const EASING = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    elastic: (t) => {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    }
};

// 响应式断点
export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1440
};
