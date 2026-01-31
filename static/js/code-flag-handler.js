// 语言标识映射表：主语言 -> 别名数组
const LANGUAGE_MAPPINGS = {
  // JavaScript 相关
  javascript: [
    "js",
    "javascript",
    "jsx",
    "vue",
    "react",
    "svelte",
    "nextjs",
    "nuxt",
    "vuejs",
  ],

  // TypeScript 相关
  typescript: ["ts", "typescript", "tsx", "angular", "nestjs"],

  // Python 相关
  python: ["py", "python", "python3"],

  // C++ 相关
  cpp: ["cpp", "c++", "cplusplus", "cc", "cxx"],

  // C 语言
  c: ["c"],

  // C# 相关
  csharp: ["csharp", "cs", "c#"],

  // Java 相关
  java: ["java"],

  // HTML 相关
  html: ["html", "htm", "html5"],

  // CSS 相关
  css: ["css", "css3", "scss", "sass", "less", "stylus"],

  // PHP 相关
  php: ["php"],

  // Ruby 相关
  ruby: ["rb", "ruby"],

  // Go 相关
  go: ["go", "golang"],

  // Rust 相关
  rust: ["rs", "rust"],

  // Swift 相关
  swift: ["swift"],

  // Kotlin 相关
  kotlin: ["kt", "kotlin"],

  // SQL 相关
  sql: ["sql", "mysql", "postgresql", "sqlite", "postgres"],

  // Shell/Bash 相关
  shell: ["bash", "sh", "shell", "zsh", "powershell", "ps1"],

  // Markdown

  // Docker
  docker: ["dockerfile", "docker"],

  // Git
  git: ["git"],

  // 其他常见语言
  lua: ["lua"],
  perl: ["perl"],
  r: ["r"],
  lisp: ["lisp"],
  scala: ["scala"],
  dart: ["dart"],
  elixir: ["elixir"],
  haskell: ["haskell"],
  ocaml: ["ocaml"],
  clojure: ["clojure"],
  erlang: ["erlang"],
  matlab: ["matlab"],

  // 文件类型
  markdown: ["md", "markdown"],
  json: ["json"],
  yaml: ["yaml", "yml"],
  xml: ["xml"],
  toml: ["toml"],
  ini: ["ini", "conf"],
  csv: ["csv"],
  txt: ["txt", "text"],
  log: ["log"],
};

// 创建反向查找表：别名 -> 主语言（一次性构建，提高性能）
const REVERSE_LANGUAGE_MAP = (() => {
  const map = {};
  for (const [mainLang, aliases] of Object.entries(LANGUAGE_MAPPINGS)) {
    aliases.forEach((alias) => {
      map[alias.toLowerCase()] = mainLang;
    });
  }
  return map;
})();

// 获取支持的语言列表（从映射表键名获取）
const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAPPINGS);

// 提取并标准化语言名称的函数
function normalizeLanguage(lang) {
  if (!lang) return null;

  // 转换为小写
  lang = lang.toLowerCase();

  // 直接使用反向查找表
  return REVERSE_LANGUAGE_MAP[lang] || null;
}

function createLanguageFlag(pre, language, hasIcon = true) {
  const languageFlag = document.createElement("span");
  languageFlag.className = "language-flag not-prose";
  languageFlag.setAttribute("data-language", language);

  // 创建图标元素
  if (hasIcon && SUPPORTED_LANGUAGES.includes(language)) {
    const icon = document.createElement("img");
    icon.src = `/icon/flag/${language}.svg`;
    icon.alt = language;
    icon.style.color = "white";
    icon.style.width = "32px";
    icon.style.height = "32px";
    // icon.style.marginRight = "6px";
    // icon.style.verticalAlign = "middle";

    // 添加图标和文本
    languageFlag.appendChild(icon);
    // languageFlag.appendChild(document.createTextNode(language.toUpperCase()));

    // pre.appendChild(languageFlag);
  } else if (language) {
    // 不支持的语言，只显示文字
    // console.log("不支持的语言，只显示文字: ", language);
    // const languageFlag = document.createElement("span");
    languageFlag.className = "language-flag not-prose text-only";
    languageFlag.textContent = language.toUpperCase();
  }
  pre.appendChild(languageFlag);
  return languageFlag;
}

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
    let normalizedLanguage = null;

    const match = languageClass.match(/language-(\w+)/);
    if (match && match[1]) {
      // language = match[1];
      const rawLanguage = match[1];
      ormalizedLanguage = normalizeLanguage(rawLanguage);

      if (normalizedLanguage) {
        language = normalizedLanguage;
      } else {
        language = rawLanguage.toLowerCase();
      }
      console.log("提取语言：", rawLanguage, "=>", language);
    }

    // 如果有语言，创建语言标志（放在左上角）
    if (language && REVERSE_LANGUAGE_MAP[language]) {
      console.log("检测到语言，创建语言标志: ", language);
      const mainLanguage = REVERSE_LANGUAGE_MAP[language] || language;
      createLanguageFlag(pre, mainLanguage);
    } else if (language) {
      // 不支持的语言，只显示文字
      console.log("不支持的语言，只显示文字: ", language);
      createLanguageFlag(pre, language, false);
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
