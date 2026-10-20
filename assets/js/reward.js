(function () {
    const button = document.querySelector(".reward-button");
    const popup = document.getElementById("reward-pop");

    if (!button || !popup) return;

    button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isExpanded));

        popup.classList.toggle("hidden");
        setTimeout(() => {
            popup.classList.toggle("visible");
        }, 10);
    });
})();
