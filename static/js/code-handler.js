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
    console.log("开始提取语言");
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
      languageFlag.className = "language-flag not-prose";

      // 创建图标元素
      const icon = document.createElement("img");
      icon.src = `/icon/flag/${language}.svg`;
      icon.alt = language;
      icon.style.color = "white";
      // icon.style.width = "16px";
      // icon.style.height = "16px";
      // icon.style.marginRight = "6px";
      // icon.style.verticalAlign = "middle";

      // 添加图标和文本
      languageFlag.appendChild(icon);
      languageFlag.appendChild(document.createTextNode(language.toUpperCase()));

      pre.appendChild(languageFlag);
    }

    // 创建复制按钮（放在右上角）
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.setAttribute("aria-label", "复制代码");
    copyButton.textContent = "复制";

    // 复制功能
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeElement.textContent);
        const originalText = copyButton.textContent;
        copyButton.textContent = "已复制!";
        copyButton.classList.add("copied");

        setTimeout(() => {
          copyButton.textContent = originalText;
          copyButton.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("复制失败:", err);
        copyButton.textContent = "复制失败";
        copyButton.classList.add("error");

        setTimeout(() => {
          copyButton.textContent = "复制";
          copyButton.classList.remove("error");
        }, 2000);
      }
    });

    pre.appendChild(copyButton);
  });
});
