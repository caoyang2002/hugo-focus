(function () {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener(
        "touchstart",
        (e) => { touchStartX = e.changedTouches[0].screenX; },
        false
    );

    document.addEventListener(
        "touchend",
        (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        },
        false
    );

    function handleSwipe() {
        const aside = document.querySelector("aside");
        if (!aside) return;
        const swipeLength = touchEndX - touchStartX;
        if (Math.abs(swipeLength) > 50) {
            if (swipeLength < 0) aside.classList.add("show");
            else aside.classList.remove("show");
        }
    }
})();
