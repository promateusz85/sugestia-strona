/* ── navigate(target, exitClass, enterClass) ──────────────────────────────
   Animates the current .phone with exitClass, then navigates to target.
   The target page picks up enterClass from sessionStorage on DOMContentLoaded.
   ─────────────────────────────────────────────────────────────────────────── */
function navigate(target, exitClass, enterClass) {
  const phone = document.querySelector('.phone');
  if (phone && exitClass) {
    phone.classList.add(exitClass);
  }
  if (enterClass) {
    sessionStorage.setItem('zen_enter', enterClass);
  }
  const delay = exitClass ? 280 : 0;
  setTimeout(() => { window.location.href = target; }, delay);
}

/* ── Entry animation — applied by the page being navigated TO ────────────── */
(function applyEntryAnimation() {
  const enterClass = sessionStorage.getItem('zen_enter');
  if (!enterClass) return;
  sessionStorage.removeItem('zen_enter');

  // Apply after DOM is ready so the element exists
  function apply() {
    const phone = document.querySelector('.phone');
    if (phone) phone.classList.add(enterClass);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();

/* ── showToast(msg) ───────────────────────────────────────────────────────── */
let _toastTimer = null;

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('visible');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    t.classList.remove('visible');
    _toastTimer = null;
  }, 1800);
}
