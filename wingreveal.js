/* Wing reveal: as each section scrolls in, it opens through a butterfly-shaped hole between two 3D wing panels.
   The panels wear the colour of the section above, are hinged at the screen edges, swing back as you scroll, beat
   harder the faster you scroll, and breathe when you stop. A small butterfly body rides the hinge point.
   Switch: `effects.wingReveal` in config/site-config.js (false = the original straight scroll).
   Off under reduced motion and in print. Never intercepts scrolling; panels never take pointer events. */
(() => {
  const S = window.SITE || {};
  if (!S.effects || S.effects.wingReveal === false) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('wr-on');

  const NS = 'http://www.w3.org/2000/svg', SEG = 12;
  const mk = (tag, cls, parent) => { const e = document.createElementNS(NS, tag); if (cls) e.setAttribute('class', cls); parent.append(e); return e; };
  const ease = t => 1 - Math.pow(1 - t, 3);
  const bez = (a, b, c, d, out, skip) => { for (let i = skip ? 1 : 0; i <= SEG; i++) { const t = i / SEG, u = 1 - t;
    out.push([u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0], u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1]]); } };

  /* Every section after the hero (the mid-page band too), each covered by the colour of whatever sits above it. */
  const hosts = [...document.querySelectorAll('main > section:not(.hero), main > .midband')];
  const bgOf = el => { for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !/rgba?\(0, 0, 0, 0\)|transparent/.test(c)) return c; } return getComputedStyle(document.body).backgroundColor; };

  const secs = hosts.map(el => {
    el.classList.add('wr-host');
    const mkPanel = side => {
      const d = document.createElement('div'); d.className = 'wr-panel ' + (side < 0 ? 'l' : 'r'); d.setAttribute('aria-hidden', 'true'); el.append(d);
      const svg = mk('svg', '', d), band = mk('path', 'band', svg), line = mk('path', 'line', svg), dots = mk('g', '', svg);
      for (let i = 0; i < 4; i++) mk('circle', 'dot', dots).setAttribute('r', 2.8);
      return { d, svg, band, line, dots: [...dots.children], side };
    };
    const hinge = mk('svg', 'wr-hinge', el); hinge.setAttribute('aria-hidden', 'true');
    const body = mk('g', 'body', hinge);
    body.innerHTML = '<path class="ant" d="M-2 -30 C-6 -44 -12 -52 -20 -56"/><path class="ant" d="M2 -30 C6 -44 12 -52 20 -56"/><circle cx="-20" cy="-56" r="2.6"/><circle cx="20" cy="-56" r="2.6"/>' +
      '<circle cx="0" cy="-26" r="6"/><ellipse cx="0" cy="-10" rx="7.5" ry="13"/><ellipse cx="0" cy="26" rx="5" ry="32"/><ellipse class="sheen" cx="-2" cy="-12" rx="2" ry="7"/>';
    /* scroll story's pinned project slide (main.js wraps it in .pin): the panels must never reach it */
    return { el, L: mkPanel(-1), R: mkPanel(1), hinge, body, p: 0, stop: el.querySelector('.pin') };
  });
  const paint = () => secs.forEach(s => s.el.style.setProperty('--wr-prev', bgOf(s.el.previousElementSibling || s.el.parentElement)));
  paint();
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });   // night grove changes the colours

  /* One wing edge in px, swallowtail-shaped: from the body, a tail, the rounded hindwing, a notch, the long forewing to its tip. */
  function edge(p, side, W, v, flutter) {
    const e = ease(p), cx = W / 2, span = W * (0.04 + e * 0.26), A = v * (0.18 + 0.80 * e);
    const X = f => cx + side * f, pts = [];
    const apex = [cx, A], tailTip = [X(span * 0.14), A * 1.22], tailBack = [X(span * 0.24), A * 0.98], notch = [X(span * 0.60), A * 0.52], tip = [X(span + W * 0.05 + flutter), -8];
    bez(apex, [X(span * 0.03), A * 1.05], [X(span * 0.10), A * 1.16], tailTip, pts, false);
    bez(tailTip, [X(span * 0.17), A * 1.12], [X(span * 0.21), A * 1.01], tailBack, pts, true);
    bez(tailBack, [X(span * 0.52), A * 1.02], [X(span * 0.84), A * 0.88], notch, pts, true);
    bez(notch, [X(span * 0.80), A * 0.32], [X(span * 1.25 + flutter), A * 0.10], tip, pts, true);
    return { pts, A };
  }

  const hide = s => { s.L.d.style.display = s.R.d.style.display = 'none'; s.hinge.style.opacity = 0; };
  let raf = 0, lastY = scrollY, speed = 0, snap = false, lastT = 0, snapUntil = 0;
  /* Menu and in-page links land on an open section: while their smooth scroll runs, the wings follow it exactly. */
  document.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) { snapUntil = performance.now() + 1600; go(); } });
  function frame(time) {
    raf = 0;
    const vh = innerHeight, dy = scrollY - lastY; lastY = scrollY;
    if (Math.abs(dy) > vh * 0.9) snap = true;                       // anchor jumps and Home/End land fully open, no slow reveal
    /* time-based easing, so the glide feels the same at 30 or 144 frames per second (0.14 per frame at 60 fps) */
    const dt = Math.min(100, lastT ? time - lastT : 16.7); lastT = time;
    const glide = 1 - Math.pow(0.86, dt / 16.7);
    speed += (Math.min(Math.abs(dy) * 16.7 / Math.max(dt, 1), 60) - speed) * (1 - Math.pow(0.88, dt / 16.7));
    let busy = speed > 0.05;
    /* all layout reads first (one flush), then the loop below only writes */
    const tops = secs.map(s => s.el.getBoundingClientRect().top), widths = secs.map(s => s.el.clientWidth);
    const stops = secs.map((s, i) => s.stop ? s.stop.getBoundingClientRect().top - tops[i] : Infinity);
    secs.forEach((s, i) => {
      const top = tops[i];
      const target = s.open ? 1 : Math.min(1, Math.max(0, (vh - top) / (vh * 0.48)));
      if (snap || time < snapUntil || top + stops[i] < vh) s.p = target;   // no lag once the slide is on screen
      else { s.p += (target - s.p) * glide; if (Math.abs(target - s.p) < 0.0008) s.p = target; }
      const p = s.p;
      if (p >= 1) { hide(s); return; }
      if (p <= 0) {                                                  // still below the screen: keep it covered, nothing to draw
        for (const w of [s.L, s.R]) { w.d.style.display = ''; w.d.style.height = vh + 'px'; w.d.style.clipPath = 'none'; w.d.style.transform = ''; w.d.style.setProperty('--wr-shade', 0); w.svg.style.opacity = 0; }
        s.hinge.style.opacity = 0; return;
      }
      busy = true;
      const W = widths[i], v = Math.max(1, vh - top), e = ease(p);
      const beat = Math.sin(time / 85) * Math.min(speed * 0.45, 12) + Math.sin(time / 650) * 2.2 * (1 - e);
      const flutter = Math.sin(time / 120) * Math.min(speed * 0.4, 10) * (1 - e);
      const angle = Math.max(0, 40 * Math.pow(p, 1.6) + beat);
      const L = edge(p, -1, W, v, flutter), R = edge(p, 1, W, v, flutter);
      for (const w of [s.L, s.R]) {
        const { pts } = w.side < 0 ? L : R, H = Math.min(v + 40, stops[i]), outer = w.side < 0 ? 0 : W;
        const poly = [[outer, -10], ...pts.slice().reverse(), [W / 2, H], [outer, H]];
        w.d.style.display = ''; w.d.style.height = H + 'px';
        w.d.style.clipPath = 'polygon(' + poly.map(([x, y]) => x.toFixed(1) + 'px ' + y.toFixed(1) + 'px').join(',') + ')';
        w.d.style.transform = 'rotateY(' + (w.side * angle).toFixed(2) + 'deg)';
        w.d.style.setProperty('--wr-shade', Math.sin(Math.min(angle, 90) * Math.PI / 180).toFixed(3));
        w.svg.setAttribute('width', W); w.svg.setAttribute('height', H);
        const d = 'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join(' L');
        w.line.setAttribute('d', d); w.band.setAttribute('d', d);
        for (let i = 0; i < 4; i++) { const q = pts[2 * SEG + 2 + i * 3]; w.dots[i].setAttribute('cx', q[0].toFixed(1)); w.dots[i].setAttribute('cy', (q[1] + 11).toFixed(1)); }
        w.svg.style.opacity = Math.sin(p * Math.PI).toFixed(3);
      }
      const bob = Math.sin(time / 260) * 2 - Math.min(speed, 20) * 0.15 * Math.sin(time / 85);
      s.hinge.setAttribute('width', W); s.hinge.setAttribute('height', L.A + 80);
      s.body.setAttribute('transform', 'translate(' + (W / 2).toFixed(1) + ' ' + (L.A - 14 + bob).toFixed(1) + ') scale(' + (0.75 + 0.45 * e).toFixed(3) + ')');
      s.hinge.style.opacity = Math.min(1, (1 - p) * 3).toFixed(3);
    });
    snap = false;
    if (busy || time < snapUntil) raf = requestAnimationFrame(frame); else lastT = 0;
  }
  const go = () => { if (!raf) raf = requestAnimationFrame(frame); };
  window.SK_wingReveal = { secs, go };   // read-only handle for the tests
  addEventListener('scroll', go, { passive: true }); addEventListener('resize', go);
  /* Keyboard users never meet a covered control: focus inside a section opens it at once. */
  document.addEventListener('focusin', e => { const s = secs.find(x => x.el.contains(e.target)); if (s) { s.open = true; s.p = 1; hide(s); } });
  addEventListener('beforeprint', () => secs.forEach(hide));
  go();
})();
