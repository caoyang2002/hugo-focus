function initTOC() {
    const tocAside     = document.querySelector(".toc-aside");
    const mobileToggle = document.querySelector(".mobile-toc-toggle");
    const closeButton  = document.querySelector(".toc-close");

    if (!tocAside) return;

    mobileToggle?.addEventListener("click", () => tocAside.classList.add("show"));
    closeButton?.addEventListener("click", () => tocAside.classList.remove("show"));

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
    const links = [...document.querySelectorAll(".toc a")];
    if (!links.length) return;

    const headings = [...document.querySelectorAll(
        "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
    )];
    if (!headings.length) return;

    // 建立 id -> link 的映射，兼容 Hugo 对 href 做 URL 编码的情况
    const linkMap = new Map();
    links.forEach((a) => {
        let id = a.getAttribute("href") || "";
        if (!id.startsWith("#")) return;
        id = id.slice(1);
        try { id = decodeURIComponent(id); } catch (_) {}
        linkMap.set(id, a);
    });

    const OFFSET = 100; // 与 CSS 里的 scroll-margin-top 保持一致
    let ticking = false;

    function updateActive() {
        let current = null;

        for (const h of headings) {
            if (h.getBoundingClientRect().top - OFFSET <= 0) {
                current = h;          // 最后一个越过偏移线的标题
            } else {
                break;                // 后面都在下方，不用看了
            }
        }

        // 还没滚到第一个标题时，高亮第一个
        if (!current) current = headings[0];

        const link = linkMap.get(current.id);
        if (!link) return;

        const prev = document.querySelector(".toc a.active");
        if (prev === link) return;    // 避免无意义的重排

        prev?.classList.remove("active");
        link.classList.add("active");
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateActive();
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActive();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTOC);
} else {
    initTOC();
}
