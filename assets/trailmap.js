/* "Pick your run" trail map: filters the Pinboard by dispatching 'pinboard:trail'. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var TRAILS = [
    { key: 'thumbs',    name: 'Thumbnails',         n: 3, color: '#3E8E6A', shape: 'circle',  d: 'M402,100 C352,140 438,170 384,208 S330,246 300,268', lx: 378, ly: 104, anchor: 'end' },
    { key: 'posters',   name: 'Posters',            n: 3, color: '#2C6FB5', shape: 'square',  d: 'M522,54 C478,96 578,126 546,172 C520,208 566,240 560,268', lx: 546, ly: 58,  anchor: 'start' },
    { key: 'campaigns', name: 'Campaigns & guides', n: 3, color: '#12314A', shape: 'diamond', d: 'M648,96 C700,132 612,162 662,202 S724,246 742,268', lx: 672, ly: 100, anchor: 'start' }
  ];
  var TOTAL = 9;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function glyph(shape, color, size) {
    var s = size || 9;
    if (shape === 'circle') return '<svg width="' + (s + 2) + '" height="' + (s + 2) + '" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.6" fill="' + color + '"/></svg>';
    if (shape === 'square') return '<svg width="' + (s + 2) + '" height="' + (s + 2) + '" viewBox="0 0 12 12" aria-hidden="true"><rect x="1.6" y="1.6" width="8.8" height="8.8" rx="1.6" fill="' + color + '"/></svg>';
    return '<svg width="' + (s + 2) + '" height="' + (s + 2) + '" viewBox="0 0 12 12" aria-hidden="true"><rect x="2.6" y="2.6" width="6.8" height="6.8" rx="1.2" fill="' + color + '" transform="rotate(45 6 6)"/></svg>';
  }
  function glyphSvg(parent, shape, color, cx, cy) {
    var g = el('g', { transform: 'translate(' + cx + ',' + cy + ')' }, parent);
    if (shape === 'circle') el('circle', { r: 4.6, fill: color }, g);
    else if (shape === 'square') el('rect', { x: -4.4, y: -4.4, width: 8.8, height: 8.8, rx: 1.6, fill: color }, g);
    else el('rect', { x: -3.6, y: -3.6, width: 7.2, height: 7.2, rx: 1.2, fill: color, transform: 'rotate(45)' }, g);
    return g;
  }
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function init(root) {
    if (root.getAttribute('data-ready')) return;
    root.setAttribute('data-ready', '1');
    var cur = window.__pinTrail || 'all', raf = 0;

    var wrap = document.createElement('div'); wrap.className = 'tm';
    var card = document.createElement('div'); card.className = 'tm-card';
    card.innerHTML = '<div class="tm-head"><p class="tm-eyebrow">Trail map &middot; Pick your run</p><p class="tm-count" aria-live="polite"></p></div>';
    var svg = el('svg', { class: 'tm-svg', viewBox: '0 0 1000 300', role: 'group', 'aria-label': 'Trail map. Choose a run to filter the pinboard.' });
    card.appendChild(svg);

    // atmosphere + mountain layers
    var defs = el('defs', {}, svg);
    var sky = el('linearGradient', { id: 'tmSky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: '0', 'stop-color': '#F7FBFE' }, sky); el('stop', { offset: '1', 'stop-color': '#EAF2F8' }, sky);
    var snow = el('linearGradient', { id: 'tmSnow', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: '0', 'stop-color': '#FFFFFF' }, snow); el('stop', { offset: '1', 'stop-color': '#F1F6FA' }, snow);
    el('rect', { x: 0, y: 0, width: 1000, height: 300, fill: 'url(#tmSky)' }, svg);
    el('path', { d: 'M0,212 L92,150 L172,186 L272,108 L362,162 L432,96 L522,40 L612,102 L692,70 L782,140 L862,104 L942,160 L1000,134 L1000,300 L0,300 Z', fill: '#E1ECF4', 'stroke-linejoin': 'round' }, svg);
    el('path', { d: 'M0,242 L122,192 L222,216 L332,160 L442,206 L522,150 L622,202 L722,162 L832,216 L932,186 L1000,216 L1000,300 L0,300 Z', fill: '#D2E3EE', 'stroke-linejoin': 'round' }, svg);
    el('path', { d: 'M0,278 C200,256 340,288 520,270 S840,256 1000,276 L1000,300 L0,300 Z', fill: 'url(#tmSnow)' }, svg);

    // chairlift (quiet, static line + one slow cabin)
    var lift = 'M930,272 L806,128';
    el('path', { d: lift, fill: 'none', stroke: '#9FB0BF', 'stroke-width': 1.1, 'stroke-dasharray': '2 4' }, svg);
    [[930, 272], [868, 200], [806, 128]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 2.4, fill: '#8C9BA8' }, svg); });
    var cab = el('g', {}, svg);
    el('rect', { x: -4.5, y: -2.6, width: 9, height: 5.2, rx: 1.6, fill: '#12314A', opacity: .75 }, cab);
    if (!reduce) { var am = el('animateMotion', { dur: '46s', repeatCount: 'indefinite', path: lift, calcMode: 'linear' }, cab); }

    // trails
    var T = {};
    TRAILS.forEach(function (t) {
      var g = el('g', { class: 'tm-trail', 'data-k': t.key }, svg);
      var glow = el('path', { d: t.d, class: 'tm-glow' }, g);
      var line = el('path', { d: t.d, class: 'tm-line', stroke: t.color }, g);
      t.len = line.getTotalLength();
      line.style.strokeDasharray = t.len; line.style.strokeDashoffset = 0;
      T[t.key] = { g: g, line: line, glow: glow };
    });
    // markers (buttons)
    var hits = {};
    TRAILS.forEach(function (t) {
      var p = t.d.match(/^M([\d.]+),([\d.]+)/), x = +p[1], y = +p[2];
      var h = el('g', { class: 'tm-hit', role: 'button', tabindex: 0, 'aria-label': t.name + ', ' + t.n + ' pins', 'aria-pressed': 'false' }, svg);
      el('circle', { cx: x, cy: y, r: 22, fill: 'transparent' }, h);
      var pin = el('g', { class: 'tm-pin' }, h);
      el('circle', { cx: x, cy: y, r: 11.5, fill: '#fff', stroke: '#E1E8EE', 'stroke-width': 1, style: 'filter:drop-shadow(0 4px 8px rgba(18,49,74,.22))' }, pin);
      glyphSvg(pin, t.shape, t.color, x, y);
      el('circle', { class: 'tm-ring', cx: x, cy: y, r: 16 }, h);
      var lbl = el('text', { class: 'tm-lbl', x: t.lx, y: t.ly, 'text-anchor': t.anchor }, h); lbl.textContent = t.name;
      var sub = el('text', { class: 'tm-sub', x: t.lx, y: t.ly + 14, 'text-anchor': t.anchor }, h); sub.textContent = t.n + ' pins';
      hits[t.key] = h;
      h.addEventListener('click', function () { choose(cur === t.key ? 'all' : t.key); });
      h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(cur === t.key ? 'all' : t.key); } });
    });
    // rider (a quiet board silhouette)
    var rider = el('g', { class: 'tm-rider', opacity: 0 }, svg);
    el('ellipse', { cx: 0, cy: 3.2, rx: 9, ry: 2, fill: 'rgba(18,49,74,.18)' }, rider);
    var board = el('g', {}, rider);
    el('rect', { x: -8.5, y: -2.3, width: 17, height: 4.6, rx: 2.3, fill: '#12314A', stroke: '#fff', 'stroke-width': 1 }, board);
    el('circle', { cx: 0, cy: -5.4, r: 2.1, fill: '#12314A', stroke: '#fff', 'stroke-width': .9 }, rider);

    // legend
    var legend = document.createElement('div'); legend.className = 'tm-legend'; legend.setAttribute('role', 'group'); legend.setAttribute('aria-label', 'Filter pinboard by run');
    var chips = {};
    function chip(key, html) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tm-chip'; b.innerHTML = html; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', function () { choose(cur === key && key !== 'all' ? 'all' : key); }); legend.appendChild(b); chips[key] = b; return b; }
    chip('all', 'All runs <small>' + TOTAL + '</small>');
    TRAILS.forEach(function (t) { chip(t.key, glyph(t.shape, t.color) + t.name + ' <small>' + t.n + '</small>'); });
    var reset = document.createElement('button'); reset.type = 'button'; reset.className = 'tm-reset'; reset.textContent = 'Back to base'; reset.hidden = true;
    reset.addEventListener('click', function () { choose('all'); }); legend.appendChild(reset);
    card.appendChild(legend);
    wrap.appendChild(card); root.appendChild(wrap);
    var count = card.querySelector('.tm-count');

    function paintStatic(key) {
      cur = key; window.__pinTrail = key;
      Object.keys(chips).forEach(function (k) { chips[k].setAttribute('aria-pressed', String(k === key)); });
      Object.keys(hits).forEach(function (k) { hits[k].setAttribute('aria-pressed', String(k === key)); });
      TRAILS.forEach(function (t) {
        var on = key === 'all' || key === t.key;
        T[t.key].g.style.opacity = on ? 1 : 0.18;
        T[t.key].line.style.strokeWidth = key === t.key ? 3.4 : 2.2;
        hits[t.key].querySelector('.tm-lbl').style.opacity = on ? 1 : 0.35;
        hits[t.key].querySelector('.tm-sub').style.opacity = on ? 1 : 0.35;
      });
      var n = key === 'all' ? TOTAL : 3;
      count.textContent = key === 'all' ? 'All ' + TOTAL + ' pins' : 'Showing ' + n + ' of ' + TOTAL;
      reset.hidden = key === 'all';
    }
    function place(t, L) {
      var path = T[t.key].line, p = path.getPointAtLength(L), q = path.getPointAtLength(Math.min(t.len, L + 2)), r = path.getPointAtLength(Math.max(0, L - 2));
      var ang = Math.atan2(q.y - r.y, q.x - r.x) * 180 / Math.PI;
      rider.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ')');
      board.setAttribute('transform', 'rotate(' + (ang * 0.55).toFixed(1) + ')');
    }
    function glide(key) {
      cancelAnimationFrame(raf);
      var t = TRAILS.filter(function (x) { return x.key === key; })[0], line = T[key].line;
      if (reduce) { line.style.strokeDashoffset = 0; place(t, t.len); rider.setAttribute('opacity', 1); return; }
      var start = performance.now(), dur = 1250;
      rider.setAttribute('opacity', 1); line.style.strokeDashoffset = t.len; place(t, 0);
      (function step(now) {
        var k = Math.min(1, (now - start) / dur), L = ease(k) * t.len;
        line.style.strokeDashoffset = t.len - L; place(t, L);
        if (k < 1) raf = requestAnimationFrame(step);
      })(start);
    }
    function choose(key, silent) {
      cancelAnimationFrame(raf);
      paintStatic(key);
      TRAILS.forEach(function (t) { if (t.key !== key) T[t.key].line.style.strokeDashoffset = 0; });
      if (key === 'all') { rider.setAttribute('opacity', 0); }
      else if (silent) { var t = TRAILS.filter(function (x) { return x.key === key; })[0]; T[key].line.style.strokeDashoffset = 0; place(t, t.len); rider.setAttribute('opacity', 1); }
      else glide(key);
      if (!silent) window.dispatchEvent(new CustomEvent('pinboard:trail', { detail: { trail: key } }));
      if (!silent && key !== 'all') setTimeout(function () {
        var first = document.querySelector('[data-cat="' + key + '"]'); if (!first) return;
        var r = first.getBoundingClientRect(), vh = window.innerHeight;
        if (r.top > vh * 0.78 || r.bottom < 80) window.scrollTo({ top: window.scrollY + r.top - vh * 0.22, behavior: reduce ? 'auto' : 'smooth' });
      }, 950);
    }
    choose(cur, true);
  }

  var scheduled = false;
  function scan() { scheduled = false; var n = document.querySelectorAll('[data-trailmap-mount]:not([data-ready])'); for (var i = 0; i < n.length; i++) init(n[i]); }
  function start() {
    scan();
    new MutationObserver(function () { if (!scheduled) { scheduled = true; requestAnimationFrame(scan); } }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
