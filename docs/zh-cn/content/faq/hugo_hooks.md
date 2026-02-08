# Hugo hooks 介绍

将 Markdown 渲染为 HTML 时，渲染钩子会覆盖转换。每个渲染钩子都是一个模板，每个支持的元素类型都有一个模板：

1. Blockquotes：块引号
2. Code blocks：代码块
3. Headings：标题
4. Images：图像
5. Links：链接
6. Passthrough elements：直通元素
7. Tables：表格

Hugo 支持多种内容格式，包括 Markdown、HTML、AsciiDoc、Emacs Org Mode、Pandoc 和 reStructuredText。

渲染钩子功能仅限于 Markdown。您无法为其他内容格式创建渲染钩子。

例如，考虑以下 Markdown：

```md
[Hugo](https://gohugo.io)
![kitten](kitten.jpg)
```
如果没有链接或图像渲染钩子，上述示例将渲染为：

```html
<p><a href="https://gohugo.io">Hugo</a></p>
<p><img alt="kitten" src="kitten.jpg"></p>
```

通过创建链接和图像渲染钩子，您可以更改从 Markdown 到 HTML 的转换。例如：

```html
<p><a href="https://gohugo.io" rel="external">Hugo</a></p>
<p><img alt="kitten" src="kitten.jpg" width="600" height="400"></p>
```

每个渲染钩子都是一个模板，每个支持的元素类型都有一个模板：

```dir
layouts/
  └── _markup/
      ├── render-blockquote.html
      ├── render-codeblock.html
      ├── render-heading.html
      ├── render-image.html
      ├── render-link.html
      ├── render-passthrough.html
      └── render-table.html
```

模板查找顺序允许您为每种页面类型、类型、语言和输出格式创建不同的渲染钩子。例如：

```dir
layouts/
├── _markup/
│   ├── render-link.html
│   └── render-link.rss.xml
├── books/
│   └── _markup/
│       ├── render-link.html
│       └── render-link.rss.xml
└── films/
    └── _markup/
        ├── render-link.html
        └── render-link.rss.xml
```
