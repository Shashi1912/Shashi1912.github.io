/* Builds the print-ready resume from config/site-config.js (window.SITE). Text is escaped; config is data, not HTML. */
(() => {
  const S = window.SITE; if (!S) return;
  /* {years} in any config text becomes the `years` setting, so the number is typed in one place. */
  (function expand(o) { for (const k in o) { const v = o[k]; if (typeof v === 'string') o[k] = v.replace(/\{years\}/g, S.years ?? ''); else if (v && typeof v === 'object') expand(v); } })(S);
  const R = S.resumePage || {};
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const short = u => String(u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const sec = (title, body) => body ? '<section><h2>' + title + '</h2>' + body + '</section>' : '';
  const list = a => a && a.length ? '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
  const contact = [S.location && esc(S.location), S.email && '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>', S.phone && esc(S.phone),
    S.linkedin && '<a href="' + esc(S.linkedin) + '">' + esc(short(S.linkedin)) + '</a>', S.github && '<a href="' + esc(S.github) + '">' + esc(short(S.github)) + '</a>'].filter(Boolean).join(' · ');
  const projects = (S.projects || []).map(p => '<div class="item"><h3>' + esc(p.title) + ' <span>' + esc(p.kind || '') + '</span></h3><p>' + esc(p.text) + '</p><p class="stack">' + esc((p.tags || []).join(' · ')) + '</p></div>').join('');
  document.getElementById('sheet').innerHTML =
    '<header><h1>' + esc(S.name) + '</h1><p class="role">' + esc(S.role) + '</p><p class="contact">' + contact + '</p></header>' +
    sec('Summary', R.summary ? '<p>' + esc(R.summary) + '</p>' : '') +
    sec('Skills', (R.skillGroups || []).length ? '<dl class="skills">' + R.skillGroups.map(g => '<dt>' + esc(g.label) + '</dt><dd>' + esc(g.items) + '</dd>').join('') + '</dl>' : '') +
    sec('Experience', (R.experience || []).map(x => '<div class="item"><h3>' + esc(x.role) + ' · ' + esc(x.company) + ' <span>' + esc(x.when) + '</span></h3>' + list([...(x.results || []).filter(Boolean).map(r => '\u0001' + r), ...(x.highlights || [])]).replace(/<li>\u0001/g, '<li class="result">') + '</div>').join('')) +
    sec('Projects', projects) +
    sec('Awards', list(R.awards)) + sec('Certifications', list(R.certifications)) +
    sec('Education', (R.education || []).map(x => '<div class="item"><h3>' + esc(x.title) + ' <span>' + esc(x.when) + '</span></h3><p>' + esc(x.where) + '</p></div>').join(''));
  document.title = 'Resume · ' + S.name;
  document.getElementById('printBtn').addEventListener('click', () => print());
})();
