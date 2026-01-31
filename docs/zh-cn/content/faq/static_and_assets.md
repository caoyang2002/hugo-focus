# Hugo 中 `static` 和 `assets` 目录的作用和区别

## 概览

| 目录 | 用途 | Hugo 处理方式 | 示例文件 |
|------|------|---------------|----------|
| `static/` | 存放静态文件 | 直接复制到输出目录 | 图片、PDF、字体、favicon.ico |
| `assets/` | 存放需要处理的文件 | 经过 Hugo Pipes 处理 | CSS、JS、图片优化、SASS/SCSS |

---

## 1. `static/` 目录

### 作用和特点
- **直接复制**：Hugo 会将此目录下的所有文件**原样复制**到最终输出的 `public/` 目录中
- **无处理**：Hugo 不会对这些文件进行任何处理（如压缩、转换等）
- **路径保留**：目录结构会被保留

### 最佳使用场景
```bash
static/
├── favicon.ico           # 网站图标
├── robots.txt           # 搜索引擎爬虫文件
├── sitemap.xml          # 站点地图（如果不用Hugo生成）
├── images/
│   ├── logo.png         # 公司Logo
│   └── backgrounds/     # 背景图片
├── pdf/
│   └── brochure.pdf     # 下载文件
├── fonts/
│   ├── font.woff2       # 字体文件
│   └── font.woff
└── CNAME                # GitHub Pages自定义域名
```

### 模板中引用方式
```go
<!-- 直接引用，路径从站点根目录开始 -->
<img src="/images/logo.png" alt="Logo">
<link rel="icon" href="/favicon.ico">
<a href="/pdf/brochure.pdf">下载手册</a>

<!-- 使用 relURL 或 absURL 帮助函数 -->
<img src="{{ "images/logo.png" | relURL }}" alt="Logo">
```

---

## 2. `assets/` 目录

### 作用和特点
- **需要处理**：存放需要通过 **Hugo Pipes** 处理的文件
- **资源优化**：支持压缩、转换、合并等处理
- **缓存控制**：自动添加哈希值用于缓存失效
- **指纹识别**：生成版本化文件名

### 最佳使用场景
```bash
assets/
├── css/
│   ├── main.scss        # SCSS文件，会被编译为CSS
│   └── variables.scss   # SCSS变量文件
├── js/
│   ├── main.js          # JS文件，会被压缩
│   └── vendor/          # 第三方库
│       └── jquery.js
├── images/
│   ├── photo.jpg        # 图片，可被优化
│   └── icons/
│       └── icon.svg     # SVG可被内联
└── fonts/
    └── custom.woff2     # 字体文件，可被预处理
```

### 模板中处理和引用方式

#### 1. CSS/SCSS 处理
```go
{{- $css := resources.Get "css/main.scss" | resources.ToCSS | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

#### 2. JavaScript 处理
```go
{{- $js := resources.Get "js/main.js" | js.Build | minify | fingerprint }}
<script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
```

#### 3. 图片处理
```go
{{- $image := resources.Get "images/photo.jpg" }}
{{- $small := $image.Resize "300x" }}
{{- $medium := $image.Resize "600x" }}

<img src="{{ $small.RelPermalink }}" 
     srcset="{{ $small.RelPermalink }} 300w,
             {{ $medium.RelPermalink }} 600w"
     sizes="(max-width: 600px) 300px, 600px"
     alt="Description">
```

#### 4. 合并多个文件
```go
{{- $cssOptions := dict "targetPath" "css/bundle.css" }}
{{- $cssBundle := slice 
    (resources.Get "css/reset.css")
    (resources.Get "css/main.css")
    (resources.Get "css/components.css")
  | resources.Concat "css/bundle.css"
  | minify
  | fingerprint }}
