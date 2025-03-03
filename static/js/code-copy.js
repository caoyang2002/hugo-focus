document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre").forEach((pre) => {
    const codeElement = pre.querySelector("code");
    if (
      codeElement &&
      (codeElement.classList.contains("mermaid") ||
        codeElement.classList.contains("language-mermaid"))
    ) {
      return; // 跳过处理
    }
    // 创建复制按钮容器
    const header = document.createElement("div");
    header.className = "code-header";

    // 创建按钮
    const button = document.createElement("button");
    button.className = "copy-button";
    button.textContent = "复制";

    // 复制功能
    button.addEventListener("click", () => {
      const code = pre.querySelector("code");
      navigator.clipboard.writeText(code.textContent);
      button.textContent = "已复制!";
      setTimeout(() => {
        button.textContent = "复制";
      }, 2000);
    });

    // 将按钮添加到代码块中
    header.appendChild(button);
    pre.appendChild(header);
  });
});
