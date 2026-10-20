(function () {
    const STORAGE_KEYS = {
        categories: "categoriesCollapsed",
        tags: "tagsCollapsed",
    };

    function toggleSection(sectionId) {
        const content = document.getElementById(`${sectionId}-content`);
        const icon = document.getElementById(`${sectionId}-icon`);
        if (!content || !icon) return;

        const isCollapsed = content.style.display === "none";
        if (isCollapsed) {
            content.style.display = "block";
            icon.textContent = "▼";
        } else {
            content.style.display = "none";
            icon.textContent = "▶";
        }

        const key = STORAGE_KEYS[sectionId];
        if (key) {
            localStorage.setItem(key, String(!isCollapsed));
        }
    }

    // 统一事件绑定，替代内联 onclick
    document.addEventListener("click", (e) => {
        const header = e.target.closest("[data-toggle]");
        if (!header) return;
        toggleSection(header.dataset.toggle);
    });

    // 恢复折叠状态
    function restoreState() {
        Object.entries(STORAGE_KEYS).forEach(([id, key]) => {
            if (localStorage.getItem(key) !== "true") return;
            const content = document.getElementById(`${id}-content`);
            const icon = document.getElementById(`${id}-icon`);
            if (content) content.style.display = "none";
            if (icon) icon.textContent = "▶";
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", restoreState);
    } else {
        restoreState();
    }
})();
