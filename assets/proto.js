/* Interactive Rules-page prototype: builds itself inside any [data-proto-mount] element. */
(function () {
  var SRC = '/assets/proto/';
  var CFG = {
    desktop: {
      w: 1440, navH: 104, urlText: 'Rules to Know Before You Hunt', slices: [962,962,962,962,962,962,962,962,52], band: 960, ov: 2,
      anchors: [['General rules',740],['Hunt rules',1580],['Flash sales',3340],['After you claim',4320],['FAQ',5260]],
      hot: [['home',362,412,28,76],['gs',452,612,28,76],['dino',662,730,28,76],['rules',776,824,28,76],['about',864,942,28,76],['discord',1176,1390,26,78]]
    },
    mobile: {
      w: 393, navH: 161, slices: [1102,1102,1102,1102,1102,1102,162], band: 1100, ov: 2,
      anchors: [['General rules',550],['Hunt rules',1385],['Flash sales',3395],['After you claim',4100],['FAQ',4800]],
      hot: [['home',14,110,34,128],['menu',322,393,46,118]]
    }
  };
  var MENU = ['Home','Getting Started','DinoDex','Rules','About Us'];
  var MSG = 'That page isn’t part of this prototype. Only the Rules page is.';

  function el(tag, cls, attrs) { var e = document.createElement(tag); if (cls) e.className = cls; if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  function init(root) {
    if (root.getAttribute('data-ready')) return;
    root.setAttribute('data-ready', '1');
    root.setAttribute('data-nozoom', '1');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mode = 'desktop', hinted = false, toastT, raf = 0;

    var pt = el('div', 'pt');
    var bar = el('div', 'pt-bar');
    var seg = el('div', 'pt-seg', { role: 'group', 'aria-label': 'Device' });
    var bD = el('button', '', { type: 'button' }); bD.textContent = 'Desktop';
    var bM = el('button', '', { type: 'button' }); bM.textContent = 'Mobile';
    seg.appendChild(bD); seg.appendChild(bM);
    var chips = el('div', 'pt-chips', { role: 'group', 'aria-label': 'Jump to section' });
    bar.appendChild(seg); bar.appendChild(chips);

    var stage = el('div', 'pt-stage');
    var device = el('div', 'pt-device');
    var frame = el('div', 'pt-frame');
    var dots = el('div', 'pt-dots'); dots.innerHTML = '<i></i><i></i><i></i>';
    var url = el('div', 'pt-url'); url.textContent = CFG.desktop.urlText;
    var island = el('div', 'pt-island');
    var view = el('div', 'pt-view');
    var scroller = el('div', 'pt-scroll', { tabindex: '0', role: 'region', 'aria-label': 'Scrollable prototype of the Rules page' });
    var menu = el('div', 'pt-menu');
    var hint = el('div', 'pt-hint'); hint.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2v10M3 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Scroll the page, or tap the nav';
    var toast = el('div', 'pt-toast'); toast.setAttribute('role', 'status');

    // nav (sticky) + content, per mode
    var navWrap = el('div', 'pt-nav');
    var panes = {};
    ['desktop', 'mobile'].forEach(function (m) {
      var c = CFG[m], p = el('div', 'pt-pane', { 'data-m': m });
      var nav = el('div', 'pt-navimg'); nav.style.position = 'relative';
      var ni = el('img', '', { src: SRC + (m === 'desktop' ? 'd' : 'm') + '-nav.webp', alt: m === 'desktop' ? 'Triceratops site navigation' : 'Triceratops mobile header', draggable: 'false' });
      nav.appendChild(ni);
      c.hot.forEach(function (h) {
        var b = el('button', 'pt-hot', { type: 'button', 'data-k': h[0], 'data-m': m, 'aria-label': h[0] });
        b.style.left = (h[1] / c.w * 100) + '%'; b.style.width = ((h[2] - h[1]) / c.w * 100) + '%';
        b.style.top = (h[3] / c.navH * 100) + '%'; b.style.height = ((h[4] - h[3]) / c.navH * 100) + '%';
        var labels = { home: 'Home', gs: 'Getting started', dino: 'DinoDex', rules: 'Rules', about: 'About us', discord: 'Join our Discord', menu: 'Open menu' };
        b.setAttribute('aria-label', labels[h[0]]);
        nav.appendChild(b);
      });
      p.appendChild(nav);
      panes[m] = { nav: nav, content: el('div', 'pt-content'), wrap: p };
      navWrap.appendChild(p);
    });
    // content panes live below the sticky nav
    var contentWrap = el('div', 'pt-contentwrap');
    ['desktop', 'mobile'].forEach(function (m) {
      var c = CFG[m], p = el('div', 'pt-pane', { 'data-m': m });
      c.slices.forEach(function (h, i) {
        var im = el('img', '', { src: SRC + (m === 'desktop' ? 'd' : 'm') + '-' + i + '.webp', alt: i === 0 ? 'Triceratops Rules page, ' + m + ' design' : '', draggable: 'false', decoding: 'async' });
        if (i > 1) im.setAttribute('loading', 'lazy');
        if (i < c.slices.length - 1) im.style.marginBottom = (-c.ov / c.w * 100) + '%';
        im.setAttribute('width', c.w); im.setAttribute('height', h);
        p.appendChild(im);
      });
      contentWrap.appendChild(p);
    });

    scroller.appendChild(navWrap); scroller.appendChild(contentWrap);
    view.appendChild(scroller); view.appendChild(menu); view.appendChild(hint); view.appendChild(toast);
    frame.appendChild(dots); frame.appendChild(url); frame.appendChild(island); frame.appendChild(view);
    device.appendChild(frame); stage.appendChild(device);
    var cap = el('p', 'pt-cap'); cap.textContent = 'Built from the Figma file. Scroll the frame, use the section chips, switch between desktop and mobile, or tap the nav.';
    pt.appendChild(bar); pt.appendChild(stage); pt.appendChild(cap);
    root.appendChild(pt);

    // menu items
    MENU.forEach(function (t) {
      var b = el('button', '', { type: 'button' }); b.textContent = t;
      if (t === 'Rules') b.setAttribute('aria-current', 'page');
      b.addEventListener('click', function () { closeMenu(); if (t === 'Rules') toTop(); else say(MSG); });
      menu.appendChild(b);
    });
    var join = el('button', 'pt-join', { type: 'button' }); join.textContent = 'Join Our Discord';
    join.addEventListener('click', function () { closeMenu(); say(MSG); });
    menu.appendChild(join);

    function scale() { return scroller.clientWidth / CFG[mode].w; }
    function say(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2400); }
    function closeMenu() { menu.classList.remove('on'); }
    function toTop() { scroller.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
    function jump(y) { var c = CFG[mode]; scroller.scrollTo({ top: Math.max(0, (y - c.navH - 10) * scale()), behavior: reduce ? 'auto' : 'smooth' }); }

    function buildChips() {
      chips.innerHTML = '';
      CFG[mode].anchors.forEach(function (a, i) {
        var b = el('button', '', { type: 'button', 'data-i': i }); b.textContent = a[0];
        b.addEventListener('click', function () { closeMenu(); jump(a[1]); });
        chips.appendChild(b);
      });
      active();
    }
    function active() {
      raf = 0;
      var c = CFG[mode], s = scale(), y = scroller.scrollTop / s + c.navH + 80, idx = -1;
      c.anchors.forEach(function (a, i) { if (y >= a[1]) idx = i; });
      Array.prototype.forEach.call(chips.children, function (b, i) { if (i === idx) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      if (!hinted && scroller.scrollTop > 40) { hinted = true; hint.classList.add('off'); }
    }
    scroller.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(active); if (menu.classList.contains('on') && scroller.scrollTop > 4) closeMenu(); }, { passive: true });

    function setMode(m) {
      mode = m;
      device.setAttribute('data-mode', m);
      bD.setAttribute('aria-pressed', m === 'desktop'); bM.setAttribute('aria-pressed', m === 'mobile');
      scroller.scrollTop = 0; closeMenu();
      requestAnimationFrame(function () {
        var nh = CFG[m].navH * scale(); view.style.setProperty('--navh', nh + 'px'); menu.style.top = nh + 'px';
        buildChips();
      });
    }
    bD.addEventListener('click', function () { if (mode !== 'desktop') setMode('desktop'); });
    bM.addEventListener('click', function () { if (mode !== 'mobile') setMode('mobile'); });
    window.addEventListener('resize', function () { var nh = CFG[mode].navH * scale(); view.style.setProperty('--navh', nh + 'px'); menu.style.top = nh + 'px'; }, { passive: true });

    navWrap.addEventListener('click', function (e) {
      var b = e.target.closest('.pt-hot'); if (!b) return;
      var k = b.getAttribute('data-k');
      if (k === 'menu') { menu.classList.toggle('on'); return; }
      if (k === 'rules') { toTop(); return; }
      say(MSG);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    setMode('desktop');
  }

  function scan() { var n = document.querySelectorAll('[data-proto-mount]:not([data-ready])'); for (var i = 0; i < n.length; i++) init(n[i]); return n.length; }
  function start() {
    scan();
    var mo = new MutationObserver(function () { if (document.querySelector('[data-proto-mount]:not([data-ready])')) scan(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 15000);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