```

---

## 3. 关键区别对比

| 特性 | `static/` | `assets/` |
|------|-----------|-----------|
| **处理方式** | 直接复制 | Hugo Pipes 处理 |
| **文件类型** | 最终成品文件 | 源文件（需要处理） |
| **路径引用** | 从站点根目录 | 从 assets 目录 |
| **缓存控制** | 手动管理 | 自动指纹识别 |
| **版本控制** | 无 | 自动哈希 |
| **性能优化** | 无 | 压缩、合并、优化 |
| **开发便利** | 简单直接 | 功能强大但需配置 |

---

## 4. 实际使用建议

### 什么放 `static/`？
```bash
# 直接可用的文件
static/
├── already-minified.js    # 已经压缩好的JS
├── external-font.woff2    # 第三方字体
├── legacy-pdf.pdf         # 旧版PDF文档
├── sitemap.xml           # 动态生成的站点地图
└── apple-touch-icon.png  # iOS图标
```

### 什么放 `assets/`？
```bash
# 需要Hugo处理的文件
assets/
├── scss/                 # SCSS源文件
├── ts/                   # TypeScript源文件
├── raw-images/           # 原始高分辨率图片
├── raw-js/              # 开发版JS（有注释和空格）
└── config/              # 配置文件（如tailwind.config.js）
```

### 混合使用示例
```bash
hugo-site/
├── static/              # 静态文件
│   ├── favicon.ico
│   ├── robots.txt
│   └── uploads/         # 用户上传的内容
│
├── assets/              # 需要处理的资源
│   ├── scss/
│   ├── js/
│   └── images/
│
└── content/            # 网站内容
```

---

## 5. 高级配置

### 配置 `hugo.toml`
```toml
# 资产处理配置
[module]
  [[module.mounts]]
    source = "assets"
    target = "assets"
  
  [[module.mounts]]
    source = "static"
    target = "static"

# 图片处理配置
[imaging]
  resampleFilter = "CatmullRom"
  quality = 85
  anchor = "smart"

# 资源缓存配置
[caches]
  [caches.assets]
    dir = ":resourceDir/_gen"
    maxAge = -1
```

### 自定义输出路径
```go
{{- $css := resources.Get "scss/main.scss" | toCSS | postCSS | minify }}
{{- $css = $css | resources.ExecuteAsTemplate 
    (printf "css/main.%d.css" now.Unix) . }}
```

---

## 6. 常见问题

### Q1: 应该把图片放在哪里？
- **`static/`**: 已经优化好的图片、图标、favicon
- **`assets/`**: 需要 Hugo 处理（调整大小、格式转换）的图片

### Q2: 第三方库放在哪里？
- **CDN引入**: 在模板中直接使用 CDN 链接
- **`static/`**: 已经压缩的 `.min.js` 或 `.min.css` 文件
- **`assets/`**: 需要与自定义代码合并的库

### Q3: 如何组织大型项目？
```bash
my-project/
├── themes/my-theme/
│   ├── assets/          # 主题资源
│   └── static/          # 主题静态文件
├── assets/              # 项目自定义资源（覆盖主题）
└── static/              # 项目静态文件（覆盖主题）
```

### Q4: 性能优化建议
1. **`assets/` 中的图片**：使用 Hugo 的图片处理功能
2. **CSS/JS**：合并、压缩、添加指纹
3. **字体文件**：使用 `preload` 和 `woff2` 格式
4. **懒加载**：对非关键图片使用懒加载

---

## 总结选择原则

### 选择 `static/` 当：
- 文件已经是最终版本
- 不需要 Hugo 处理
- 文件路径需要精确控制
- 使用第三方工具已经处理好的文件

### 选择 `assets/` 当：
- 文件需要 Hugo 处理（压缩、转换等）
- 需要缓存控制（指纹识别）
- 使用预处理语言（SCSS、TypeScript）
- 需要响应式图片
- 要合并多个文件

这样的结构让 Hugo 既能高效处理资源，又能保持静态文件的简单性。
