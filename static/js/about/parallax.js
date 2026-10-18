/**
 * ========================================
 * 滚动场景核心模块
 * ========================================
 * 三个场景，各有各的页面效果：
 *   01 关于：纸白底 + 可见网格，元素入场，几何圆线缓慢上移放大
 *   02 作品：固定舞台。文字在屏幕正中指数放大 → 背景由纸白过渡到墨黑 →
 *            卡片按网格逐张擦入
 *   03 联系：整块蓝色面从下方覆盖上来（占满全屏），标题与联系行依次擦入
 * 每个场景只读取自己的轨道（getBoundingClientRect），状态完全由滚动位置决定，
 * 所以上下滚动都是对称、连续的。
 */

import { PARALLAX, INFO, WORKS, SKILLS, CONTACT, EASING } from "./config.js";
import { layers, sections, works, contact,about } from "./dom.js";
import { updateNavigation } from "./navigation.js";
import { clamp } from "./utils.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let vh = window.innerHeight;
let lastDark = null;

/** 把 v 在 [a, b] 内归一化到 0~1 */
const seg = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
const ease = EASING.easeInOut;

/**
 * 初始化滚动状态
 */
export function initScrollState() {
  vh = window.innerHeight;
}

/**
 * 背景层：固定在视口，仅几何圆线层随整页进度运动
 */
function applyParallax(progress) {
  if (layers.line) {
    const y = -progress * PARALLAX.lineTravelVh;
    const s = 1 + progress * PARALLAX.lineGrow;
    layers.line.style.transform = `translate3d(0, ${y}vh, 0) scale(${s})`;
  }
  if (layers.nav) {
    layers.nav.style.transform = "none";
  }
}

/**
 * 作品场景
 */
function renderWorks(rect) {
  const { stage, text, illusion, items, progress } = works;
  if (!stage || !text || !illusion) return 0;

  const travel = Math.max(1, rect.height - vh);
  const t = clamp(-rect.top / travel, 0, 1);

  // 1) 屏幕正中放大（舞台居中 + transform-origin 居中 = 以屏幕中心为原点）
  const u = seg(t, 0, WORKS.zoomEnd);
  const zoom = reduceMotion ? 1 : Math.pow(WORKS.maxScale, ease(u));
  const textOpacity = 1 - ease(seg(t, WORKS.textFadeStart, WORKS.zoomEnd));
  text.style.transform = `scale(${zoom.toFixed(4)})`;
  text.style.opacity = textOpacity.toFixed(3);

  // 2) 舞台背景：透明（露出纸白与网格）→ 墨黑
  const k = ease(seg(t, WORKS.bgStart, WORKS.bgEnd));
  stage.style.backgroundColor = `rgba(10, 10, 10, ${k.toFixed(3)})`;
  const dark = k > WORKS.darkAt;
  if (dark !== lastDark) {
    stage.classList.toggle("is-dark", dark);
    lastDark = dark;
  }

  // 3) 覆盖层与卡片：按网格顺序逐张从下往上擦入
  const overlay = ease(seg(t, WORKS.overlayStart, WORKS.overlayStart + 0.04));
  illusion.style.opacity = overlay.toFixed(3);
  illusion.style.pointerEvents = t >= WORKS.cardsStart ? "all" : "none";

  items.forEach((el, i) => {
    const e = ease(seg(t, WORKS.cardsStart + i * WORKS.cardStagger, WORKS.cardsStart + i * WORKS.cardStagger + WORKS.cardDur));
    el.style.clipPath = e >= 1 ? "none" : `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0)`;
  });

  if (progress) {
    progress.textContent = String(Math.round(t * 100)).padStart(3, "0");
  }

  return t;
}

/**
 * 关于场景：info（标题/简介/头像）与 skills 随滚动放大
 * p = 0（about 顶部刚进视口顶部）→ 1（about 底部离开视口顶部）
 */
function renderAbout(rect) {
  const p = clamp((vh - rect.top) / (rect.height + vh), 0, 1);

  // --- info：标题 / 简介 / 头像 ---
  const eInfo = ease(seg(p, INFO.start, INFO.end));
  const sInfo = INFO.scaleStart + (1 - INFO.scaleStart) * eInfo;
  [about.title, about.bio, about.avatar].forEach(el => {
    if (el) el.style.transform = `scale(${sInfo.toFixed(4)})`;
  });

  // --- skills：整体放大 + 每个 item 错峰 ---
  const eSkills = ease(seg(p, SKILLS.start, SKILLS.end));
  const sSkills = SKILLS.scaleStart + (1 - SKILLS.scaleStart) * eSkills;
  if (about.skills) {
    about.skills.style.transform = `scale(${sSkills.toFixed(4)})`;
    about.skills.style.transformOrigin = 'left top';   // 左对齐，避免放大后溢出右侧
  }

  about.skillItems.forEach((el, i) => {
    const a = SKILLS.start + i * SKILLS.stagger;
    const e = ease(seg(p, a, a + SKILLS.itemDur));
    const s = SKILLS.scaleStart + (1 - SKILLS.scaleStart) * e;
    el.style.transform = `scale(${s.toFixed(4)})`;
    el.style.transformOrigin = 'left top';
  });

  return p;
}

/**
 * 联系场景：q = 0（轨道顶部刚进入视口底部）→ 1（页面最底部）
 */
function renderContact(rect) {
  const q = clamp((vh - rect.top) / rect.height, 0, 1);

  if (contact.title) {
    const e = ease(seg(q, CONTACT.titleStart, CONTACT.titleEnd));
    contact.title.style.clipPath =
      e >= 1 ? "none" : `inset(-8% ${((1 - e) * 100).toFixed(2)}% -8% 0)`;
  }

  contact.items.forEach((el, i) => {
    const a = CONTACT.itemsStart + i * CONTACT.itemStep;
    const e = ease(seg(q, a, a + CONTACT.itemDur));
    el.style.clipPath = e >= 1 ? "none" : `inset(0 ${((1 - e) * 100).toFixed(2)}% 0 0)`;
  });

  return q;
}

/**
 * 主滚动处理函数
 */
export function handleScroll() {
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const docProgress = clamp(y / max, 0, 1);

  // 整页进度：给顶部进度线用
  document.documentElement.style.setProperty("--scroll", docProgress.toFixed(4));

  applyParallax(docProgress);

  const worksRect = sections.worksTrigger.getBoundingClientRect();
  const contactRect = sections.contact.getBoundingClientRect();
  const aboutRect = sections.about.getBoundingClientRect();

  renderWorks(worksRect);
  renderContact(contactRect);
  renderAbout(aboutRect);

  // 导航高亮：以视口中线为界
  if (contactRect.top < vh * 0.5) {
    updateNavigation("contact");
  } else if (worksRect.top < vh * 0.5) {
    updateNavigation("works");
  } else {
    updateNavigation("about");
  }
}

/**
 * 窗口大小改变处理
 */
export function handleResize() {
  initScrollState();
  handleScroll();
}

/**
 * 计算某场景的「目标滚动位置」
 *  works  + "start"   → 作品文字刚钉住（t = 0）
 *  works  + "cards"   → 卡片全部展示（t ≈ 0.45）
 *  contact           → 页面最底部（联系区完整展示）
 */
export function getSceneScrollTop(id, mode = "start") {
  const doc = document.documentElement;
  if (id === "contact") {
    return doc.scrollHeight - window.innerHeight;
  }
  if (id === "works") {
    const rect = sections.worksTrigger.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const travel = Math.max(1, rect.height - window.innerHeight);
    return top + (mode === "cards" ? travel * 0.45 : 0);
  }
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
}
