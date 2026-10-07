/* Shared enhancements for case-study pages: click-to-zoom images and a back-to-top button. */
(function () {
  if (window.__enhanced) return;
  window.__enhanced = true;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- click-to-zoom ---------- */
  var box, boxImg, boxCap, closeBtn, lastFocus;
  function build() {
    if (box) return;
    box = document.createElement('div');
    box.id = 'zl'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Enlarged image');
    boxImg = document.createElement('img');
    boxCap = document.createElement('p');
    closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Close image'); closeBtn.innerHTML = '&times;';
    box.appendChild(boxImg); box.appendChild(boxCap); box.appendChild(closeBtn);
    document.body.appendChild(box);
    box.addEventListener('click', function (e) { if (e.target !== boxImg) close(); });
    box.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    box.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  }
  function open(img) {
    build();
    lastFocus = document.activeElement;
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt || '';
    boxCap.textContent = img.alt || '';
    boxCap.style.display = img.alt ? 'block' : 'none';
    box.classList.add('on');
    closeBtn.focus({ preventScroll: true });
  }
  function close() {
    if (!box) return;
    box.classList.remove('on');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function zoomable(img) {
    if (img._zoomOk !== undefined) return img._zoomOk;
    var ok = !img.closest('a, button, [data-nozoom], #zl');
    if (ok && getComputedStyle(img).position === 'absolute') ok = false;
    if (ok) { var r = img.getBoundingClientRect(); ok = r.width >= 140 && r.height >= 90; }
    img._zoomOk = ok;
    if (ok) img.classList.add('zl-img');
    return ok;
  }
  document.addEventListener('mouseover', function (e) { if (e.target.tagName === 'IMG') zoomable(e.target); }, { passive: true });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'IMG' && zoomable(t)) open(t);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box && box.classList.contains('on')) close(); });

  /* ---------- back to top ---------- */
  var C = 131.95, btn, ring, ticking = false, shown = false;
  function mount() {
    btn = document.createElement('button');
    btn.id = 'totop'; btn.type = 'button'; btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="bg" cx="24" cy="24" r="21"/><circle class="fg" cx="24" cy="24" r="21"/></svg>' +
      '<svg class="ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    ring = btn.querySelector('.fg');
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    document.body.appendChild(btn);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function update() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY || document.documentElement.scrollTop;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    ring.style.strokeDashoffset = (C * (1 - p)).toFixed(2);
    var on = y > 900;
    if (on !== shown) { shown = on; btn.classList.toggle('on', on); }
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
