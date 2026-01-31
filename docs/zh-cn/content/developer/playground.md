# 运行代码

运行代码需要加载运行按钮，以及运行环境。

## 运行按钮的加载

定义在 `layout/_default/_markup/render-codeblock.html`，这将从数据文件中动态构建一个支持的语言列表。

```js
// 创建一个空的 slice（数组）
{{ $supportedLanguages := slice }}
// 遍历 data/runners.toml 文件中的 languages 部分
{{ range $key, $value := site.Data.runners.languages }}
// 将语言的主键名（如 "python"、"typescript"）添加到数组中
{{ $supportedLanguages = $supportedLanguages | append $key }}
// 检查该语言是否有别名配置
{{ if $value.aliases }}
// 遍历该语言的所有别名
{{ range $value.aliases }} 
// 将每个别名添加到数组中
{{ $supportedLanguages = $supportedLanguages | append . }} 
```

运行代码的功能定义在 `layouts/partials/code_runners.html`。

目前支持的语言非常有限，仅包括以下语言：

### WASM 运行时 (4种)

1. Python - Pyodide
2. Lua - Fengari
3. SQL - SQL.js (SQLite)
4. Scheme - BiwaScheme
5. R - r-wasm.org

### 无需外部依赖 (3种)

1. JavaScript - 原生浏览器
2. TypeScript - 浏览器端编译
3. Bash/Shell - 模拟执行

### 免费在线 API (20种)
1. Rust Playground:
2. Go Playground:
3. Kotlin Playground:

### Godbolt (Compiler Explorer):
1. C
2. C++

### Wandbox API (支持多语言):
1. PHP
2. Ruby
3. Swift
4. Scala
5. Haskell
6. Perl
7. Zig
8. Nim
9. D
10. Fortran
11. Pascal
12. Erlang
13. Elixir
14. OCaml
### JSCL (JavaScript Common Lisp):
1. Lisp


# 工作原理

如果文件的元数据定义了 `codeRunners`，那么就添加运行代码的功能

```bash
{{ if .Params.codeRunners }}
```

元数据

```toml
codeRunners = true
```

这时候，代码块将添加 `运行` 按钮，并实现运行代码的功能。
