/* ============================================
   Featured Scroll Component
   ============================================ */

(function () {
    "use strict";

    var AUTO_SCROLL_INTERVAL = 3000; // 自动滚动间隔（毫秒）
    var RESUME_DELAY = 2000;         // 触摸结束后恢复自动滚动的延迟（毫秒）
    var SCROLL_THRESHOLD = 50;       // 回卷阈值
    var EDGE_TOLERANCE = 10;         // 按钮可用状态容差

    /**
     * 初始化单个滚动组件
     * @param {HTMLElement} root .featured-scroll-component 根节点
     */
    function initFeaturedScroll(root) {
        if (!root || root.dataset.scrollInitialized === "true") return;
        root.dataset.scrollInitialized = "true";

        var scrollContainer = root.querySelector(".scroll-container");
        var scrollContent = root.querySelector(".scroll-content");
        if (!scrollContainer || !scrollContent) return;

        var prevBtn = root.querySelector(".scroll-btn-prev");
        var nextBtn = root.querySelector(".scroll-btn-next");

        var autoScrollInterval = null;
        var resizeTimer = null;

        /** 根据实际渲染尺寸计算每次滚动的距离（响应式安全） */
        function getScrollAmount() {
            var item = scrollContent.querySelector(".scroll-item");
            var styles = window.getComputedStyle(scrollContent);
            var gap = parseFloat(styles.columnGap || styles.gap) || 24;
            var width = item ? item.getBoundingClientRect().width : 320;
            return width + gap;
        }

        function startAutoScroll() {
            if (autoScrollInterval) return;
            autoScrollInterval = window.setInterval(function () {
                var atEnd =
                    scrollContainer.scrollLeft + scrollContainer.clientWidth >=
                    scrollContent.scrollWidth - SCROLL_THRESHOLD;

                if (atEnd) {
                    scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollContainer.scrollBy({
                        left: getScrollAmount(),
                        behavior: "smooth",
                    });
                }
            }, AUTO_SCROLL_INTERVAL);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                window.clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function updateNavButtons() {
            var canScrollLeft = scrollContainer.scrollLeft > EDGE_TOLERANCE;
            var canScrollRight =
                scrollContainer.scrollLeft + scrollContainer.clientWidth <
                scrollContent.scrollWidth - EDGE_TOLERANCE;

            if (prevBtn) {
                prevBtn.style.opacity = canScrollLeft ? "0.8" : "0.3";
                prevBtn.disabled = !canScrollLeft;
            }
            if (nextBtn) {
                nextBtn.style.opacity = canScrollRight ? "0.8" : "0.3";
                nextBtn.disabled = !canScrollRight;
            }
        }

        // —— 按钮点击 ——
        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                scrollContainer.scrollBy({
                    left: -getScrollAmount(),
                    behavior: "smooth",
                });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                scrollContainer.scrollBy({
                    left: getScrollAmount(),
                    behavior: "smooth",
                });
            });
        }

        // —— 悬停暂停 ——
        scrollContainer.addEventListener("mouseenter", stopAutoScroll);
        scrollContainer.addEventListener("mouseleave", startAutoScroll);

        // —— 滚动时更新按钮状态 ——
        scrollContainer.addEventListener("scroll", updateNavButtons, {
            passive: true,
        });

        // —— 触摸拖拽 ——
        var touchStartX = 0;
        var touchStartY = 0;
        var scrollStartX = 0;
        var isHorizontalDrag = false;

        scrollContainer.addEventListener(
            "touchstart",
            function (e) {
                var touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                scrollStartX = scrollContainer.scrollLeft;
                isHorizontalDrag = false;
                stopAutoScroll();
            },
            { passive: true }
        );

        scrollContainer.addEventListener(
            "touchmove",
            function (e) {
                var touch = e.touches[0];
                var deltaX = touchStartX - touch.clientX;
                var deltaY = touchStartY - touch.clientY;

                if (!isHorizontalDrag) {
                    // 忽略极小的抖动
                    if (Math.abs(deltaX) < 5) return;
                    // 垂直方向占优时交给页面滚动，不拦截
                    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
                    isHorizontalDrag = true;
                }

                scrollContainer.scrollLeft = scrollStartX + deltaX;
                e.preventDefault();
            },
            { passive: false }
        );

        scrollContainer.addEventListener(
            "touchend",
            function () {
                window.setTimeout(startAutoScroll, RESUME_DELAY);
            },
            { passive: true }
        );

        // —— 视口变化时重新计算按钮状态 ——
        window.addEventListener("resize", function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(updateNavButtons, 150);
        });

        // —— 启动 ——
        updateNavButtons();
        startAutoScroll();
    }

    function initAll() {
        var components = document.querySelectorAll(".featured-scroll-component");
        Array.prototype.forEach.call(components, initFeaturedScroll);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
