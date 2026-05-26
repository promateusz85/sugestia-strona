// ── Account dropdown ──────────────────────────────
(function () {
  const accountWrap = document.getElementById('accountWrap');
  if (!accountWrap) return;

  accountWrap.addEventListener('click', e => {
    e.stopPropagation();
    accountWrap.classList.toggle('open');
  });

  document.addEventListener('click', () => accountWrap.classList.remove('open'));
})();

// ── Account item selection ────────────────────────
function selectAccount(el, name) {
  const accountName = document.getElementById('accountName');
  if (accountName) accountName.textContent = name;
  document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const wrap = document.getElementById('accountWrap');
  if (wrap) wrap.classList.remove('open');
}

// ── Bottom nav tab switching ──────────────────────
(function () {
  const tabs = document.querySelectorAll('.nav-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.classList.add('inactive');
      });
      tab.classList.remove('inactive');
      tab.classList.add('active');
    });
  });
})();

// ── Page navigation with transition ──────────────
function navigate(url, exitCls, entryCls) {
  const phone = document.querySelector('.phone');
  if (!phone) { window.location.href = url; return; }
  sessionStorage.setItem('zen_entry', entryCls);
  phone.classList.add(exitCls);
  setTimeout(() => { window.location.href = url; }, 270);
}

// Apply entry animation when page loads
(function () {
  const cls = sessionStorage.getItem('zen_entry');
  if (!cls) return;
  sessionStorage.removeItem('zen_entry');
  requestAnimationFrame(() => {
    const phone = document.querySelector('.phone');
    if (phone) phone.classList.add(cls);
  });
})();

// ── Toast ─────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}
