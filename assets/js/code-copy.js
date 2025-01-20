// assets/js/code-copy.js
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const codeBlock = document.getElementById(button.dataset.target);
      const code = codeBlock.querySelector(".highlight").innerText;

      navigator.clipboard.writeText(code).then(() => {
        button.textContent = "已复制！";
        setTimeout(() => {
          button.textContent = "复制";
        }, 2000);
      });
    });
  });
});
