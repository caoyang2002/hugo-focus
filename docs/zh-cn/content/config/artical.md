# 文章配置说明

## 一、配置语言
hugo 中 toml 配置使用 `+`，yaml 配置使用 `-`，例如：

1. toml 配置

```toml
+++
title = name
+++
```

2. yaml 配置

```yaml
---
title: name
---
```

## 二、配置项

```toml
title = 'name' # 文章名称
date = 2026-01-31T01:55:02+08:00 # 时间
draft = false # 是否为草稿
author = "simons" # 作者
categories = ["暂无"] # 分类
tags = ["暂无"] # 标签
description = "文章描述" # 描述
cover = "https://img.example.com/test_image/png" # 文章封面
codeRunner = true # 代码运行支持
```

- `title`：文章标题（string）
- `data`：文章创建时间(datatime)
- `draft`：是否为草稿(boolean)
- `author`：作者 (string)
- `categories`：文章分类 (string[])
- `tags`：标签 (string[])
- `description`：描述 (string)
- `cover`：文章封面 (string)
- `codeRunner`：代码运行支持 (string)
