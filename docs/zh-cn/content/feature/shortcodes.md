# 短代码

## book

可以列出书本的信息

```go
{{< book
    cover=""
    title_zh="书名"
    title_en="name"
    author="作者"
    translator="译者"
    publisher="出版社"
    year="出版日期"
    description="介绍"
    isbn="isbn"
    rating="评分"
    page="页数"
    colection="丛书系列"
    recommendation="推荐理由"
>}}
```

## collapse

## crypto

加密

```go
{{<crypto>}}
加密内容
{{</crypto >}}
```

## details

### 基本使用

```go
{{<details  summary="概要内容" >}}
详细信息
{{</details>}}
```

| 参数            | 必选 | 默认值  | 说明                                 |
| :-------------- | :--- | :------ | :----------------------------------- |
| `summary`       | ✅    | 无      | 显示在可点击区域的摘要文本           |
| `content`       | ❌    | 无      | 直接指定的内容（与 `.Inner` 二选一） |
| `openByDefault` | ❌    | `false` | 是否默认展开，设置为 `"true"` 时展开 |

### 使用参数传递内容（短格式）

```go
{{< details 
    summary="点击查看详细内容" 
    content="这是详细内容，支持 **Markdown** 格式。比如：`代码`、**粗体**、*斜体*等。"
>}}
```
### 使用内部内容（长格式）

```go
{{< details summary="点击查看详细内容" >}}
这是详细内容，支持 **Markdown** 格式。
- 列表项1
- 列表项2
{{< /details >}}
```

## echarts

ECharts 图表

```go
{{< echarts width="100%" height="500px" >}}
{{</echarts>}}
```

## notice

提示信息

```go
{{< notice note >}}
这是一个注意事项
{{< /notice >}}
```

## protected

## wordcloud


## alert

```go
go :=fds
{{< alert "info" >}}
这是一条信息提示。
{{< /alert >}}

{{< alert "warning" >}}
这是一个警告信息！
{{< /alert >}}

{{< alert "success" >}}
操作成功！
{{< /alert >}}

{{< alert "danger" >}}
危险操作！
{{< /alert >}}
```

<div class="alert alert-danger">
    <div class="alert-icon">❌</div>
    <div class="alert-content"><div class="alert-body">危险操作！</div>
    </div>
</div>
