/**
 * ========================================
 * 作品详情弹层（原生 <dialog>）
 * ========================================
 */
export function initWorkDialog() {
    const dialog = document.getElementById('work-dialog');
    if (!dialog) return;

    const closeBtn = dialog.querySelector('.work-dialog__close');
    const f = {
        cover: dialog.querySelector('#wd-cover'),
        title: dialog.querySelector('#wd-title'),
        intro: dialog.querySelector('#wd-intro'),
        url: dialog.querySelector('#wd-url'),
        situation: dialog.querySelector('#wd-situation'),
        task: dialog.querySelector('#wd-task'),
        action: dialog.querySelector('#wd-action'),
        result: dialog.querySelector('#wd-result'),
    };

    function open(d) {
        // 封面
        if (d.cover && d.cover.trim()) {
            f.cover.src = d.cover;
            f.cover.style.display = '';
        } else {
            f.cover.removeAttribute('src');
            f.cover.style.display = 'none';
        }
        // 文本
        f.title.textContent = d.name || '';
        f.intro.textContent = d.intro || '';
        f.situation.textContent = d.situation || '';
        f.task.textContent = d.task || '';
        f.action.textContent = d.action || '';
        f.result.textContent = d.result || '';
        // 链接
        if (d.url && d.url.trim()) {
            f.url.href = d.url;
            f.url.style.display = '';
        } else {
            f.url.style.display = 'none';
        }
        dialog.showModal();
    }

    // 事件委托：卡片上的「查看详情」
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.work-detail-btn');
        if (!btn) return;
        e.preventDefault();
        open(btn.dataset);
    });

    // 关闭
    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close(); // 点 backdrop 关闭
    });
}
