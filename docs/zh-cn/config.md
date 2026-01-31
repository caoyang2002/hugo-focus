# 配置  

Hugo 使用 `hugo.toml`（旧版本是 `config.toml`）作为主要配置文件。以下是基本的配置项：

## 1. 基础配置
```toml
baseURL = "https://example.org/"
languageCode = "zh-cn"
title = "我的网站"
theme = "mytheme"
```

## 2. 站点参数
```toml
[params]
  author = "作者名"
  description = "网站描述"
  keywords = "关键词1, 关键词2"
  # 自定义参数
  githubURL = "https://github.com/username"
  twitter = "@username"
```

## 3. 语言配置
```toml
defaultContentLanguage = "zh-cn"
defaultContentLanguageInSubdir = false

[languages]
  [languages.zh-cn]
    title = "我的网站"
    weight = 1
```

## 4. 菜单配置
```toml
[menu]
  [[menu.main]]
    identifier = "about"
    name = "关于"
    url = "/about/"
    weight = 10
    
  [[menu.main]]
    identifier = "posts"
    name = "文章"
    url = "/posts/"
    weight = 20
```

## 5. 分页配置
```toml
[pagination]
  pagerSize = 10  # 每页文章数
```

## 6. 服务配置
```toml
[services]
  [services.googleAnalytics]
    ID = "UA-12345678-9"
```

## 7. 输出格式
```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
  page = ["HTML"]
```

## 8. 开发服务器
```toml
[server]
  port = 1313
```

## 9. 构建选项
```toml
[build]
  writeStats = true  # 生成构建统计
  noChmod = true     # 不修改文件权限
  useResourceCacheWhen = "fallback"
```

## 10. 安全策略
```toml
[security]
  [security.exec]
    allow = ['^dart-sass-embedded$', '^go$', '^npx$', '^postcss$']
    osEnv = ['(?i)PATH|PATHEXT|APPDATA|TMP|TEMP|USERPROFILE']
```

## 11. 缓存配置
```toml
[caches]
  [caches.getjson]
    dir = ":cacheDir/:project"
    maxAge = -1
```

## 12. 完整示例
```toml
baseURL = "https://example.org/"
languageCode = "zh-cn"
title = "我的博客"
theme = "hugo-theme-stack"
paginate = 10
enableRobotsTXT = true

[params]
  author = "张三"
  description = "这是我的个人博客"
  subtitle = "记录技术与生活"
  
  [params.social]
    GitHub = "username"
    Twitter = "username"
    Email = "me@example.com"

[menu]
  [[menu.main]]
    name = "首页"
    url = "/"
    weight = 1
  [[menu.main]]
    name = "文章"
    url = "/posts/"
    weight = 2
  [[menu.main]]
    name = "标签"
    url = "/tags/"
    weight = 3

[outputs]
  home = ["HTML", "RSS"]
```

## 13. 常用命令
```bash
# 本地预览
hugo server

# 构建网站
hugo

# 构建到指定目录
hugo -d ./public

# 构建时清理缓存
hugo --gc
```

这些是 Hugo 配置的基础部分，具体配置会根据你使用的主题有所不同。
