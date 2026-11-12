/* Extras: night-grove theme, winner badge, keyboard catch, engine replay, live scorecard, offline app (PWA).
   Loaded after main.js; uses its globals ($, reduced, drifts, quest, store, dust). */
(() => {
  const S = window.SITE || {};

  /* Night grove: the head script sets data-theme before first paint; this button flips and remembers it. */
  const tBtn = $('#themeToggle');
  const paintTheme = () => { const dark = document.documentElement.dataset.theme === 'dark'; tBtn.setAttribute('aria-pressed', dark); const l = dark ? 'Switch to day grove' : 'Switch to night grove'; tBtn.title = l; $('#themeLabel').textContent = l; const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? '#0b1a15' : '#f5f5ed'; };
  tBtn.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try { localStorage.setItem('sk-theme', next); } catch {} paintTheme(); });
  paintTheme();

  /* Keyboard catch: a focus-only button nets the nearest free drifter, so the catch game is not mouse-only. */
  const kb = $('#kbCatch');
  if (kb) kb.addEventListener('click', () => { const d = drifts.find(x => x.flee <= 0 && getComputedStyle(x.el).display !== 'none'); if (d) d.el.click(); });

  /* Winner badge: drawn on a canvas and saved as a PNG. Nothing is uploaded. */
  function drawBadge() {
    const W = 1200, H = 630, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1d4134'); g.addColorStop(1, '#0a1c15'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#e8c35a'; c.lineWidth = 6; c.strokeRect(24, 24, W - 48, H - 48); c.strokeStyle = '#4fe39a55'; c.lineWidth = 2; c.strokeRect(40, 40, W - 80, H - 80);
    const fly = (x, y, s, col, rot) => { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col;
      for (const m of [-1, 1]) { c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(m * s * 2.4, -s * 2.8, m * s * 3.1, -s * .1, 0, 0); c.fill(); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(m * s * 2, s * .4, m * s * 1.3, s * 2.3, 0, s * .4); c.fill(); }
      c.fillStyle = '#0b0d06'; c.beginPath(); c.ellipse(0, s * .2, s * .16, s * 1.1, 0, 0, 6.3); c.fill(); c.restore(); };
    fly(930, 250, 62, '#2fa96b', -.25); fly(930, 250, 44, '#4fe39a', -.25); fly(930, 250, 22, '#aef7cf', -.25);
    [[760, 120, 12, '#e8c35a', .4], [1080, 440, 15, '#7fd8e8', -.5], [820, 470, 10, '#b88ae8', .2], [1100, 130, 9, '#aef7cf', .7], [700, 330, 8, '#4fe39a', -.3]].forEach(a => fly(...a));
    c.fillStyle = '#8fc49a'; c.font = '600 22px "Segoe UI", sans-serif'; c.fillText('FROM BUGS TO BRILLIANCE', 84, 130);
    c.fillStyle = '#ffffff'; c.font = '400 76px Georgia, serif'; c.fillText('Certified', 80, 235); c.fillStyle = '#e8c35a'; c.fillText('Bug Hunter', 80, 325);
    c.fillStyle = '#c9d8c3'; c.font = '400 26px "Segoe UI", sans-serif'; c.fillText('Cleared every field game on the portfolio of', 84, 400);
    c.fillStyle = '#ffffff'; c.font = '600 34px "Segoe UI", sans-serif'; c.fillText(S.name || 'Shashikumar Angajala', 84, 448);
    c.fillStyle = '#8fc49a'; c.font = '400 22px "Segoe UI", sans-serif';
    c.fillText(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + '  ·  ' + Object.keys(games).filter(playable).length + ' games, ' + Object.keys(games).filter(playable).reduce((n, k) => n + games[k].total, 0) + ' steps', 84, 540);
    return cv;
  }
  function saveBadge() { drawBadge().toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'certified-bug-hunter.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }, 'image/png'); }
  window.SK_drawBadge = drawBadge;
  $('#celBadge').addEventListener('click', saveBadge);
  const foot = $('.quest-foot'); if (foot) { const b = document.createElement('button'); b.className = 'linkbtn badge-btn'; b.id = 'questBadgeBtn'; b.textContent = 'Download badge'; b.addEventListener('click', saveBadge); foot.append(b); }

  /* Engine replay: turn data copied from a real recorded run (run 20261022_113558, flow "calc-add" on Windows Calculator). */
  const TURNS = [
    { target: 'Clear', id: 'clearButton', ms: 96, show: '0' }, { target: 'One', id: 'num1Button', ms: 101, show: '1' }, { target: 'Plus', id: 'plusButton', ms: 99, show: '1 +' },
    { target: 'Two', id: 'num2Button', ms: 112, show: '2' }, { target: 'Equals', id: 'equalButton', ms: 107, show: '3' }, { target: 'Clear', id: 'clearButton', ms: 84, show: '0' }
  ];
  const rh = $('#replayHost'), rdlg = $('#replayDialog');
  if (rh && rdlg) {
    const keys = [['', ''], ['', ''], ['C', 'clearButton'], ['÷', ''], ['7', ''], ['8', ''], ['9', ''], ['×', ''], ['4', ''], ['5', ''], ['6', ''], ['−', ''], ['1', 'num1Button'], ['2', 'num2Button'], ['3', ''], ['+', 'plusButton'], ['±', ''], ['0', ''], ['.', ''], ['=', 'equalButton']];
    rh.innerHTML = '<div class="replay"><div class="calc" aria-hidden="true"><div class="calc-bar">Calculator</div><div class="calc-out" id="calcOut">0</div><div class="calc-keys">' + keys.map(k => '<i' + (k[1] ? ' data-aid="' + k[1] + '"' : '') + '>' + k[0] + '</i>').join('') + '</div><span class="calc-cursor"></span></div>' +
      '<div class="replay-side"><ol class="phases"><li>Perceive</li><li>Decide</li><li>Act</li><li>Verify</li></ol><p class="replay-now" id="replayNow" aria-live="polite">Press play to step through the six recorded turns.</p>' +
      '<table class="turns"><thead><tr><th>Turn</th><th>Action</th><th>Locator</th><th>Time</th><th>Verdict</th></tr></thead><tbody>' + TURNS.map((t, i) => '<tr><td>' + (i + 1) + '</td><td>click ' + t.target + '</td><td>' + t.id + '</td><td>' + t.ms + ' ms</td><td class="v">·</td></tr>').join('') + '</tbody></table>' +
      '<div class="actions"><button id="replayPlay">Play ▷</button><button id="replayStep">Step</button><button id="replayReset">Restart</button></div>' +
      '<p class="replay-facts">6 turns, 6 confirmed. Every decision came from rules (tier 1, flow step); no model was called. Each button was found by its AutomationId.</p></div></div>';
    const out = $('#calcOut'), now = $('#replayNow'), cur = rh.querySelector('.calc-cursor'), rows = [...rh.querySelectorAll('tbody tr')], ph = [...rh.querySelectorAll('.phases li')];
    let turn = 0, timer = 0, playing = false;
    const setPhase = i => ph.forEach((p, k) => p.classList.toggle('on', k === i));
    const wait = ms => new Promise(r => { timer = setTimeout(r, reduced() ? 0 : ms); });
    const reset = () => { clearTimeout(timer); playing = false; turn = 0; out.textContent = '0'; rows.forEach(r => { r.className = ''; r.querySelector('.v').textContent = '·'; }); setPhase(-1); rh.querySelectorAll('.calc-keys i').forEach(k => k.classList.remove('hit')); now.textContent = 'Press play to step through the six recorded turns.'; $('#replayPlay').textContent = 'Play ▷'; cur.style.opacity = 0; };
    async function step() {
      if (turn >= TURNS.length) return false; const t = TURNS[turn], row = rows[turn], key = rh.querySelector('[data-aid="' + t.id + '"]'); const mine = turn; row.className = 'cur';
      setPhase(0); now.textContent = 'Turn ' + (turn + 1) + ' · Perceive: walk the Calculator UI tree and take a screen signature.'; await wait(650); if (mine !== turn) return false;
      setPhase(1); now.textContent = 'Turn ' + (turn + 1) + ' · Decide: tier 1 rule, flow "calc-add" step ' + (turn % 5 + 1) + ' → click ' + t.target + '.'; await wait(650); if (mine !== turn) return false;
      setPhase(2); const kr = key.getBoundingClientRect(), cr = key.closest('.calc').getBoundingClientRect(); cur.style.opacity = 1; cur.style.translate = (kr.left - cr.left + kr.width / 2) + 'px ' + (kr.top - cr.top + kr.height / 2) + 'px';
      now.textContent = 'Turn ' + (turn + 1) + ' · Act: SendInput click on "' + t.target + '" (found by AutomationId ' + t.id + ') in ' + t.ms + ' ms.'; await wait(600); if (mine !== turn) return false;
      key.classList.add('hit'); out.textContent = t.show; setTimeout(() => key.classList.remove('hit'), 320);
      setPhase(3); now.textContent = 'Turn ' + (turn + 1) + ' · Verify: all checks passed. Verdict: confirmed.'; row.className = 'done'; row.querySelector('.v').textContent = 'confirmed ✓'; await wait(600); if (mine !== turn) return false;
      turn++; if (turn >= TURNS.length) { setPhase(-1); now.textContent = 'Run complete: 6 of 6 turns confirmed. 1 + 2 = 3, then the flow restarted with Clear.'; }
      return true;
    }
    async function play() { if (playing) { playing = false; clearTimeout(timer); $('#replayPlay').textContent = 'Play ▷'; return; } if (turn >= TURNS.length) reset(); playing = true; $('#replayPlay').textContent = 'Pause ❚❚'; while (playing && await step()); playing = false; $('#replayPlay').textContent = turn >= TURNS.length ? 'Replay ↻' : 'Play ▷'; }
    $('#replayPlay').addEventListener('click', play);
    $('#replayStep').addEventListener('click', () => { if (!playing) { if (turn >= TURNS.length) reset(); step(); } });
    $('#replayReset').addEventListener('click', reset);
    document.addEventListener('click', e => { if (e.target.closest('#openReplay')) { reset(); rdlg.showModal(); } });
    rdlg.addEventListener('click', e => { if (e.target === rdlg || e.target.closest('.dlg-close')) rdlg.close(); });
    rdlg.addEventListener('close', reset);
  }

  /* Live scorecard: numbers read from this visit through the browser's Performance API. */
  const sh = $('#scoreHost');
  if (sh) {
    const tile = (label, id, note) => '<div class="score"><b id="' + id + '">…</b><small>' + label + '</small><span>' + note + '</span></div>';
    sh.innerHTML = '<div class="scores">' + tile('Page ready', 'scReady', 'time until the page could be used') + tile('Page weight', 'scWeight', 'every file, compressed size') + tile('Files loaded', 'scFiles', 'all from this site') +
      tile('Calls to other sites', 'scThird', 'trackers, fonts, CDNs') + tile('Cookies set', 'scCookies', 'nothing stored about you') + tile('Animation rate', 'scFps', 'frames per second right now') + '</div>' +
      '<p class="score-note">' + (S.github && S.repo ? 'This site also tests itself: a Playwright suite plays every game and checks every link on each change. <a class="more" rel="noopener" href="' + String(S.github).replace(/\/+$/, '') + '/' + S.repo + '/tree/main/tests">See the test suite ↗</a>' : 'This site also tests itself: a Playwright suite plays every game and checks every link on each change.') + '</p>';
    const fill = () => {
      const nav = performance.getEntriesByType('navigation')[0], res = performance.getEntriesByType('resource');
      const size = e => e.encodedBodySize || e.transferSize || 0, bytes = (nav ? size(nav) : 0) + res.reduce((n, e) => n + size(e), 0);
      const third = res.filter(e => { try { return new URL(e.name).origin !== location.origin; } catch { return false; } }).length;
      $('#scReady').textContent = nav && nav.domContentLoadedEventEnd ? (nav.domContentLoadedEventEnd / 1000).toFixed(2) + ' s' : 'n/a';
      $('#scWeight').textContent = bytes ? (bytes / 1024 / 1024).toFixed(2) + ' MB' : 'n/a';
      $('#scFiles').textContent = res.length + (nav ? 1 : 0);
      $('#scThird').textContent = third; $('#scCookies').textContent = document.cookie ? document.cookie.split(';').length : 0;
      if (reduced()) { $('#scFps').textContent = 'paused'; return; }
      let frames = 0, t0 = performance.now(); const count = t => { frames++; if (t - t0 < 1000) requestAnimationFrame(count); else $('#scFps').textContent = Math.round(frames * 1000 / (t - t0)) + ' fps'; }; requestAnimationFrame(count);
    };
    const whenSeen = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) fill(); }, { threshold: .2 });
    if (document.readyState === 'complete') whenSeen.observe(sh); else addEventListener('load', () => whenSeen.observe(sh));
  }

  /* Offline app: a service worker caches the site so it opens with no connection (only over http/https, not file://). */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

  /* Compact menu (under 900px): the section links fold into a panel under the header. Escape or a link closes it. */
  const navEl = document.querySelector('header nav'), navBtn = $('#navToggle'), navMenu = $('#navMenu');
  if (navEl && navBtn && navMenu) {
    const compact = matchMedia('(max-width: 900px)');
    const setMenu = (open, focusBtn) => {
      navEl.classList.toggle('open', open); navBtn.setAttribute('aria-expanded', open);
      if (open) { const first = navMenu.querySelector('a'); if (first) first.focus({ preventScroll: true }); } else if (focusBtn) navBtn.focus({ preventScroll: true });
    };
    navBtn.addEventListener('click', () => setMenu(!navEl.classList.contains('open')));
    navMenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && navEl.classList.contains('open')) setMenu(false, true); });
    document.addEventListener('pointerdown', e => { if (navEl.classList.contains('open') && !navEl.contains(e.target)) setMenu(false); });
    navMenu.addEventListener('focusout', e => { if (compact.matches && navEl.classList.contains('open') && !navEl.contains(e.relatedTarget)) setMenu(false); });
    compact.addEventListener('change', () => setMenu(false));
  }

  /* Offscreen sections pause their CSS idle loops (wings, card art, caterpillars). JS timers, canvases and
     dialogs are untouched; the featured console keeps its own rhythm. */
  if ('IntersectionObserver' in window) {
    const idle = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('idle', !e.isIntersecting)), { rootMargin: '200px 0px' });
    document.querySelectorAll('main > section, main > .midband, main > .expertise-strip, footer').forEach(s => idle.observe(s));
  }
})();
