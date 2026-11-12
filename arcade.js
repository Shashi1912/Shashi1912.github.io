/* Test bench: four mini-games in the QA Lab plus Chaos mode. Loaded after main.js and uses its globals
   (addGame, score, games, tip, dust, pick, shuffle, reduced, $). Every game registers itself in the quest orb. */
(() => {
  const host = document.getElementById('arcadeHost'); if (!host) return;
  const ICON = {
    spot: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 9h18" stroke="currentColor" stroke-width="2"/><circle cx="15.5" cy="14.5" r="2.2" fill="#4fe39a"/></svg>',
    flaky: '<svg viewBox="0 0 24 24"><path d="M3 13h4l2-6 4 12 2-6h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    log: '<svg viewBox="0 0 24 24"><path d="M5 6h14M5 10h9M5 14h14M5 18h7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="18" cy="10" r="2" fill="#4fe39a"/></svg>',
    interview: '<svg viewBox="0 0 24 24"><path d="M4 5h16v10H10l-4 4v-4H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 8v3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="13" r="1.1" fill="#4fe39a"/></svg>',
    chaos: '<svg viewBox="0 0 24 24"><path d="M13 3 5 13h6l-1 8 8-11h-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  };
  const card = (id, title, intro) => {
    const c = document.createElement('article'); c.className = 'arc'; c.id = 'arc-' + id;
    c.innerHTML = '<header><h4></h4><span class="arc-chip" hidden>Solved ✓</span></header><p class="arc-intro"></p><div class="arc-body"></div><p class="arc-status" aria-live="polite"></p>';
    c.querySelector('h4').textContent = title; c.querySelector('.arc-intro').textContent = intro;
    host.append(c);
    return { root: c, body: c.querySelector('.arc-body'), say: t => { c.querySelector('.arc-status').textContent = t; }, solved: () => { c.querySelector('.arc-chip').hidden = false; c.classList.add('solved'); } };
  };
  const btn = (text, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls || ''; b.textContent = text; return b; };
  const flash = el => { const r = el.getBoundingClientRect(); dust(r.left + r.width / 2, r.top + r.height / 2, '#4fe39a', 8); };

  /* 1 · Spot the defect: a mock checkout where three random pieces are wrong. */
  addGame('spot', { name: 'Spot the defect', total: 3, href: '#arc-spot', icon: ICON.spot, desc: 'Three things are wrong in a small checkout screen. Click each one.', tips: ['Defect logged · 1 of 3', 'Defect logged · 2 of 3'], win: 'All three checkout defects logged. Nothing gets past you.' });
  (() => {
    const c = card('spot', 'Spot the defect', 'This checkout has defects planted in it. Click anything that looks wrong.');
    const pieces = [
      { k: 'title', good: 'Checkout', fixed: true },
      { k: 'line', good: 'Field notebook · 2 × ₹240 = ₹480', bad: 'Field notebook · 2 × ₹240 = ₹460', why: 'Wrong line total: 2 × 240 is 480.' },
      { k: 'ship', good: 'Shipping · ₹60', bad: 'Shipping · $60', why: 'Wrong currency symbol on shipping.' },
      { k: 'total', good: 'Total · ₹540', bad: 'Total · ₹530', why: 'Wrong grand total: 480 + 60 is 540.' },
      { k: 'date', good: 'Delivery by 28 Feb', bad: 'Delivery by 31 Feb', why: 'Impossible date: February has no 31st.' },
      { k: 'label', good: 'Email address', bad: 'Email adress', why: 'Spelling mistake in the field label.' },
      { k: 'pay', good: 'Pay now', bad: 'Pay nwo', why: 'Spelling mistake on the button.' }
    ];
    const need = games.spot.total - games.spot.n;
    const bad = new Set(shuffle(pieces.filter(p => p.bad)).slice(0, need).map(p => p.k));
    const mock = document.createElement('div'); mock.className = 'mock';
    pieces.forEach(p => { const b = btn(bad.has(p.k) ? p.bad : p.good, 'mk mk-' + p.k); b.dataset.k = p.k; mock.append(b); });
    c.body.append(mock);
    if (need <= 0) { c.solved(); c.say('Already solved.'); }
    mock.addEventListener('click', e => {
      const b = e.target.closest('.mk'); if (!b) return;
      const p = pieces.find(x => x.k === b.dataset.k);
      if (bad.has(p.k)) { bad.delete(p.k); b.textContent = p.good; b.classList.add('fixed'); flash(b); c.say('Logged: ' + p.why); score('spot'); if (!bad.size) c.solved(); }
      else c.say(b.classList.contains('fixed') ? 'Already fixed.' : 'That one is working as designed. Look again.');
    });
  })();

  /* 2 · Flaky test: observe a failure, then name the cause. */
  addGame('flaky', { name: 'Flaky test', total: 2, href: '#arc-flaky', icon: ICON.flaky, desc: 'A test passes and fails at random. Watch it fail, then find why.', tips: ['You saw it fail. Now compare the runs and pick the cause.'], win: 'Flaky test explained: a timing race, not bad luck.' });
  (() => {
    const c = card('flaky', 'Flaky test', 'test_login_under_load fails "sometimes". Run it a few times and compare the runs.');
    const out = document.createElement('ol'); out.className = 'runlog';
    const run = btn('Run test ▷', 'arc-run'); const q = document.createElement('div'); q.className = 'arc-q'; q.hidden = true;
    q.innerHTML = '<p>Why does it fail sometimes?</p>';
    const opts = shuffle([['The password is wrong on some runs.', false], ['The response is sometimes slower than the 200 ms timeout.', true], ['The tests run in a different order each time.', false]]);
    opts.forEach(([t, ok]) => { const b = btn(t, 'arc-opt'); b.addEventListener('click', () => {
      if (ok) { b.classList.add('right'); flash(b); c.say('Correct. Passing runs are under 200 ms, failing runs are over it. The fix is a proper wait, not a retry.'); if (games.flaky.n === 1) score('flaky'); c.solved(); }
      else { b.classList.add('wrong'); c.say('The log does not support that. Compare the response time of passing and failing runs.'); }
    }); q.append(b); });
    let n = 0, failed = games.flaky.n >= 1;
    run.addEventListener('click', () => {
      n++; const ms = n === 3 && !failed ? 231 : Math.round(118 + Math.random() * 140), ok = ms <= 200;
      const li = document.createElement('li'); li.className = ok ? 'ok' : 'fail';
      li.textContent = 'run #' + n + ' · response ' + ms + ' ms · ' + (ok ? 'PASS' : 'FAIL (timeout 200 ms)');
      out.append(li); while (out.children.length > 6) out.firstChild.remove();
      if (!ok && !failed) { failed = true; score('flaky'); }
      if (failed) q.hidden = false;
      c.say(ok ? 'Passed.' : 'Failed. Look at the response time.');
    });
    c.body.append(run, out, q);
    if (games.flaky.n >= 2) { c.solved(); q.hidden = false; }
  })();

  /* 3 · Log detective: click the root-cause line, not a symptom. */
  addGame('log', { name: 'Log detective', total: 1, href: '#arc-log', icon: ICON.log, desc: 'Find the line that caused the failure, not the errors that followed it.', win: 'Root cause found. The first error is rarely the real story.' });
  (() => {
    const c = card('log', 'Log detective', 'Checkout failed for a user. Click the log line that is the root cause.');
    const cases = [
      [['INFO', 'app: started build 4.2.1'], ['INFO', 'config: loaded 41 keys'], ['WARN', 'config: key session.ttl missing, using default 0', 'root'], ['INFO', 'auth: user 8812 logged in'], ['INFO', 'cart: 2 items added'], ['WARN', 'cache: 3 entries evicted'], ['ERROR', 'session: session 8812 expired immediately', 'sym'], ['ERROR', 'checkout: user not logged in', 'sym'], ['INFO', 'http: 401 returned to client']],
      [['INFO', 'export: job 77 started'], ['INFO', 'db: connected in 18 ms'], ['INFO', 'export: 1,840 rows matched'], ['WARN', 'export: page size 1000, pagination disabled', 'root'], ['INFO', 'export: wrote 1,000 rows'], ['WARN', 'disk: 81% used'], ['ERROR', 'verify: row count mismatch, expected 1840 got 1000', 'sym'], ['ERROR', 'export: job 77 failed verification', 'sym'], ['INFO', 'mail: failure notice queued']]
    ];
    const lines = pick(cases), box = document.createElement('div'); box.className = 'logbox';
    lines.forEach(([lvl, msg, role], i) => { const b = btn('', 'logline lv-' + lvl.toLowerCase()); b.innerHTML = '<span class="ln"></span><span class="lv"></span><span class="lm"></span>';
      b.querySelector('.ln').textContent = String(i + 1).padStart(2, '0'); b.querySelector('.lv').textContent = lvl; b.querySelector('.lm').textContent = msg;
      b.addEventListener('click', () => {
        if (role === 'root') { b.classList.add('right'); flash(b); c.say('That is it. A quiet warning set up every error after it.'); score('log'); c.solved(); }
        else if (role === 'sym') { b.classList.add('wrong'); c.say('That is a symptom. What happened before it?'); }
        else c.say('Routine line. Nothing wrong there.');
      }); box.append(b); });
    c.body.append(box);
    if (games.log.n >= 1) c.solved();
  })();

  /* 4 · Defect interview: question a reporter, then name the cause. ai.js upgrades it to free-text questions when a model is available. */
  addGame('interview', { name: 'Defect interview', total: 1, href: '#arc-interview', icon: ICON.interview, desc: 'A user reports a vague problem. Ask the right questions and name the cause.', win: 'Cause identified from the interview. Good questions beat guesses.' });
  (() => {
    const c = card('interview', 'Defect interview', 'A user reports a vague problem. Ask questions, then name the cause.');
    const cases = [
      { report: '"When I press Save, my note is sometimes just gone."',
        facts: 'Notes are saved to a file named after the note title. A title containing the "/" character produces an invalid file name, so the save silently fails. Plain titles always save. It happens online and offline, on the current and previous version. The app shows "Saved" with no error.',
        qa: [['Does it happen to every note?', 'No, only some. Short plain titles always save.'], ['What is different about the lost notes?', 'The lost ones had titles like "Q3/Q4 plan" and "Yes/No list".'], ['Do you see an error?', 'No. It says "Saved" like normal.'], ['Does it happen offline too?', 'Yes, same thing with no internet.'], ['Did it start after an update?', 'No, the older version did it too.']],
        causes: [['The network drops during the save.', false], ['A "/" in the title breaks the file name.', true], ['The disk is full.', false]] },
      { report: '"The exported report shows the wrong total for some customers."',
        facts: 'The export writes at most 1000 rows and silently drops the rest. Customers with more than 1000 orders get a total that is too low. Customers with fewer orders are correct. The on-screen total is always correct. It happens in every browser.',
        qa: [['Is it wrong for every customer?', 'No. Most are right. Only our biggest customers are wrong.'], ['Is the exported total too high or too low?', 'Always too low.'], ['How many orders do the wrong ones have?', 'Thousands. The correct ones have a few hundred.'], ['Is the total on screen correct?', 'Yes, the screen is right. Only the export is wrong.'], ['Does the browser matter?', 'No, same in all of them.']],
        causes: [['The export stops at 1000 rows.', true], ['Currency rounding differs per customer.', false], ['The browser cache shows an old file.', false]] }
    ];
    const cs = pick(cases); window.SK_INTERVIEW = { facts: cs.facts, report: cs.report };
    const rep = document.createElement('p'); rep.className = 'arc-report'; rep.textContent = cs.report;
    const chat = document.createElement('div'); chat.className = 'arc-chat'; chat.id = 'interviewChat';
    const qs = document.createElement('div'); qs.className = 'arc-qs'; qs.id = 'interviewQs';
    let asked = 0;
    const answer = (qText, aText) => { const d = document.createElement('p'); d.innerHTML = '<b></b><span></span>'; d.querySelector('b').textContent = qText; d.querySelector('span').textContent = aText; chat.append(d); asked++; if (asked >= 2) verdict.hidden = false; };
    window.SK_INTERVIEW.answer = answer;
    cs.qa.forEach(([qT, aT]) => { const b = btn(qT, 'arc-ask'); b.addEventListener('click', () => { b.disabled = true; answer(qT, aT); }); qs.append(b); });
    const verdict = document.createElement('div'); verdict.className = 'arc-q'; verdict.hidden = true; verdict.innerHTML = '<p>What is the cause?</p>';
    shuffle(cs.causes).forEach(([t, ok]) => { const b = btn(t, 'arc-opt'); b.addEventListener('click', () => {
      if (ok) { b.classList.add('right'); flash(b); c.say('Correct, and you got there in ' + asked + ' question' + (asked === 1 ? '' : 's') + '.'); score('interview'); c.solved(); }
      else { b.classList.add('wrong'); c.say('The answers do not support that. Ask another question.'); }
    }); verdict.append(b); });
    c.body.append(rep, qs, chat, verdict);
    if (games.interview.n >= 1) c.solved();
  })();

  /* Chaos mode: the switch in the orb panel plants defects in the real page; clicking one files it and repairs it. */
  addGame('chaos', { name: 'Chaos mode', total: 4, icon: ICON.chaos, desc: 'Turn on Chaos mode below. Four defects appear somewhere on this page. Click each to file it.', tips: ['Filed · 1 of 4', 'Filed · 2 of 4', 'Filed · 3 of 4'], win: 'All four injected defects filed and repaired. The page is clean again.' });
  (() => {
    const toggle = document.getElementById('chaosToggle'); if (!toggle) return;
    const swapText = (from, to) => el => { const node = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.includes(from)) || el; const old = node.textContent; node.textContent = old.replace(from, to); return () => { node.textContent = old; }; };
    const pool = [
      { sel: 'nav a[href="#projects"]', why: 'Typo in the navigation.', apply: swapText('Projects', 'Porjects') },
      { sel: '.hero .actions a[href="#projects"]', why: 'Typo on a hero button.', apply: swapText('work', 'wrok') },
      { sel: '#serviceList .card:nth-child(1) h3', why: 'Typo in a service title.', apply: swapText('Testing', 'Tetsing') },
      { sel: 'label[for="qty"]', why: 'Typo in a form label.', apply: swapText('quantity', 'quanttiy') },
      { sel: '.projgrid .proj:nth-child(2)', why: 'A project card was upside down.', apply: el => { el.style.rotate = '180deg'; return () => { el.style.rotate = ''; }; } },
      { sel: '#contact form button', why: 'The submit button was the wrong colour and misaligned.', apply: el => { el.style.cssText += ';background:#b3261e;margin-left:38%'; return () => { el.style.background = ''; el.style.marginLeft = ''; }; } },
      { sel: '.expertise-strip span:first-child', why: 'Duplicated word in the strip.', apply: swapText('Small details.', 'Small small details.') },
      { sel: 'footer > span:first-child', why: 'Typo in the footer.', apply: swapText('Quality', 'Qualtiy') }
    ];
    let live = [];
    const banner = document.createElement('div'); banner.className = 'chaos-banner'; banner.hidden = true; banner.setAttribute('role', 'status'); document.body.append(banner);
    const paint = () => { banner.hidden = !live.length; banner.textContent = 'Chaos mode · ' + live.length + ' injected defect' + (live.length === 1 ? '' : 's') + ' left. Click one to file it.'; document.documentElement.classList.toggle('chaos-on', live.length > 0); };
    const stop = () => { live.forEach(x => { x.undo(); x.el.removeAttribute('data-chaos'); }); live = []; paint(); };
    toggle.addEventListener('change', () => {
      if (!toggle.checked) { stop(); return; }
      const need = games.chaos.total - games.chaos.n;
      if (need <= 0) { toggle.checked = false; tip('Chaos is already cleared. Reset games to play it again.', 3600); return; }
      for (const m of shuffle(pool)) { if (live.length >= need) break; const el = document.querySelector(m.sel); if (!el || el.offsetParent === null) continue; live.push({ el, why: m.why, undo: m.apply(el) }); el.setAttribute('data-chaos', ''); }
      paint(); tip(live.length + ' defects injected into the page. Go find them.', 3600);
    });
    document.addEventListener('click', e => {
      if (!live.length) return; const el = e.target.closest('[data-chaos]'); if (!el) return;
      e.preventDefault(); e.stopPropagation();
      const i = live.findIndex(x => x.el === el); if (i < 0) return;
      const x = live.splice(i, 1)[0]; x.undo(); el.removeAttribute('data-chaos'); flash(el); paint();
      score('chaos'); if (!live.length) toggle.checked = false;
      document.getElementById('questLive').textContent = 'Filed: ' + x.why;
    }, true);
  })();
})();
