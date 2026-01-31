# 如何在 hugo 中创建一个独立页面

首先在菜单中创建选项，以 `about` 为例。

## 一、先创建 menu

```bash
[[main]]
name = '关于'
pageRef = '/about/'
```

`about` 会导航到页面 `about.md`，所以要创建文件 `about.md`，可以创建在任意位置

## 创建页面布局

然后在 `theme/hugo-focus/layouts/_default` 中创建一个页面布局 `about.html`

## 最后指定布局

```bash
layout = "about"
```
