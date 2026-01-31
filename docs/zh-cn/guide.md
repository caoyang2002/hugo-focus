# 快速开始

安装 Hugo: https://gohugo.io/installation/

## 创建网站

```bash
hugo new site quickstart
cd quickstart
git init
git submodule add https://github.com/caoyang2002/themes/tree/main/hugo-focus.git themes/hugo-focus
echo "theme = 'hugo-focus'" >> hugo.toml
hugo server
```

## 基本说明

```bash
# 克隆主题
git clone https://github.com/caoyang2002/hugo-focus.git
```

放在你自己主题的 `theme` 目录下，然后在根目录的 `hugo.toml` 中配置

```bash
theme = 'hugo-focus'
```
