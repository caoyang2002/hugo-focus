# 文章加密

> 注意，由于 Hugo 是静态生成，这种加密方式只是掩耳盗铃，用户仍然可以通过逆向 `js` 获取到原文。
>
> 因此，请勿编写不可公开的信息，以免泄露。

```bash
{{< notice note >}}
这是一个注意事项
{{< /notice >}}
```

```bash
{{<crypto>}}
掩耳盗铃
{{</crypto >}}
```

```bash
{{% protected "123" %}}
掩耳盗铃
{{% /protected %}}
```
