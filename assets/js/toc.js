(function () {
    function initTOC() {
        const tocAside = document.querySelector(".toc-aside");
        const mobileToggle = document.querySelector(".mobile-toc-toggle");
        const closeButton = document.querySelector(".toc-close");

        // 没有目录时不执行
        if (!tocAside) return;

        // 展开
        mobileToggle?.addEventListener("click", () => {
            tocAside.classList.add("show");
        });

        // 关闭
        closeButton?.addEventListener("click", () => {
            tocAside.classList.remove("show");
        });

        // 点击外部关闭（仅移动端）
        document.addEventListener("click", (e) => {
            if (
                window.innerWidth <= 912 &&
                tocAside.classList.contains("show") &&
                !tocAside.contains(e.target) &&
                !mobileToggle?.contains(e.target)
            ) {
                tocAside.classList.remove("show");
            }
        });

        // ===== 滚动高亮 =====
        const links = document.querySelectorAll(".toc a");
        if (!links.length) return;

        const headings = document.querySelectorAll(
            "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
        );
        if (!headings.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio <= 0) return;
                    const id = entry.target.id;
                    const link = document.querySelector(
                        `.toc a[href="#${CSS.escape(id)}"]`
                    );
                    if (!link) return;
                    document
                        .querySelectorAll(".toc a.active")
                        .forEach((n) => n.classList.remove("active"));
                    link.classList.add("active");
                });
            },
            { rootMargin: "-20% 0px -80% 0px" }
        );

        headings.forEach((h) => observer.observe(h));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTOC);
    } else {
        initTOC();
    }
})();
