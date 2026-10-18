/**
 * ========================================
 * 作品详情弹层（原生 <dialog>）
 * ========================================
 */
export function initWorkDialog() {
    const dialog = document.getElementById('work-dialog');
    if (!dialog) return;

    const root = document.documentElement;
    const closeBtn = dialog.querySelector('.work-dialog__close');
    const f = {
        cover: dialog.querySelector('#wd-cover'),
        title: dialog.querySelector('#wd-title'),
        intro: dialog.querySelector('#wd-intro'),
        url: dialog.querySelector('#wd-url'),
        situation: dialog.querySelector('#wd-situation'),
        task: dialog.querySelector('#wd-task'),
        action: dialog.querySelector('#wd-action'),
        result: dialog.querySelector('#wd-result')
    };

    let opener = null;

    // STAR 某项为空时，整行（dt + dd）隐藏
    function setStar(dd, text) {
        const value = (text || '').trim();
        dd.textContent = value;
        dd.hidden = !value;
        if (dd.previousElementSibling) dd.previousElementSibling.hidden = !value;
    }

    function open(d, trigger) {
        // 封面
        if (d.cover && d.cover.trim()) {
            f.cover.src = d.cover;
            f.cover.alt = d.name ? `${d.name} 封面` : '';
            f.cover.style.display = '';
        } else {
            f.cover.removeAttribute('src');
            f.cover.alt = '';
            f.cover.style.display = 'none';
        }
        // 文本
        f.title.textContent = d.name || '';
        f.intro.textContent = d.intro || '';
        f.intro.hidden = !(d.intro && d.intro.trim());
        setStar(f.situation, d.situation);
        setStar(f.task, d.task);
        setStar(f.action, d.action);
        setStar(f.result, d.result);
        // 链接
        if (d.url && d.url.trim()) {
            f.url.href = d.url;
            f.url.style.display = '';
        } else {
            f.url.removeAttribute('href');
            f.url.style.display = 'none';
        }

        opener = trigger;
        dialog.scrollTop = 0;
        root.classList.add('is-locked'); // 锁定背景滚动（滚动位置保留）
        dialog.showModal();
    }

    // 事件委托：卡片上的「查看详情」
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.work-detail-btn');
        if (!btn) return;
        e.preventDefault();
        open(btn.dataset, btn);
    });

    // 关闭（按钮 / Esc / 点击遮罩）
    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        root.classList.remove('is-locked');
        if (opener && opener.isConnected) opener.focus({ preventScroll: true });
        opener = null;
    });
}
