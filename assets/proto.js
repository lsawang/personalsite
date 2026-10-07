/* Interactive Rules-page prototype: builds desktop + mobile frames inside any [data-proto-mount] element. */
(function () {
  var SRC = '/assets/proto/';
  var CFG = {
    desktop: {
      w: 1440, navH: 104, urlText: 'Rules to Know Before You Hunt', slices: [962,962,962,962,962,962,962,962,52], ov: 2, pre: 'd',
      hot: [['home',362,412,28,76],['gs',452,612,28,76],['dino',662,730,28,76],['rules',776,824,28,76],['about',864,942,28,76],['discord',1176,1390,26,78]]
    },
    mobile: {
      w: 393, navH: 161, slices: [1102,1102,1102,1102,1102,1102,162], ov: 2, pre: 'm',
      hot: [['home',14,110,34,128],['menu',322,393,46,118]]
    }
  };
  var LABELS = { home: 'Home', gs: 'Getting started', dino: 'DinoDex', rules: 'Rules', about: 'About us', discord: 'Join our Discord', menu: 'Open menu' };
  var MENU = ['Home','Getting Started','DinoDex','Rules','About Us'];
  var MSG = 'That page isn’t part of this prototype. Only the Rules page is.';

  function el(tag, cls, attrs) { var e = document.createElement(tag); if (cls) e.className = cls; if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  function build(mode) {
    var c = CFG[mode];
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var toastT;

    var stage = el('div', 'pt-stage');
    var device = el('div', 'pt-device', { 'data-mode': mode });
    var frame = el('div', 'pt-frame');
    if (mode === 'desktop') {
      var dots = el('div', 'pt-dots'); dots.innerHTML = '<i></i><i></i><i></i>'; frame.appendChild(dots);
      var url = el('div', 'pt-url'); url.textContent = c.urlText; frame.appendChild(url);
    } else {
      frame.appendChild(el('div', 'pt-island'));
    }
    var view = el('div', 'pt-view');
    var scroller = el('div', 'pt-scroll', { tabindex: '0', role: 'region', 'aria-label': 'Scrollable ' + mode + ' prototype of the Rules page' });
    var menu = el('div', 'pt-menu');
    var hint = el('div', 'pt-hint'); hint.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2v10M3 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Interactive: scroll to explore';
    var toast = el('div', 'pt-toast'); toast.setAttribute('role', 'status');

    var navWrap = el('div', 'pt-nav');
    var nav = el('div', 'pt-navimg'); nav.style.position = 'relative';
    nav.appendChild(el('img', '', { src: SRC + c.pre + '-nav.webp', alt: mode === 'desktop' ? 'Triceratops site navigation' : 'Triceratops mobile header', draggable: 'false' }));
    c.hot.forEach(function (h) {
      var b = el('button', 'pt-hot', { type: 'button', 'data-k': h[0], 'aria-label': LABELS[h[0]] });
      b.style.left = (h[1] / c.w * 100) + '%'; b.style.width = ((h[2] - h[1]) / c.w * 100) + '%';
      b.style.top = (h[3] / c.navH * 100) + '%'; b.style.height = ((h[4] - h[3]) / c.navH * 100) + '%';
      nav.appendChild(b);
    });
    navWrap.appendChild(nav);

    var content = el('div', 'pt-content');
    c.slices.forEach(function (h, i) {
      var im = el('img', '', { src: SRC + c.pre + '-' + i + '.webp', alt: i === 0 ? 'Triceratops Rules page, ' + mode + ' design' : '', draggable: 'false', decoding: 'async', width: c.w, height: h });
      if (i > 1) im.setAttribute('loading', 'lazy');
      if (i < c.slices.length - 1) im.style.marginBottom = (-c.ov / c.w * 100) + '%';
      content.appendChild(im);
    });

    scroller.appendChild(navWrap); scroller.appendChild(content);
    view.appendChild(scroller); view.appendChild(menu); view.appendChild(hint); view.appendChild(toast);
    frame.appendChild(view); device.appendChild(frame); stage.appendChild(device);

    MENU.forEach(function (t) {
      var b = el('button', '', { type: 'button' }); b.textContent = t;
      if (t === 'Rules') b.setAttribute('aria-current', 'page');
      b.addEventListener('click', function () { closeMenu(); if (t === 'Rules') toTop(); else say(MSG); });
      menu.appendChild(b);
    });
    var join = el('button', 'pt-join', { type: 'button' }); join.textContent = 'Join Our Discord';
    join.addEventListener('click', function () { closeMenu(); say(MSG); });
    menu.appendChild(join);

    function say(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2400); }
    function closeMenu() { menu.classList.remove('on'); }
    function toTop() { scroller.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
    function layout() { var nh = c.navH * scroller.clientWidth / c.w; view.style.setProperty('--navh', nh + 'px'); menu.style.top = nh + 'px'; }

    scroller.addEventListener('scroll', function () {
      if (menu.classList.contains('on') && scroller.scrollTop > 4) closeMenu();
    }, { passive: true });
    navWrap.addEventListener('click', function (e) {
      var b = e.target.closest('.pt-hot'); if (!b) return;
      var k = b.getAttribute('data-k');
      if (k === 'menu') { menu.classList.toggle('on'); return; }
      if (k === 'rules') { toTop(); return; }
      say(MSG);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', layout, { passive: true });
    requestAnimationFrame(layout);
    return stage;
  }

  function init(root) {
    if (root.getAttribute('data-ready')) return;
    root.setAttribute('data-ready', '1');
    root.setAttribute('data-nozoom', '1');
    var pt = el('div', 'pt');
    pt.appendChild(build('desktop'));
    var m = build('mobile'); m.style.marginTop = 'clamp(16px,2.4vw,26px)';
    pt.appendChild(m);
    root.appendChild(pt);
  }

  function scan() { var n = document.querySelectorAll('[data-proto-mount]:not([data-ready])'); for (var i = 0; i < n.length; i++) init(n[i]); }
  function start() {
    scan();
    var mo = new MutationObserver(function () { if (document.querySelector('[data-proto-mount]:not([data-ready])')) scan(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 15000);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
