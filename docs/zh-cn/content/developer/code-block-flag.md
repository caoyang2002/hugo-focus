# 代码语言标识

## 一、语言映射

在 `static/js/code-flag-handler.js` 中定义了语言映射，如下：

```js
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
```

例如：

```json
shell: ["bash", "sh", "shell", "zsh", "powershell", "ps1"]
```

被标记为`bash` / `sh` / `shell` / `zsh` / `powershell` / `ps1` 都会被映射为 `shell` 的 svg 图标。

svg 图标的源文件存放在 `static/icon/flug` 目录下。

## 二、如何运行

在 `head.html` 中定义了 

```js
<script src="{{ `js/code-flag-handler.js` | relURL }}" defer></script>
```

这将加载 js 目录下的 `code-flag-handler.js`。如果不明白 static 和 assets 目录的作用和区别可以查看这篇文章：[static 和 assets 的作用和区别](../faq/static_and_assets.md)。
