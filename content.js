/* Renders the content sections from config/site-config.js (window.SITE). Runs before main.js so its observers,
   word-splitting and bug placement see the final markup. Text is always escaped; config is data, not HTML. */
(() => {
  const S = window.SITE || {};
  /* {years} in any config text becomes the `years` setting, so the number is typed in one place. */
  (function expand(o) { for (const k in o) { const v = o[k]; if (typeof v === 'string') o[k] = v.replace(/\{years\}/g, S.years ?? ''); else if (v && typeof v === 'object') expand(v); } })(S);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const host = id => document.getElementById(id);
  const ART = {"chat": "<svg viewBox=\"0 0 120 70\"><rect x=\"18\" y=\"12\" width=\"60\" height=\"34\" rx=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M34 46 30 58 46 46\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/><circle class=\"dot\" cx=\"38\" cy=\"29\" r=\"3.2\"/><circle class=\"dot\" cx=\"48\" cy=\"29\" r=\"3.2\" style=\"animation-delay:.2s\"/><circle class=\"dot\" cx=\"58\" cy=\"29\" r=\"3.2\" style=\"animation-delay:.4s\"/><g transform=\"translate(94 42)\"><ellipse rx=\"9\" ry=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M-4 -6 -7 -12M4 -6 7 -12M-9 2 -14 4M9 2 14 4M-8 -2 -13 -4M8 -2 13 -4M0 -7 0 7\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/></g></svg>", "radar": "<svg viewBox=\"0 0 120 70\"><circle cx=\"60\" cy=\"35\" r=\"26\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><circle cx=\"60\" cy=\"35\" r=\"15\" fill=\"none\" stroke=\"currentColor\" opacity=\".4\" stroke-width=\"1.5\"/><path d=\"M60 9V61M34 35H86\" stroke=\"currentColor\" opacity=\".3\" stroke-width=\"1.5\"/><g class=\"sweep\"><path d=\"M60 35 60 10\" stroke=\"#2fa96b\" stroke-width=\"3\" stroke-linecap=\"round\"/></g><circle class=\"blip\" cx=\"72\" cy=\"26\" r=\"3\" fill=\"#4fe39a\"/></svg>", "gauge": "<svg viewBox=\"0 0 120 70\"><path d=\"M26 56A38 38 0 0 1 94 56\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M30 52A33 33 0 0 1 56 24\" stroke=\"#2fa96b\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M28 44l6 3M44 27l4 6M60 20v7M76 27l-4 6M92 44l-6 3\" stroke=\"currentColor\" stroke-width=\"2\" opacity=\".5\" fill=\"none\"/><g class=\"needle\"><path d=\"M60 56 38 34\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/></g><circle cx=\"60\" cy=\"56\" r=\"4\" fill=\"currentColor\"/></svg>", "vr": "<svg viewBox=\"0 0 120 70\"><rect x=\"28\" y=\"20\" width=\"64\" height=\"30\" rx=\"12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M52 50q8 8 16 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><circle class=\"lens\" cx=\"46\" cy=\"35\" r=\"6\"/><circle class=\"lens\" cx=\"74\" cy=\"35\" r=\"6\" style=\"animation-delay:.6s\"/><path d=\"M28 32H18M92 32h10\" stroke=\"currentColor\" stroke-width=\"2.5\"/></svg>", "sheet": "<svg viewBox=\"0 0 120 70\"><rect x=\"16\" y=\"14\" width=\"52\" height=\"42\" rx=\"4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M16 26h52M33 14v42\" stroke=\"currentColor\" stroke-width=\"1.6\" opacity=\".5\"/><rect class=\"row\" x=\"37\" y=\"31\" width=\"27\" height=\"5\" rx=\"2\"/><rect class=\"row\" x=\"37\" y=\"40\" width=\"21\" height=\"5\" rx=\"2\" style=\"animation-delay:.5s\"/><rect class=\"row\" x=\"37\" y=\"49\" width=\"24\" height=\"5\" rx=\"2\" style=\"animation-delay:1s\"/><path d=\"M72 35h12m0 0-4-3m4 3-4 3\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><rect x=\"90\" y=\"26\" width=\"20\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M90 28l10 8 10-8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>", "plane": "<svg viewBox=\"0 0 120 70\"><path d=\"M18 50C40 20 80 20 102 44\" fill=\"none\" stroke=\"currentColor\" stroke-dasharray=\"4 6\" stroke-width=\"1.8\" opacity=\".5\"/><g class=\"plane\"><path d=\"M0 0 16 6 2 10 4 5Z\" fill=\"#2fa96b\" stroke=\"currentColor\" stroke-width=\"1.4\"/></g></svg>", "generic": "<svg viewBox=\"0 0 120 70\"><rect x=\"30\" y=\"14\" width=\"60\" height=\"42\" rx=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M30 26h60\" stroke=\"currentColor\" stroke-width=\"1.6\" opacity=\".5\"/><circle class=\"dot\" cx=\"44\" cy=\"40\" r=\"3.2\"/><circle class=\"dot\" cx=\"60\" cy=\"40\" r=\"3.2\" style=\"animation-delay:.2s\"/><circle class=\"dot\" cx=\"76\" cy=\"40\" r=\"3.2\" style=\"animation-delay:.4s\"/></svg>"};
  const CONSOLE = "<div class=\"console\" aria-hidden=\"true\"><i class=\"cdot\"></i><i class=\"cdot\"></i><i class=\"cdot\"></i>\n<ol>\n<li style=\"--i:0\"><b>PERCEIVE</b><span>walk the UIA tree · OCR overlay</span></li>\n<li style=\"--i:1\"><b>ORIENT</b><span>rank candidates by novelty</span></li>\n<li style=\"--i:2\"><b>DECIDE</b><span>rules → cache → local model</span></li>\n<li style=\"--i:3\"><b>ACT</b><span>one SendInput action</span></li>\n<li style=\"--i:4\"><b>VERIFY</b><span>falsifiable post-condition</span></li>\n<li style=\"--i:5\"><b>REMEMBER</b><span>state graph +1 edge</span></li>\n</ol>\n<p class=\"turnline\">turn 47 · clicked “Save” → dialog appeared → verified ✓<span class=\"caret\"></span></p>\n</div>";
  const tags = list => '<div class="tags">' + (list || []).map(t => '<span>' + esc(t) + '</span>').join('') + '</div>';
  const repoUrl = repo => (S.github || '').replace(/\/+$/, '') + '/' + repo;

  if (host('availability')) { host('availability').textContent = S.availability || ''; host('availability').hidden = !S.availability; }
  if (S.role) document.querySelectorAll('[data-cfg-text="role"]').forEach(el => { el.textContent = S.role; });
  if (S.heroFacts && host('heroFacts')) host('heroFacts').innerHTML = S.heroFacts.map(f => '<li>' + esc(f) + '</li>').join('');
  if (S.about && host('aboutCopy')) {
    host('aboutCopy').innerHTML = (S.about.paragraphs || []).map(p => '<p>' + esc(p) + '</p>').join('') + tags(S.about.skills);
  }
  if (S.stats && host('statsHost')) {
    host('statsHost').innerHTML = S.stats.map(s => '<div class="stat"><b data-n="' + esc(s.n) + '"' + (s.suffix ? ' data-s="' + esc(s.suffix) + '"' : '') + '>0</b><small>' + esc(s.label) + '</small></div>').join('');
  }
  if (S.career && host('careerHost')) {
    host('careerHost').innerHTML = S.career.map((c, i) => '<div class="node" data-reveal style="--d:' + ((i + 1) / 10) + 's">' + (i === S.career.length - 1 ? '<span class="perch" aria-hidden="true"></span>' : '') + '<time>' + esc(c.when) + '</time><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p></div>').join('');
  }
  if (S.projects && host('projectsHost')) {
    const storyBtn = i => S.projects[i].story ? '<button class="storybtn" data-story="' + i + '">Read the story <span aria-hidden="true">→</span></button>' : '';
    const repoLink = p => p.repo ? '<a class="more" href="' + esc(repoUrl(p.repo)) + '" rel="noopener">View on GitHub ↗</a>' : '';
    const fi = S.projects.findIndex(p => p.featured);
    let html = '';
    if (fi >= 0) {
      const p = S.projects[fi];
      html += '<article class="proj feat" data-reveal><div class="feat-copy"><small class="kind">' + esc(p.kind) + '</small><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p>' + (p.result ? '<p class="proj-result">' + esc(p.result) + '</p>' : '') + '<p class="proj-actions">' + storyBtn(fi) + '<button class="storybtn replaybtn" id="openReplay">Watch a real run <span aria-hidden="true">▷</span></button>' + repoLink(p) + '</p>' + tags(p.tags) + '</div>' + CONSOLE + '</article>';
    }
    let d = 0;
    html += '<div class="projgrid">' + S.projects.map((p, i) => i === fi ? '' :
      '<article class="proj" data-reveal style="--d:' + ((d++) / 10) + 's">' + (ART[p.art] ? '<div class="pic" aria-hidden="true">' + ART[p.art] + '</div>' : '<div class="pic" aria-hidden="true">' + ART.generic + '</div>') +
      '<small class="kind">' + esc(p.kind) + '</small><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p>' + (p.result ? '<p class="proj-result">' + esc(p.result) + '</p>' : '') +
      ((p.repo || p.story) ? '<p class="proj-actions">' + storyBtn(i) + repoLink(p) + '</p>' : '') + tags(p.tags) + '</article>').join('') + '</div>';
    host('projectsHost').innerHTML = html;
  }
  if (S.investigations && host('investigationsHost')) {
    host('investigationsHost').innerHTML = S.investigations.map((v, i) => '<details' + (i === 0 ? ' open' : '') + '><summary>' + String(i + 1).padStart(2, '0') + ' &nbsp; ' + esc(v.title) + '</summary>' +
      (v.parts || []).map(p => '<p>' + (p[0] ? '<b>' + esc(p[0]) + '</b> · ' : '') + esc(p[1]) + '</p>').join('') + '</details>').join('');
  }
  if (S.bugReports && host('bugReportsHost')) {
    /* Collapsed by default: the heading and one button; the reports open on demand. */
    const n = S.bugReports.length;
    host('bugReportsHost').innerHTML = '<div class="bugrep-head"><div><h3 class="subhead">Sample bug reports</h3><p class="subnote">' + n + ' reports in the format I file them. The first one is live: you can reproduce it in the QA Lab on this page.</p></div>' +
      '<button type="button" class="bugrep-toggle" id="bugrepToggle" aria-expanded="false" aria-controls="bugrepGrid"><span class="bt-label">Show the ' + n + ' reports</span> <span class="bt-arrow" aria-hidden="true">▾</span></button></div>' +
      '<div class="bugrep-grid" id="bugrepGrid" hidden>' +
      S.bugReports.map(b => '<article class="bugrep"><header><span class="bid">' + esc(b.id) + '</span><span class="sev sev-' + esc(String(b.severity).toLowerCase()) + '">' + esc(b.severity) + '</span></header><h4>' + esc(b.title) + '</h4><p class="barea">' + esc(b.area) + '</p>' +
        '<dl><dt>Steps to reproduce</dt><dd><ol>' + (b.steps || []).map(s => '<li>' + esc(s) + '</li>').join('') + '</ol></dd><dt>Expected</dt><dd>' + esc(b.expected) + '</dd><dt>Actual</dt><dd>' + esc(b.actual) + '</dd><dt>Evidence</dt><dd>' + esc(b.evidence) + '</dd><dt>Status</dt><dd>' + esc(b.status) + '</dd></dl>' +
        (b.live ? '<a class="more" href="#lab">Reproduce it in the QA Lab ↓</a>' : '') + '</article>').join('') + '</div>';
    const tg = host('bugrepToggle'), grid = host('bugrepGrid');
    tg.addEventListener('click', () => { const open = grid.hidden; grid.hidden = !open; tg.setAttribute('aria-expanded', open); tg.querySelector('.bt-label').textContent = open ? 'Hide the reports' : 'Show the ' + n + ' reports'; });
  }

  /* Case study dialog: one <dialog>, filled per project. The dialog sits later in the page than this script, so it is looked up on click. */
  document.addEventListener('click', e => {
    const dlg = host('storyDialog'); if (!dlg || !S.projects) return;
    if (e.target === dlg || e.target.closest('#storyDialog .dlg-close')) { dlg.close(); return; }
    const b = e.target.closest('[data-story]'); if (!b) return;
    const p = S.projects[+b.dataset.story]; if (!p || !p.story) return;
    dlg.querySelector('.story-kind').textContent = p.kind || '';
    dlg.querySelector('h3').textContent = p.title;
    dlg.querySelector('.story-body').innerHTML = [['The challenge', p.story.challenge], ['The approach', p.story.approach], ['The outcome', p.story.outcome], ['Measured result', p.result]]
      .filter(r => r[1]).map(r => '<section><h4>' + r[0] + '</h4><p>' + esc(r[1]) + '</p></section>').join('') + tags(p.tags);
    dlg.showModal();
  });
})();
