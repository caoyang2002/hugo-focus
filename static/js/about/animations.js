/**
 * ========================================
 * 动画效果模块
 * ========================================
 */

import { EASING } from './config.js';
import { lerp } from './utils.js';

/**
 * 页面加载动画
 */
export function initPageLoadAnimation() {
    // 添加页面加载完成类
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // 依次显示元素
        animateElementsSequentially('.section-about > *', 100);
    });
}

/**
 * 依次动画显示元素
 */
function animateElementsSequentially(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, index * delay);
    });
}

/**
 * 鼠标跟随效果（可选）
 */
export function initMouseFollowEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        currentX = lerp(currentX, mouseX, 0.1);
        currentY = lerp(currentY, mouseY, 0.1);
        
        // 应用到某些元素（如装饰性元素）
        const decorElements = document.querySelectorAll('.mouse-follow');
        decorElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed || 0.02);
            const x = (currentX - window.innerWidth / 2) * speed;
            const y = (currentY - window.innerHeight / 2) * speed;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * 视差鼠标移动效果
 */
export function initParallaxMouseEffect() {
    const layers = document.querySelectorAll('[data-parallax-mouse]');
    
    if (layers.length === 0) return;
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function animate() {
        layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.parallaxMouse || 10);
            const x = mouseX * speed;
            const y = mouseY * speed;
            layer.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * 文字打字机效果
 */
export function typewriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * 数字滚动动画
 */
export function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = EASING.easeOut(progress);
        const current = Math.floor(start + range * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * 滚动触发动画
 */
export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-scroll-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * 淡入动画
 */
export function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        
        element.style.opacity = Math.min(progress, 1);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * 淡出动画
 */
export function fadeOut(element, duration = 300) {
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        
        element.style.opacity = 1 - Math.min(progress, 1);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * 3D卡片倾斜效果
 */
export function init3DCardTilt() {
    const cards = document.querySelectorAll('.work-item, .skill-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((centerX - x) / centerX) * 10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * 初始化所有动画效果
 */
export function initAllAnimations() {
    initPageLoadAnimation();
    initScrollAnimations();
    init3DCardTilt();
    // initMouseFollowEffect(); // 可选
    // initParallaxMouseEffect(); // 可选
}