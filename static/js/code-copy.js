document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre").forEach((pre) => {
    const codeElement = pre.querySelector("code");
    if (!codeElement) return;

    // 跳过Mermaid代码块
    if (
      codeElement.classList.contains("mermaid") ||
      codeElement.classList.contains("language-mermaid")
    ) {
      return;
    }

    // 检查是否已经处理过
    if (pre.querySelector(".code-header")) {
      return;
    }

    // 确保pre有相对定位
    pre.style.position = "relative";
    pre.style.paddingTop = "40px"; // 为语言标志和复制按钮留出空间

    // 提取语言
    const languageClass = codeElement.getAttribute("class") || "";
    let language = "";
    const match = languageClass.match(/language-(\w+)/);
    if (match && match[1]) {
      language = match[1];
      console.log("提取语言：", language);
    }

    // 如果有语言，创建语言标志（放在左上角）
    if (language) {
      console.log("检测到语言，创建语言标志: ", language);
      const languageFlag = document.createElement("span");
      languageFlag.className = "language-flag";
      languageFlag.textContent = language.toUpperCase();

      // 设置语言标志样式
      languageFlag.style.position = "absolute";
      languageFlag.style.left = "12px";
      languageFlag.style.top = "12px";
      languageFlag.style.fontSize = "12px";
      languageFlag.style.fontWeight = "600";
      languageFlag.style.padding = "4px 12px";
      languageFlag.style.background = "#f6f8fa";
      languageFlag.style.border = "1px solid #e1e4e8";
      languageFlag.style.borderRadius = "4px";
      languageFlag.style.color = "#666";
      languageFlag.style.zIndex = "10";

      // 如果需要SVG图标，可以添加背景
      languageFlag.style.backgroundImage = `url(/assets/imgs/icon/${language}.svg)`;
      languageFlag.style.backgroundRepeat = "no-repeat";
      languageFlag.style.backgroundPosition = "8px center";
      languageFlag.style.paddingLeft = "30px";

      pre.appendChild(languageFlag);
    }

    // 创建复制按钮（放在右上角）
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.setAttribute("aria-label", "复制代码");
    copyButton.textContent = "复制";

    // 设置复制按钮样式
    copyButton.style.position = "absolute";
    copyButton.style.right = "12px";
    copyButton.style.top = "12px";
    copyButton.style.fontSize = "12px";
    copyButton.style.padding = "4px 12px";
    copyButton.style.background = "#f6f8fa";
    copyButton.style.border = "1px solid #d1d9e0";
    copyButton.style.borderRadius = "4px";
    copyButton.style.color = "#24292e";
    copyButton.style.cursor = "pointer";
    copyButton.style.zIndex = "10";
    copyButton.style.transition = "all 0.2s ease";

    // 悬停效果
    copyButton.addEventListener("mouseenter", () => {
      copyButton.style.background = "#eaeef2";
    });
    copyButton.addEventListener("mouseleave", () => {
      copyButton.style.background = "#f6f8fa";
    });

    // 复制功能
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeElement.textContent);
        const originalText = copyButton.textContent;
        copyButton.textContent = "已复制!";
        copyButton.style.background = "#28a745";
        copyButton.style.color = "white";
        copyButton.style.borderColor = "#28a745";

        setTimeout(() => {
          copyButton.textContent = originalText;
          copyButton.style.background = "#f6f8fa";
          copyButton.style.color = "#24292e";
          copyButton.style.borderColor = "#d1d9e0";
        }, 2000);
      } catch (err) {
        console.error("复制失败:", err);
        copyButton.textContent = "复制失败";
        copyButton.style.background = "#dc3545";
        copyButton.style.color = "white";
        copyButton.style.borderColor = "#dc3545";

        setTimeout(() => {
          copyButton.textContent = "复制";
          copyButton.style.background = "#f6f8fa";
          copyButton.style.color = "#24292e";
          copyButton.style.borderColor = "#d1d9e0";
        }, 2000);
      }
    });

    pre.appendChild(copyButton);
  });
});
