# 数学公式
[查看页面测试](http://localhost:1313/post/2025/01/hugo-focus-info/)

## 前言
本项目使用的方案是 KaTex
Hugo 的 Goldmark 渲染器与 KaTeX 兼容性好
不会干扰 Hugo 的短代码系统

### 优点

1. 性能优异

KaTeX 比 MathJax 快很多
- 编译速度更快
- 更小的文件体积
- 更快的页面加载速度

2. 双模式支持
- 本地模式：适合内网、离线环境
- CDN 模式：利用缓存，减少服务器负担

3. 配置简单
- 只需几行配置即可使用
自动识别 $$ 和 $ 分隔符

5. SSG 友好

纯客户端渲染，适合静态网站
不会影响构建时间
❌ 缺点

1. 功能相对有限

不支持所有 LaTeX 包：KaTeX 只支持核心 LaTeX 功能
某些复杂公式无法渲染：如复杂的表格、某些数学环境
扩展性较差：无法像 MathJax 那样加载额外扩展
2. 生态系统较小

插件和扩展较少
社区支持不如 MathJax 广泛
3. 渲染时机问题

需要在 DOM 加载完成后执行
动态内容需要手动重新渲染
4. 兼容性问题

某些浏览器可能不支持某些特性
移动端可能有性能问题

## 一、基本使用

### 行内公式

```latex
$1 + 1 = 2$
```

### 块级公式

````
$$1 + 1 = 2$$
````

复杂公式

````latex
$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
    \mathbf{i} & \mathbf{j} & \mathbf{k} \\
    \frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
    \frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
    \end{vmatrix}
$$
````
## 二、LaTex 语法基础



### 1. 如何插入公式

LATEX 的数学公式有两种：行内公式和块级公式（行间公式）。行内公式放在文中与其它文字混编，块级公式单独成行。

行内公式可以用如下方法表示：

```latex
$数学公式$
```

块级公式可以用如下方法表示：

```latex
$$数学公式$$
```

### 函数、符号及特殊字符

#### 声调 / 变音符号
```
\dot{a}, \ddot{a}, \acute{a}, \grave{a}
```

˙a,¨a,´a,`a

```
\check{a}, \breve{a}, \tilde{a}, \bar{a}
```

ˇa,˘a,~a,¯a

```
\hat{a}, \widehat{a}, \vec{a}
```

^a,ˆa,→a

### 标准函数[#](https://www.cnblogs.com/1024th/p/11623258.html#720007378)

指数

```
\exp_a b = a^b, \exp b = e^b, 10^m
```

expab=ab,expb=eb,10m

对数

```
\ln c, \lg d = \log e, \log_{10} f
```

lnc,lgd=loge,log10f

三角函数

```
\sin a, \cos b, \tan c, \cot d, \sec e, \csc f
```

sina,cosb,tanc,cotd,sece,cscf

```
\arcsin a, \arccos b, \arctan c
```

arcsina,arccosb,arctanc

```
\arccot d, \arcsec e, \arccsc f
```

arccotd,arcsece,arccscf

```
\sinh a, \cosh b, \tanh c, \coth d
```

sinha,coshb,tanhc,cothd

```
\operatorname{sh}k, \operatorname{ch}l, \operatorname{th}m, \operatorname{coth}n
```

shk,chl,thm,cothn

```
\operatorname{argsh}o, \operatorname{argch}p, \operatorname{argth}q
```

argsho,argchp,argthq

符号函数，绝对值

```
\sgn r, \left\vert s \right\vert
```

sgnr,|s|

最大值，最小值

```
\min(x,y), \max(x,y)
```

min(x,y),max(x,y)

### 界限，极限[#](https://www.cnblogs.com/1024th/p/11623258.html#2637284860)

```
\min x, \max y, \inf s, \sup t
```

minx,maxy,infs,supt

```
\lim u, \liminf v, \limsup w
```

limu,liminfv,limsupw

```
\lim_{x \to \infty} \frac{1}{n(n+1)}
```

limx→∞1n(n+1)

```
\dim p, \deg q, \det m, \ker\phi
```

dimp,degq,detm,kerϕ

### 投射[#](https://www.cnblogs.com/1024th/p/11623258.html#534894502)

```
\Pr j, \hom l, \lVert z \rVert, \arg z
```

Prj,homl,∥z∥,argz

### 微分及导数[#](https://www.cnblogs.com/1024th/p/11623258.html#1589851770)

```
dt, \mathrm{d}t, \partial t, \nabla\psi
```

dt,dt,∂t,∇ψ

```
dy/dx, \mathrm{d}y/\mathrm{d}x, \frac{dy}{dx}, \frac{\mathrm{d}y}{\mathrm{d}x}, \frac{\partial^2}{\partial x_1\partial x_2}y
```

dy/dx,dy/dx,dydx,dydx,∂2∂x1∂x2y

```
\prime, \backprime, f^\prime, f', f'', f^{(3)}, \dot y, \ddot y
```

′,‵,f′,f′,f′′,f(3),˙y,¨y

### 类字母符号及常数[#](https://www.cnblogs.com/1024th/p/11623258.html#392933961)

```
\infty, \aleph, \complement, \backepsilon, \eth, \Finv, \hbar
```

∞,ℵ,∁,∍,ð,Ⅎ,ℏ

```
\Im, \imath, \jmath, \Bbbk, \ell, \mho, \wp, \Re, \circledS
```

I,ı,ȷ,k,ℓ,℧,℘,R,Ⓢ

### 模运算[#](https://www.cnblogs.com/1024th/p/11623258.html#1350689296)

```
s_k \equiv 0 \pmod{m}
```

sk≡0(modm)

```
a \bmod b
```

amodb

```
\gcd(m, n), \operatorname{lcm}(m, n)
```

gcd(m,n),lcm(m,n)

```
\mid, \nmid, \shortmid, \nshortmid
```

∣,∤,∣,_

### 根号[#](https://www.cnblogs.com/1024th/p/11623258.html#2451290932)

```
\surd, \sqrt{2}, \sqrt[n]{}, \sqrt[3]{\frac{x^3+y^3}{2}}
```

√,√2,n√,3√x3+y32

### 运算符[#](https://www.cnblogs.com/1024th/p/11623258.html#3791753530)

```
+, -, \pm, \mp, \dotplus
```

+,−,±,∓,∔

```
\times, \div, \divideontimes, /, \backslash
```

×,÷,⋇,/,∖

```
\cdot, * \ast, \star, \circ, \bullet
```

⋅,∗∗,⋆,∘,∙

```
\boxplus, \boxminus, \boxtimes, \boxdot
```

⊞,⊟,⊠,⊡

```
\oplus, \ominus, \otimes, \oslash, \odot
```

⊕,⊖,⊗,⊘,⊙

```
\circleddash, \circledcirc, \circledast
```

⊝,⊚,⊛

```
\bigoplus, \bigotimes, \bigodot
```

⨁,⨂,⨀

### 集合[#](https://www.cnblogs.com/1024th/p/11623258.html#2002219)

```
\{ \}, \O \empty \emptyset, \varnothing
```

{},∅∅∅,∅

```
\in, \notin \not\in, \ni, \not\ni
```

∈,∉∉,∋,∌

```
\cap, \Cap, \sqcap, \bigcap
```

∩,⋒,⊓,⋂

```
\cup, \Cup, \sqcup, \bigcup, \bigsqcup, \uplus, \biguplus
```

∪,⋓,⊔,⋃,⨆,⊎,⨄

```
\setminus, \smallsetminus, \times
```

∖,∖,×

```
\subset, \Subset, \sqsubset
```

⊂,⋐,⊏

```
\supset, \Supset, \sqsupset
```

⊃,⋑,⊐

```
\subseteq, \nsubseteq, \subsetneq, \varsubsetneq, \sqsubseteq
```

⊆,⊈,⊊,,⊑

```
\supseteq, \nsupseteq, \supsetneq, \varsupsetneq, \sqsupseteq
```

⊇,⊉,⊋,,⊒

```
\subseteqq, \nsubseteqq, \subsetneqq, \varsubsetneqq
```

⫅,,⫋,

```
\supseteqq, \nsupseteqq, \supsetneqq, \varsupsetneqq
```

⫆,\],⫌,

### 关系符号[#](https://www.cnblogs.com/1024th/p/11623258.html#4071166691)

```
=, \ne, \neq, \equiv, \not\equiv
```

=,≠,≠,≡,≢

`\doteq, \doteqdot,` `\overset{\underset{\mathrm{def}}{}}{=},` `:=`

≐,≑,def=,:=

```
\sim, \nsim, \backsim, \thicksim, \simeq, \backsimeq, \eqsim, \cong, \ncong
```

∼,≁,∽,∼,≃,⋍,≂,≅,≆

```
\approx, \thickapprox, \approxeq, \asymp, \propto, \varpropto
```

≈,≈,≊,≍,∝,∝

```
<, \nless, \ll, \not\ll, \lll, \not\lll, \lessdot
```

<,≮,≪,≪/,⋘,⋘/,⋖

```
>, \ngtr, \gg, \not\gg, \ggg, \not\ggg, \gtrdot
```

\>,≯,≫,≫/,⋙,⋙/,⋗

```
\le, \leq, \lneq, \leqq, \nleq, \nleqq, \lneqq, \lvertneqq
```

≤,≤,⪇,≦,≰,,≨,

```
\ge, \geq, \gneq, \geqq, \ngeq, \ngeqq, \gneqq, \gvertneqq
```

≥,≥,⪈,≧,≱,,≩,

```
\lessgtr, \lesseqgtr, \lesseqqgtr, \gtrless, \gtreqless, \gtreqqless
```

≶,⋚,⪋,≷,⋛,⪌

```
\leqslant, \nleqslant, \eqslantless
```

⩽,,⪕

```
\geqslant, \ngeqslant, \eqslantgtr
```

⩾,,⪖

```
\lesssim, \lnsim, \lessapprox, \lnapprox
```

≲,⋦,⪅,⪉

```
\gtrsim, \gnsim, \gtrapprox, \gnapprox
```

≳,⋧,⪆,⪊

```
\prec, \nprec, \preceq, \npreceq, \precneqq
```

≺,⊀,⪯,⋠,⪵

```
\succ, \nsucc, \succeq, \nsucceq, \succneqq
```

≻,⊁,⪰,⋡,⪶

```
\preccurlyeq, \curlyeqprec
```

≼,⋞

```
\succcurlyeq, \curlyeqsucc
```

≽,⋟

```
\precsim, \precnsim, \precapprox, \precnapprox
```

≾,⋨,⪷,⪹

```
\succsim, \succnsim, \succapprox, \succnapprox
```

≿,⋩,⪸,⪺

### 几何符号[#](https://www.cnblogs.com/1024th/p/11623258.html#4020928987)

```
\parallel, \nparallel, \shortparallel, \nshortparallel
```

∥,∦,∥,

```
\perp, \angle, \sphericalangle, \measuredangle, 45^\circ
```

⊥,∠,∢,∡,45∘

```
\Box, \blacksquare, \diamond, \Diamond \lozenge, \blacklozenge, \bigstar
```

□,■,⋄,◊◊,⧫,★

```
\bigcirc, \triangle, \bigtriangleup, \bigtriangledown
```

◯,△,△,▽

```
\vartriangle, \triangledown
```

△,▽

```
\blacktriangle, \blacktriangledown, \blacktriangleleft, \blacktriangleright
```

▲,▼,◀,▶

### 逻辑符号[#](https://www.cnblogs.com/1024th/p/11623258.html#1038897120)

```
\forall, \exists, \nexists
```

∀,∃,∄

```
\therefore, \because, \And
```

∴,∵,&

```
\or \lor \vee, \curlyvee, \bigvee
```

∨,∨,∨,⋎,⋁

```
\and \land \wedge, \curlywedge, \bigwedge
```

∧,∧,∧,⋏,⋀

```
\bar{q}, \bar{abc}, \overline{q}, \overline{abc},
\lnot \neg, \not\operatorname{R}, \bot, \top
```

¯q,¯abc,¯¯¯q,¯¯¯¯¯¯¯¯abc,

¬¬,/R,⊥,⊤

```
\vdash \dashv, \vDash, \Vdash, \models
```

⊢,⊣,⊨,⊩,⊨

```
\Vvdash \nvdash \nVdash \nvDash \nVDash
```

⊪,⊬,⊮,⊭,⊯

```
\ulcorner \urcorner \llcorner \lrcorner
```

┌┐└┘

### 箭头[#](https://www.cnblogs.com/1024th/p/11623258.html#3173769961)

```
\Rrightarrow, \Lleftarrow
```

⇛,⇚

```
\Rightarrow, \nRightarrow, \Longrightarrow \implies
```

⇒,⇏,⟹,⟹

```
\Leftarrow, \nLeftarrow, \Longleftarrow
```

⇐,⇍,⟸

```
\Leftrightarrow, \nLeftrightarrow, \Longleftrightarrow \iff
```

⇔,⇎,⟺⟺

```
\Uparrow, \Downarrow, \Updownarrow
```

⇑,⇓,⇕

```
\rightarrow \to, \nrightarrow, \longrightarrow
```

→→,↛,⟶

```
\leftarrow \gets, \nleftarrow, \longleftarrow
```

←←,↚,⟵

```
\leftrightarrow, \nleftrightarrow, \longleftrightarrow
```

↔,↮,⟷

```
\uparrow, \downarrow, \updownarrow
```

↑,↓,↕

```
\nearrow, \swarrow, \nwarrow, \searrow
```

↗,↙,↖,↘

```
\mapsto, \longmapsto
```

↦,⟼

```
\rightharpoonup \rightharpoondown \leftharpoonup \leftharpoondown \upharpoonleft \upharpoonright \downharpoonleft \downharpoonright \rightleftharpoons \leftrightharpoons
```

⇀,⇁,↼,↽,↿,↾,⇃,⇂,⇌,⇋

```
\curvearrowleft \circlearrowleft \Lsh \upuparrows \rightrightarrows \rightleftarrows \rightarrowtail \looparrowright
```

↶,↺,↰,⇈,⇉,⇄,↣,↬

```
\curvearrowright \circlearrowright \Rsh \downdownarrows \leftleftarrows \leftrightarrows \leftarrowtail \looparrowleft
```

↷,↻,↱,⇊,⇇,⇆,↢,↫

```
\hookrightarrow \hookleftarrow \multimap \leftrightsquigarrow \rightsquigarrow \twoheadrightarrow \twoheadleftarrow
```

↪,↩,⊸,↭,⇝,↠,↞

### 特殊符号[#](https://www.cnblogs.com/1024th/p/11623258.html#3116877381)

省略号：数学公式中常见的省略号有两种，`\ldots` 表示与文本底线对齐的省略号，`\cdots` 表示与文本中线对齐的省略号。

```
\amalg \% \dagger \ddagger \ldots \cdots
```

⨿%†‡…⋯

```
\smile \frown \wr \triangleleft \triangleright
```

⌣⌢≀◃▹

```
\diamondsuit, \heartsuit, \clubsuit, \spadesuit, \Game, \flat, \natural, \sharp
```

♢,♡,♣,♠,⅁,♭,♮,♯

### 未分类[#](https://www.cnblogs.com/1024th/p/11623258.html#1915589356)

```
\diagup \diagdown \centerdot \ltimes \rtimes \leftthreetimes \rightthreetimes
```

╱,╲,⋅,⋉,⋊,⋋,⋌

```
\eqcirc \circeq \triangleq \bumpeq \Bumpeq \doteqdot \risingdotseq \fallingdotseq
```

≖,≗,≜,≏,≎,≑,≓,≒

```
\intercal \barwedge \veebar \doublebarwedge \between \pitchfork
```

⊺,⊼,⊻,⩞,≬,⋔

```
\vartriangleleft \ntriangleleft \vartriangleright \ntriangleright
```

⊲,⋪,⊳,⋫

```
\trianglelefteq \ntrianglelefteq \trianglerighteq \ntrianglerighteq
```

⊴,⋬,⊵,⋭

关于这些符号的更多语义，参阅 [TeX Cookbook](https://web.archive.org/web/20160305074303/https://www.math.upenn.edu/tex-stuff/cookbook.pdf) 的简述。

## 上标、下标及积分等[#](https://www.cnblogs.com/1024th/p/11623258.html#3802211841)

功能|语法|效果

`^` 表示上标, `_` 表示下标。如果上下标的内容多于一个字符，需要用 `{}` 将这些内容括成一个整体。上下标可以嵌套，也可以同时使用。

上标

```
a^2
```

a2

下标

```
a_2
```

a2

组合

```
a^{2+2}
```

a2+2

```
a_{i,j}
```

ai,j

结合上下标

```
x_2^3
```

x32

前置上下标

```
{}_1^2\!X_3^4
```

21X43

导数（**HTML**）

```
x'
```

x′

导数（**PNG**）

```
x^\prime
```

x′

导数（**错误**）

```
x\prime
```

x′

导数点

```
\dot{x}
```

˙x

```
\ddot{y}
```

¨y

向量

`\vec{c}`（只有一个字母）

→c

```
\overleftarrow{a b}
```

←ab

```
\overrightarrow{c d}
```

→cd

```
\overleftrightarrow{a b}
```

↔ab

```
\widehat{e f g}
```

ˆefg

上弧

（注: 正确应该用 \overarc，但在这里行不通。要用建议的语法作为解决办法。）（使用 \ overarc 时需要引入 {arcs} 包。）

```
\overset{\frown} {AB}
```

⌢AB

上划线

```
\overline{h i j}
```

¯¯¯¯¯¯¯hij

下划线

```
\underline{k l m}
```

klm–––––

上括号

```
\overbrace{1+2+\cdots+100}
```

1+2+⋯+100

```
\begin{matrix} 5050 \\ \overbrace{ 1+2+\cdots+100 } \end{matrix}
```

50501+2+⋯+100

下括号

```
\underbrace{a+b+\cdots+z}
```

a+b+⋯+z

```
\begin{matrix} \underbrace{ a+b+\cdots+z } \\ 26 \end{matrix}
```

a+b+⋯+z26

求和（累加）

```
\sum_{k=1}^N k^2
```

N∑k=1k2

```
\begin{matrix} \sum_{k=1}^N k^2 \end{matrix}
```

∑Nk=1k2

求积（累乘）

```
\prod_{i=1}^N x_i
```

N∏i=1xi

```
\begin{matrix} \prod_{i=1}^N x_i \end{matrix}
```

∏Ni=1xi

上积

```
\coprod_{i=1}^N x_i
```

N∐i=1xi

```
\begin{matrix} \coprod_{i=1}^N x_i \end{matrix}
```

∐Ni=1xi

极限

```
\lim_{n \to \infty}x_n
```

limn→∞xn

```
\begin{matrix} \lim_{n \to \infty}x_n \end{matrix}
```

limn→∞xn

积分

```
\int_{-N}^{N} e^x\, {\rm d}x
```

∫N−Nexdx

本例中 `\,` 和 `{\rm d}` 部分可省略，但建议加入，能使式子更美观。`{\rm d}`可以用`\mathrm{d}`等价替换。

`\begin{matrix} \int_{-N}^{N} e^x\, \mathrm{d}x \end{matrix}`（矩阵中积分符号变小）

∫N−Nexdx

双重积分

```
\iint_{D}^{W} \, \mathrm{d}x\,\mathrm{d}y
```

∬WDdxdy

三重积分

```
\iiint_{E}^{V} \, \mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z
```

∭VEdxdydz

闭合的曲线、曲面积分

```
\oint_{C} x^3\, \mathrm{d}x + 4y^2\, \mathrm{d}y
```

∮Cx3dx+4y2dy

交集

```
\bigcap_1^{n} p
```

n⋂1p

并集

```
\bigcup_1^{k} p
```

k⋃1p

## 分数[#](https://www.cnblogs.com/1024th/p/11623258.html#1358100665)

通常使用 `\frac {分子} {分母}` 命令产生一个分数，分数可嵌套。
便捷情况可直接输入 `\frac ab` 来快速生成一个 ab 。
如果分式很复杂，亦可使用 `分子 \over 分母` 命令，此时分数仅有一层。

功能|语法|效果

分数

```
\frac{2}{4}=0.5
```

24=0.5

小型分数

```
\tfrac{2}{4} = 0.5
```

24=0.5

连分式（大型嵌套分式）

```
\cfrac{2}{c + \cfrac{2}{d + \cfrac{2}{4}}} = a
```

2c+2d+24=a

大型不嵌套分式

```
\dfrac{2}{4} = 0.5 \qquad \dfrac{2}{c + \dfrac{2}{d + \dfrac{2}{4}}} = a
```

24=0.52c+2d+24=a

二项式系数

```
\dbinom{n}{r}=\binom{n}{n-r}=\mathrm{C}_n^r=\mathrm{C}_n^{n-r}
```

(nr)=(nn−r)=Crn=Cn−rn

小型二项式系数

```
\tbinom{n}{r}=\tbinom{n}{n-r}=\mathrm{C}_n^r=\mathrm{C}_n^{n-r}
```

(nr)=(nn−r)=Crn=Cn−rn

大型二项式系数

```
\binom{n}{r}=\dbinom{n}{n-r}=\mathrm{C}_n^r=\mathrm{C}_n^{n-r}
```

(nr)=(nn−r)=Crn=Cn−rn

在以e为底的指数函数、极限和积分中尽量不要使用 `\frac` 符号：它会使整段函数看起来很怪，而且可能产生歧义。也正是因此它在专业数学排版中几乎从不出现。
横着写这些分式，中间使用斜线间隔 `/` （用斜线代替分数线）。

- 例子：

```lua
Copy\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
e^{i\frac{\pi}2} \quad e^{\frac{i\pi}2}& e^{i\pi/2} \\
\int_{-\frac\pi2}^\frac\pi2 \sin x\,dx & \int_{-\pi/2}^{\pi/2}\sin x\,dx \\
\end{array}
```

- 显示：



BadBettereiπ2eiπ2eiπ/2∫π2−π2sinxdx∫π/2−π/2sinxdx



## 矩阵、条件表达式、方程组[#](https://www.cnblogs.com/1024th/p/11623258.html#1208753642)

语法：

```ruby
Copy\begin{类型}
公式内容
\end{类型}
```

类型可以是：矩阵 `matrix` `pmatrix` `bmatrix` `Bmatrix` `vmatrix` `Vmatrix`、条件表达式 `cases`、多行对齐方程式 `aligned`、数组 `array`。

在公式内容中：在每一行中插入 `&` 来指定需要**对齐**的内容，在每行结尾处使用 `\\` **换行**。

### 无框矩阵[#](https://www.cnblogs.com/1024th/p/11623258.html#1444699067)

在开头使用 `begin{matrix}`，在结尾使用 `end{matrix}`，在中间插入矩阵元素，每个元素之间插入 `&` ，并在每行结尾处使用 `\\` 。

```ruby
Copy\begin{matrix}
x & y \\
z & v
\end{matrix}
```

xyzv

### 有框矩阵[#](https://www.cnblogs.com/1024th/p/11623258.html#1982397202)

在开头将 `matrix` 替换为 `pmatrix` `bmatrix` `Bmatrix` `vmatrix` `Vmatrix` 。

```ruby
Copy\begin{vmatrix}
x & y \\
z & v
\end{vmatrix}
```

∣∣∣xyzv∣∣∣

```ruby
Copy\begin{Vmatrix}
x & y \\
z & v
\end{Vmatrix}
```

∥∥∥xyzv∥∥∥

使用 `\cdots` ⋯ , `\ddots` ⋱ , `\vdots` ⋮ 来输入**省略符号**。

```ruby
Copy\begin{bmatrix}
0      & \cdots & 0      \\
\vdots & \ddots & \vdots \\
0      & \cdots & 0
\end{bmatrix}
```

⎡⎢ ⎢⎣0⋯0⋮⋱⋮0⋯0⎤⎥ ⎥⎦

```ruby
Copy\begin{Bmatrix}
x & y \\
z & v
\end{Bmatrix}
```

{xyzv}

```ruby
Copy\begin{pmatrix}
x & y \\
z & v
\end{pmatrix}
```

(xyzv)

### 条件表达式[#](https://www.cnblogs.com/1024th/p/11623258.html#578375934)

```fsharp
Copyf(n) =
\begin{cases} 
n/2,  & \text{if }n\text{ is even} \\
3n+1, & \text{if }n\text{ is odd}
\end{cases}
```

f(n)={n/2,if n is even3n+1,if n is odd

### 多行等式、同余式[#](https://www.cnblogs.com/1024th/p/11623258.html#2665537139)

人们经常想要一列整齐且居中的方程式序列。使用 `\begin{aligned}…\end{aligned}`。

```ruby
Copy\begin{aligned}
f(x) & = (m+n)^2 \\
     & = m^2+2mn+n^2 \\
\end{aligned}
```

f(x)=(m+n)2=m2+2mn+n2

```scss
Copy\begin{aligned}
3^{6n+3}+4^{6n+3} 
& \equiv (3^3)^{2n+1}+(4^3)^{2n+1}\\  
& \equiv 27^{2n+1}+64^{2n+1}\\  
& \equiv 27^{2n+1}+(-27)^{2n+1}\\ 
& \equiv 27^{2n+1}-27^{2n+1}\\
& \equiv 0 \pmod{91}\\
\end{aligned}
```

36n+3+46n+3≡(33)2n+1+(43)2n+1≡272n+1+642n+1≡272n+1+(−27)2n+1≡272n+1−272n+1≡0(mod91)

```ruby
Copy\begin{alignedat}{3}
f(x) & = (m-n)^2 \\
f(x) & = (-m+n)^2 \\
     & = m^2-2mn+n^2 \\
\end{alignedat}
```

f(x)=(m−n)2f(x)=(−m+n)2=m2−2mn+n2

### 方程组[#](https://www.cnblogs.com/1024th/p/11623258.html#311818683)

```ruby
Copy\begin{cases}
3x + 5y +  z \\
7x - 2y + 4z \\
-6x + 3y + 2z
\end{cases}
```



⎧⎨⎩3x+5y+z7x−2y+4z−6x+3y+2z



或

```css
Copy\left\{\begin{aligned}
3x + 5y +  z \\
7x - 2y + 4z \\
-6x + 3y + 2z
\end{aligned}\right.
```



⎧⎪⎨⎪⎩3x+5y+z7x−2y+4z−6x+3y+2z



## 数组与表格[#](https://www.cnblogs.com/1024th/p/11623258.html#1772409308)

通常，一个格式化后的表格比单纯的文字或排版后的文字更具有可读性。数组和表格均以 `\begin{array}` 开头，并在其后定义列数及每一列的文本对齐属性，`c` `l` `r` 分别代表居中、左对齐及右对齐。若需要插入垂直分割线，在定义式中插入 `|` ，若要插入水平分割线，在下一行输入前插入 `\hline` 。与矩阵相似，每行元素间均须要插入 `&` ，每行元素以 `\\` 结尾，最后以 `\end{array}` 结束数组。

- 例子：

```fsharp
Copy\begin{array}{c|lcr}
n & \text{左对齐} & \text{居中对齐} & \text{右对齐} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i
\end{array}
```

- 显示：



n左对齐居中对齐右对齐10.2411252−1189−83−2020001+10i



- 例子:

```php
Copy\begin{array}{lcl}
z        & = & a \\
f(x,y,z) & = & x + y + z 
\end{array}
```

- 显示：

z=af(x,y,z)=x+y+z

- 例子:

```php
Copy\begin{array}{lcr}
z        & = & a \\
f(x,y,z) & = & x + y + z    
\end{array}
```

- 显示:

z=af(x,y,z)=x+y+z

- 例子:

```css
Copy\begin{array}{ccc}
a & b & S \\
\hline
0&0&1\\
0&1&1\\
1&0&1\\
1&1&0\\
\end{array}
```

- 显示:



abS001011101110



### 嵌套数组或表格[#](https://www.cnblogs.com/1024th/p/11623258.html#3414663000)

多个数组/表格可 **互相嵌套** 并组成一组数组/一组表格。
使用嵌套前必须声明 `$$` 符号。

- 例子：

```erlang
Copy% outer vertical array of arrays 外层垂直表格
\begin{array}{c}
    % inner horizontal array of arrays 内层水平表格
    \begin{array}{cc}
        % inner array of minimum values 内层"最小值"数组
        \begin{array}{c|cccc}
        \text{min} & 0 & 1 & 2 & 3\\
        \hline
        0 & 0 & 0 & 0 & 0\\
        1 & 0 & 1 & 1 & 1\\
        2 & 0 & 1 & 2 & 2\\
        3 & 0 & 1 & 2 & 3
        \end{array}
    &
        % inner array of maximum values 内层"最大值"数组
        \begin{array}{c|cccc}
        \text{max}&0&1&2&3\\
        \hline
        0 & 0 & 1 & 2 & 3\\
        1 & 1 & 1 & 2 & 3\\
        2 & 2 & 2 & 2 & 3\\
        3 & 3 & 3 & 3 & 3
        \end{array}
    \end{array}
    % 内层第一行表格组结束
    \\
    % inner array of delta values 内层第二行Delta值数组
        \begin{array}{c|cccc}
        \Delta&0&1&2&3\\
        \hline
        0 & 0 & 1 & 2 & 3\\
        1 & 1 & 0 & 1 & 2\\
        2 & 2 & 1 & 0 & 1\\
        3 & 3 & 2 & 1 & 0
        \end{array}
        % 内层第二行表格组结束
\end{array}
```

- 显示：



min012300000101112012230123max012300123111232222333333Δ012300123110122210133210



### 用数组实现带分割符号的矩阵[#](https://www.cnblogs.com/1024th/p/11623258.html#1385694299)

- 例子：

```powershell
Copy$$
\left[
    \begin{array}{cc|c}
      1&2&3\\
      4&5&6
    \end{array}
\right]
$$
```

- 显示：



[123456]



其中 `cc|c` 代表在一个三列矩阵中的第二和第三列之间插入分割线。

## 字体[#](https://www.cnblogs.com/1024th/p/11623258.html#3728619149)

### 希腊字母[#](https://www.cnblogs.com/1024th/p/11623258.html#42885112)

输入 `\小写希腊字母英文全称` 和 `\首字母大写希腊字母英文全称` 来分别输入小写和大写希腊字母。

```
\Alpha \Beta \Gamma \Delta \Epsilon \Zeta \Eta \Theta
```

ABΓΔEZHΘ

```
\Iota \Kappa \Lambda \Mu \Nu \Xi \Omicron \Pi
```

IKΛMNOΞΠ

```
\Rho \Sigma \Tau \Upsilon \Phi \Chi \Psi \Omega
```

PΣTΥΦXΨΩ

```
\alpha \beta \gamma \delta \epsilon \zeta \eta \theta
```

αβγδϵζηθ

```
\iota \kappa \lambda \mu \nu \omicron \xi \pi
```

ικλμνoξπ

```
\rho \sigma \tau \upsilon \phi \chi \psi \omega
```

ρστυϕχψω

**部分字母有变量专用形式，以 `\var-` 开头。**

```
\varepsilon \digamma \varkappa \varpi
```

εϝϰϖ

```
\varrho \varsigma \vartheta \varphi
```

ϱςϑφ

### 希伯来符号[#](https://www.cnblogs.com/1024th/p/11623258.html#656678623)

```
\aleph \beth \gimel \daleth
```

ℵℶℷℸ

### 部分字体的简称[#](https://www.cnblogs.com/1024th/p/11623258.html#2933536141)

若要对公式的某一部分字符进行字体转换，可以用 `{\字体 {需转换的部分字符}}` 命令，其中 `\字体` 部分可以参照下表选择合适的字体。一般情况下，公式默认为意大利体 italic 。

|输入|说明|显示|输入|说明|显示|
|:--😐:--😐:--😐:--😐:--😐:--😐:--😐
|\rm|罗马体|Sample|\cal|花体|SAMPLE|
|\it|意大利体|Sample|\Bbb|黑板粗体|SAMPLE|
|\bf|粗体|Sample|\mit|数学斜体|SAMPLE|
|\sf|等线体|Sample|\scr|手写体|SAMPLE|
|\tt|打字机体|Sample|\frak|旧德式字体|Sample|

### 所有字体[#](https://www.cnblogs.com/1024th/p/11623258.html#1729835835)

#### 黑板报粗体

```
\mathbb{ABCDEFGHI}
```

ABCDEFGHI

```
\mathbb{JKLMNOPQR}
```

JKLMNOPQR

```
\mathbb{STUVWXYZ}
```

STUVWXYZ

#### 粗体

```
\mathbf{ABCDEFGHI}
```

ABCDEFGHI

```
\mathbf{JKLMNOPQR}
```

JKLMNOPQR

```
\mathbf{STUVWXYZ}
```

STUVWXYZ

```
\mathbf{abcdefghijklm}
```

abcdefghijklm

```
\mathbf{nopqrstuvwxyz}
```

nopqrstuvwxyz

```
\mathbf{0123456789}
```

0123456789

#### 粗体希腊字母

```
\boldsymbol{\Alpha\Beta\Gamma\Delta\Epsilon\Zeta\Eta\Theta}
```

ABΓΔEZHΘ

```
\boldsymbol{\Iota\Kappa\Lambda\Mu\Nu\Xi\Pi\Rho}
```

IKΛMNΞΠP

```
\boldsymbol{\Sigma\Tau\Upsilon\Phi\Chi\Psi\Omega}
```

ΣTΥΦXΨΩ

```
\boldsymbol{\alpha\beta\gamma\delta\epsilon\zeta\eta\theta}
```

αβγδϵζηθ

```
\boldsymbol{\iota\kappa\lambda\mu\nu\xi\pi\rho}
```

ικλμνξπρ

```
\boldsymbol{\sigma\tau\upsilon\phi\chi\psi\omega}
```

στυϕχψω

```
\boldsymbol{\varepsilon\digamma\varkappa\varpi}
```

εϝϰϖ

```
\boldsymbol{\varrho\varsigma\vartheta\varphi}
```

ϱςϑφ

#### 斜体（拉丁字母默认）

```
\mathit{0123456789}
```

0123456789

#### 斜体希腊字母（小写字母默认）

```
\mathit{\Alpha\Beta\Gamma\Delta\Epsilon\Zeta\Eta\Theta}
```

ABΓΔEZHΘ

```
\mathit{\Iota\Kappa\Lambda\Mu\Nu\Xi\Pi\Rho}
```

IKΛMNΞΠP

```
\mathit{\Sigma\Tau\Upsilon\Phi\Chi\Psi\Omega}
```

ΣTΥΦXΨΩ

#### 罗马体

```
\mathrm{ABCDEFGHI}
```

ABCDEFGHI

```
\mathrm{JKLMNOPQR}
```

JKLMNOPQR

```
\mathrm{STUVWXYZ}
```

STUVWXYZ

```
\mathrm{abcdefghijklm}
```

abcdefghijklm

```
\mathrm{nopqrstuvwxyz}
```

nopqrstuvwxyz

```
\mathrm{0123456789}
```

0123456789

#### 无衬线体

```
\mathsf{ABCDEFGHI}
```

ABCDEFGHI

```
\mathsf{JKLMNOPQR}
```

JKLMNOPQR

```
\mathsf{STUVWXYZ}
```

STUVWXYZ

```
\mathsf{abcdefghijklm}
```

abcdefghijklm

```
\mathsf{nopqrstuvwxyz}
```

nopqrstuvwxyz

```
\mathsf{0123456789}
```

0123456789

#### 无衬线体希腊字母（仅大写）

```
\mathsf{\Alpha \Beta \Gamma \Delta \Epsilon \Zeta \Eta \Theta}
```

ABΓΔEZHΘ

```
\mathsf{\Iota \Kappa \Lambda \Mu \Nu \Xi \Pi \Rho}
```

IKΛMNΞΠP

```
\mathsf{\Sigma \Tau \Upsilon \Phi \Chi \Psi \Omega}
```

ΣTΥΦXΨΩ

#### 手写体 / 花体

```
\mathcal{ABCDEFGHI}
```

ABCDEFGHI

```
\mathcal{JKLMNOPQR}
```

JKLMNOPQR

```
\mathcal{STUVWXYZ}
```

STUVWXYZ

#### Fraktur 体

```
\mathfrak{ABCDEFGHI}
```

ABCDEFGHI

```
\mathfrak{JKLMNOPQR}
```

JKLMNOPQR

```
\mathfrak{STUVWXYZ}
```

STUVWXYZ

```
\mathfrak{abcdefghijklm}
```

abcdefghijklm

```
\mathfrak{nopqrstuvwxyz}
```

nopqrstuvwxyz

```
\mathfrak{0123456789}
```

0123456789

#### 小型手写体

```
{\scriptstyle\text{abcdefghijklm}}
```

abcdefghijklm

### 混合字体[#](https://www.cnblogs.com/1024th/p/11623258.html#3258616740)

特征|语法|渲染效果

斜体字符（忽略空格）

```
x y z
```

xyz

非斜体字符

```
\text{x y z}
```

x y z

混合斜体（差）

```
\text{if} n \text{is even}
```

ifnis even

混合斜体（好）

```
\text{if }n\text{ is even}
```

if n is even

混合斜体（替代品：`~` 或者 `\` 强制空格）

```
\text{if}~n\ \text{is even}
```

if n is even

### 注释文本[#](https://www.cnblogs.com/1024th/p/11623258.html#272164899)

使用 `\text {文字}` 来添加注释文本（注释文本不会被识别为公式，不用斜体显示）。`\text {文字}`中仍可以使用 `$公式$` 插入其它公式。

- 例子：

```ruby
Copyf(n)= \begin{cases}
n/2, & \text {if $n$ is even} \\
3n+1, &\text{if $n$ is odd}
\end{cases} 
```

- 显示：



f(n)={n/2,if n is even3n+1,if n is odd



## 括号[#](https://www.cnblogs.com/1024th/p/11623258.html#3508428128)

`()`、`[]` 和 `|` 表示符号本身，使用 `\{\}` 来表示 `{}` 。

功能|语法|显示

短括号

```
\frac{1}{2}
```

(12)

长括号

```
\left(\frac{1}{2} \right)
```

(12)

使用 `\left` 和 `\right` 来创建自动匹配高度的 (圆括号)，[方括号] 和 {花括号} 。

功能|语法|显示

圆括号，小括号

```
\left( \frac{a}{b} \right)
```

(ab)

方括号，中括号

```
\left[ \frac{a}{b} \right]
```

[ab]

花括号，大括号

```
\left\{ \frac{a}{b} \right\}
```

{ab}

角括号

```
\left \langle \frac{a}{b} \right \rangle
```

⟨ab⟩

单竖线，绝对值

```
\left| \frac{a}{b} \right|
```

∣∣ab∣∣

双竖线，范

```
\left \| \frac{a}{b} \right \|
```

∥∥ab∥∥

取整函数

```
\left \lfloor \frac{a}{b} \right \rfloor
```

⌊ab⌋

取顶函数

```
\left \lceil \frac{c}{d} \right \rceil
```

⌈cd⌉

斜线与反斜线

```
\left / \frac{a}{b} \right \backslash
```

/ab\

上下箭头

```
\left \uparrow \frac{a}{b} \right \downarrow
```

↑⏐ ⏐⏐ab⏐⏐ ⏐↓

```
\left \Uparrow \frac{a}{b} \right \Downarrow
```

⇑‖ ‖‖ab‖‖ ‖⇓

```
\left \updownarrow \frac{a}{b} \right \Updownarrow
```

↑⏐ ⏐↓ab⇑‖ ‖⇓

混合括号

```
\left[ 0,1 \right)
```

[0,1)

```
\left \langle \psi \right |
```

⟨ψ|

如果括号只有一边，要用 `\left.` 或 `\right.` 匹配另一边。

单左括号

```
\left \{\frac{a}{b} \right.
```

{ab

单右括号

```
\left. \frac{a}{b} \right \}
```

ab}

备注：

- 可以使用 `\big, \Big, \bigg, \Bigg` 控制括号的大小，比如代码

  `\Bigg ( \bigg [ \Big \{ \big \langle \left | \| \frac{a}{b} \| \right | \big \rangle \Big \} \bigg ] \Bigg )`

  显示︰

  

  ([{⟨∣∣∥ab∥∣∣⟩}])

  

## 空格[#](https://www.cnblogs.com/1024th/p/11623258.html#3618910606)

注意 TeX 能够自动处理大多数的空格，但是您有时候需要自己来控制。

功能|语法|显示|宽度

### 2 个 quad 空格[#](https://www.cnblogs.com/1024th/p/11623258.html#327005272)

```
\alpha\qquad\beta
```

αβ

mm

### quad 空格[#](https://www.cnblogs.com/1024th/p/11623258.html#2526309873)

```
\alpha\quad\beta
```

αβ

m

### 大空格[#](https://www.cnblogs.com/1024th/p/11623258.html#1096173525)

```
\alpha\ \beta
```

α β

m3

### 中等空格[#](https://www.cnblogs.com/1024th/p/11623258.html#1359135296)

```
\alpha\;\beta
```

αβ

2m7

### 小空格[#](https://www.cnblogs.com/1024th/p/11623258.html#1046104282)

```
\alpha\,\beta
```

αβ

m6

### 没有空格[#](https://www.cnblogs.com/1024th/p/11623258.html#3311083871)

```
\alpha\beta
```

αβ

0

### 紧贴[#](https://www.cnblogs.com/1024th/p/11623258.html#1489711392)

```
\alpha\!\beta
```

αβ

−m6

## 颜色[#](https://www.cnblogs.com/1024th/p/11623258.html#4219485085)

### [Cmd Markdown 公式指导手册](https://www.zybuluo.com/codeep/note/163962#七交换图表使用参考)里是这样写的：[#](https://www.cnblogs.com/1024th/p/11623258.html#2852693728)

使用 `\color{颜色}{文字}` 来更改特定的文字颜色。
更改文字颜色 **需要浏览器支持** ，如果浏览器不知道你所需的颜色，那么文字将被渲染为黑色。

对于较旧的浏览器（HTML4与CSS2），以下颜色是被支持的：

|  输入  | 显示 |  输入   | 显示 |
| :----: | :--: | :-----: | :--: |
| black  | text |  grey   | text |
| silver | text |  white  | text |
| maroon | text |   red   | text |
| yellow | text |  lime   | text |
| olive  | text |  green  | text |
|  teal  | text |  auqa   | text |
|  blue  | text |  navy   | text |
| purple | text | fuchsia | text |

对于较新的浏览器（HTML5与CSS3），额外的124种颜色将被支持：

输入 `\color {#rgb} {text}` 来自定义更多的颜色，其中 `#rgb` 的 `r` `g` `b` 可输入 `0-9` 和 `a-f` 来表示红色、绿色和蓝色的纯度（饱和度）。

- 例子：

```less
Copy\begin{array}{|rrrrrrrr|}\hline
\verb+#000+ & \color{#000}{text} & & &
\verb+#00F+ & \color{#00F}{text} & & \\
& & \verb+#0F0+ & \color{#0F0}{text} &
& & \verb+#0FF+ & \color{#0FF}{text}\\
\verb+#F00+ & \color{#F00}{text} & & &
\verb+#F0F+ & \color{#F0F}{text} & & \\
& & \verb+#FF0+ & \color{#FF0}{text} &
& & \verb+#FFF+ & \color{#FFF}{text}\\
\hline
\end{array}
```

- 显示：



\#000text#00Ftext#0F0text#0FFtext#F00text#F0Ftext#FF0text#FFFtext



- 例子：

```less
Copy\begin{array}{|rrrrrrrr|}
\hline
\verb+#000+ & \color{#000}{text} & \verb+#005+ & \color{#005}{text} & \verb+#00A+ & \color{#00A}{text} & \verb+#00F+ & \color{#00F}{text}  \\
\verb+#500+ & \color{#500}{text} & \verb+#505+ & \color{#505}{text} & \verb+#50A+ & \color{#50A}{text} & \verb+#50F+ & \color{#50F}{text}  \\
\verb+#A00+ & \color{#A00}{text} & \verb+#A05+ & \color{#A05}{text} & \verb+#A0A+ & \color{#A0A}{text} & \verb+#A0F+ & \color{#A0F}{text}  \\
\verb+#F00+ & \color{#F00}{text} & \verb+#F05+ & \color{#F05}{text} & \verb+#F0A+ & \color{#F0A}{text} & \verb+#F0F+ & \color{#F0F}{text}  \\
\hline
\verb+#080+ & \color{#080}{text} & \verb+#085+ & \color{#085}{text} & \verb+#08A+ & \color{#08A}{text} & \verb+#08F+ & \color{#08F}{text}  \\
\verb+#580+ & \color{#580}{text} & \verb+#585+ & \color{#585}{text} & \verb+#58A+ & \color{#58A}{text} & \verb+#58F+ & \color{#58F}{text}  \\
\verb+#A80+ & \color{#A80}{text} & \verb+#A85+ & \color{#A85}{text} & \verb+#A8A+ & \color{#A8A}{text} & \verb+#A8F+ & \color{#A8F}{text}  \\
\verb+#F80+ & \color{#F80}{text} & \verb+#F85+ & \color{#F85}{text} & \verb+#F8A+ & \color{#F8A}{text} & \verb+#F8F+ & \color{#F8F}{text}  \\
\hline
\verb+#0F0+ & \color{#0F0}{text} & \verb+#0F5+ & \color{#0F5}{text} & \verb+#0FA+ & \color{#0FA}{text} & \verb+#0FF+ & \color{#0FF}{text}  \\
\verb+#5F0+ & \color{#5F0}{text} & \verb+#5F5+ & \color{#5F5}{text} & \verb+#5FA+ & \color{#5FA}{text} & \verb+#5FF+ & \color{#5FF}{text}  \\
\verb+#AF0+ & \color{#AF0}{text} & \verb+#AF5+ & \color{#AF5}{text} & \verb+#AFA+ & \color{#AFA}{text} & \verb+#AFF+ & \color{#AFF}{text}  \\
\verb+#FF0+ & \color{#FF0}{text} & \verb+#FF5+ & \color{#FF5}{text} & \verb+#FFA+ & \color{#FFA}{text} & \verb+#FFF+ & \color{#FFF}{text}  \\
\hline
\end{array}
```

- 显示：



\#000text#005text#00Atext#00Ftext#500text#505text#50Atext#50Ftext#A00text#A05text#A0Atext#A0Ftext#F00text#F05text#F0Atext#F0Ftext#080text#085text#08Atext#08Ftext#580text#585text#58Atext#58Ftext#A80text#A85text#A8Atext#A8Ftext#F80text#F85text#F8Atext#F8Ftext#0F0text#0F5text#0FAtext#0FFtext#5F0text#5F5text#5FAtext#5FFtext#AF0text#AF5text#AFAtext#AFFtext#FF0text#FF5text#FFAtext#FFFtext



### 维基百科的[数学公式教程](https://zh.wikipedia.org/wiki/Help:数学公式)里是这样写的：[#](https://www.cnblogs.com/1024th/p/11623258.html#4233192540)

语法：`{\color{颜色}表达式}`

**作者实测：在部分浏览器中，上面的语法可能是错误的**（只将表达式的第一个字符着色），`\color{颜色}{文字}`的语法才是正确的。例如：

`{\color{Red}abc}`显示abc
`\color{Red}{abc}`显示abc

**支持色调表：**

Apricot

Aquamarine

Bittersweet

Black

Blue

BlueGreen

BlueViolet

BrickRed

Brown

BurntOrange

CadetBlue

CarnationPink

Cerulean

CornflowerBlue

Cyan

Dandelion

DarkOrchid

Emerald

ForestGreen

Fuchsia

Goldenrod

Gray

Green

GreenYellow

JungleGreen

Lavender

LimeGreen

Magenta

Mahogany

Maroon

Melon

MidnightBlue

Mulberry

NavyBlue

OliveGreen

Orange

OrangeRed

Orchid

Peach

Periwinkle

PineGreen

Plum

ProcessBlue

Purple

RawSienna

Red

RedOrange

RedViolet

Rhodamine

RoyalBlue

RoyalPurple

RubineRed

Salmon

SeaGreen

Sepia

SkyBlue

SpringGreen

Tan

TealBlue

Thistle

Turquoise

Violet

VioletRed

White

WildStrawberry

Yellow

YellowGreen

YellowOrange

＊注︰输入时第一个字母必需以大写输入，如`\color{OliveGreen}`。

例子

- `{\color{Blue}x^2}+{\color{Brown}2x} - {\color{OliveGreen}1}`

  x2+2x−1

- `x_{\color{Maroon}1,2}=\frac{-b\pm\sqrt{{\color{Maroon}b^2-4ac}}}{2a}`

  x1,2=−b±√b2−4ac2a

## 外部链接[#](https://www.cnblogs.com/1024th/p/11623258.html#3311592481)

- 一个介绍 TEX 的 PDF 文档（英文）： http://www.ctan.org/tex-archive/info/gentle/gentle.pdf
- 手画符号搜索 LATEX 代码: http://detexify.kirelabs.org/classify.html
- [LaTeX 在线编辑器](http://www.codecogs.com/latex/eqneditor.php)
- [AMS-LaTeX 指南](http://www.ams.org/tex/amslatex.html)

免责声明：本内容来自平台创作者，博客园系信息发布平台，仅提供信息存储空间服务。



捐赠

- WeChat
- AliPay

[« ](https://www.cnblogs.com/1024th/p/11622317.html)上一篇： [数论小白都能看懂的线性方程组及其解法(高斯消元)](https://www.cnblogs.com/1024th/p/11622317.html)
[» ](https://www.cnblogs.com/1024th/p/11841809.html)下一篇： [地理必修三知识点](https://www.cnblogs.com/1024th/p/11841809.html)

posted @ 2019-10-04 20:49 [樱花赞](https://www.cnblogs.com/1024th) 阅读(437854) 评论(33)  [收藏](javascript:void(0)) [举报](javascript:void(0))





登录后才能查看或发表评论，立即 [登录](javascript:void(0);) 或者 [逛逛](https://www.cnblogs.com/) 博客园首页

[【推荐】博客园周边店上新键帽，多款五面热升华设计，为代码加点仪式感](https://cnblogs.vip/store/key-caps)
[【推荐】智能无限 | 协作无间，TRAE SOLO 中国版正式上线，全面免费](https://www.trae.com.cn/?utm_source=advertising&utm_medium=cnblogs_ug_cpa&utm_term=hw_trae_cnblogs)
[【推荐】科研领域的连接者艾思科蓝，一站式科研学术服务数字化平台](https://ais.cn/u/QjqYJr)
[【推荐】诚邀您体验阿里巴巴推出的新一代 Agentic 编程平台 Qoder](https://www.cnblogs.com/cmt/p/19165152)

[![img](https://img2024.cnblogs.com/blog/35695/202601/35695-20260126182414083-343501314.webp)](https://cnblogs.vip/store/key-caps)

编辑推荐：

- [EF Core 实体状态与变更追踪](https://www.cnblogs.com/tcjiaan/p/19528796)
- [基于NetCorePal Clou Framework的DDD架构管理系统实践](https://www.cnblogs.com/aishangyipiyema/p/19499381)
- [AI → JSON → UI](https://www.cnblogs.com/guangzan/p/19487446)
- [为什么说 IO 操作异步才有意义](https://www.cnblogs.com/kklldog/p/19449864)
- [2025 年终总结｜30岁](https://www.cnblogs.com/liyq666/p/19427476)

热点博文：

- [.NET 10了，HttpClient还是不能用using吗？我做了一个实验](https://www.cnblogs.com/sdcb/p/19500792/20260119-using-httpclient)
- [破防了！2026开年3位程序员接连猝死，最年轻26岁，29岁男主离世时，妻子正怀二胎7个月…](https://www.cnblogs.com/philry/p/19534679)
- [32岁程序员猝死背后，我的一些真实感受](https://www.cnblogs.com/HaiJun-Aion/p/19521040)
- [一个月搞定100+表迁移：我的“偷师”Navicat实战复盘](https://www.cnblogs.com/xzqcsj/p/19510445)
- [《HelloGitHub》第 118 期](https://www.cnblogs.com/xueweihan/p/19535889)

[博客园](https://www.cnblogs.com/) © 2004-2026
[![img](https://assets.cnblogs.com/images/ghs.png)浙公网安备 33010602011771号](http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602011771) [浙ICP备2021040463号-3](https://beian.miit.gov.cn/) & Theme [Silence v2.0.2](https://github.com/esofar/cnblogs-theme-silence)



[字节旗下的即梦AI](https://dis.chatdesks.cn/chatdesk/jmcnblogs.html)



CONTENTS

✕

- 如何插入公式
- 函数、符号及特殊字符
- 声调 / 变音符号
- 标准函数
- 界限，极限
- 投射
- 微分及导数
- 类字母符号及常数
- 模运算
- 根号
- 运算符
- 集合
- 关系符号
- 几何符号
- 逻辑符号
- 箭头
- 特殊符号
- 未分类
- 上标、下标及积分等
- 分数
- 矩阵、条件表达式、方程组
- 无框矩阵
- 有框矩阵
- 条件表达式
- 多行等式、同余式
- 方程组
- 数组与表格
- 嵌套数组或表格
- 用数组实现带分割符号的矩阵
- 字体
- 希腊字母
- 希伯来符号
- 部分字体的简称
- 所有字体
- 混合字体
- 注释文本
- 括号
- 空格
- 2 个 quad 空格
- quad 空格
- 大空格
- 中等空格
- 小空格
- 没有空格
- 紧贴
- 颜色
- Cmd Markdown 公式指导手册里是这样写的：
- 维基百科的数学公式教程里是这样写的：
- 外部链接

参考：
1. [LaTex 教程](https://zilutian.github.io/latex-tutorial-chinese/)
2. [学习 LaTeX ](https://www.latexstudio.net/LearnLaTeX/basic/01.html)
3. [LaTex 入门](https://oi-wiki.org/tools/latex/)
4. [MathJax Tutorial CN](https://1024th.github.io/MathJax_Tutorial_CN/)
5. [维基百科：数学公式](https://zh.wikipedia.org/wiki/Help:%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F)
6. [Cmd Markdown 公式指导手册](https://www.zybuluo.com/codeep/note/163962#%E4%B8%83%E4%BA%A4%E6%8D%A2%E5%9B%BE%E8%A1%A8%E4%BD%BF%E7%94%A8%E5%8F%82%E8%80%83)
7. [LaTex 公式](https://www.cnblogs.com/1024th/p/11623258.html)
