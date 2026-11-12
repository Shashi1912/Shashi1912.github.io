/* AI desk: Ask, Test cases, Bug report, Job fit. Uses the browser's built-in on-device model (Prompt API,
   `LanguageModel`) when it exists; otherwise the same tools run on the rule engines below. Nothing typed here
   leaves the page either way. Model output and visitor input are always rendered as text, never as HTML. */
(() => {
  const host = document.getElementById('aiHost'); if (!host) return;
  const S = window.SITE || {}, R = S.resumePage || {};
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---- Profile facts: the only knowledge either engine may use ---- */
  const facts = [];
  const add = (topic, text) => { if (text) facts.push({ topic, text: String(text) }); };
  add('identity', (S.name || '') + ' is a ' + (S.role || 'Software Test Engineer') + ' based in ' + (S.location || 'India') + '.');
  add('summary', R.summary);
  (S.about?.paragraphs || []).forEach(p => add('about', p));
  (R.skillGroups || []).forEach(g => add('skills', g.label + ': ' + g.items + '.'));
  (R.experience || []).forEach(x => { add('experience', x.role + ' at ' + x.company + ' (' + x.when + ').'); (x.highlights || []).forEach(h => add('experience', h)); });
  (S.projects || []).forEach(p => add('project', p.title + '. ' + p.text + ' Technologies: ' + (p.tags || []).join(', ') + '.'));
  (R.education || []).forEach(x => add('education', x.title + ', ' + x.where + ' (' + x.when + ').'));
  (R.certifications || []).forEach(x => add('certification', 'Certification: ' + x + '.'));
  (R.awards || []).forEach(x => add('award', 'Award: ' + x + '.'));
  add('contact', 'Contact: email ' + (S.email || 'not listed') + (S.linkedin ? ', LinkedIn ' + S.linkedin : '') + (S.github ? ', GitHub ' + S.github : '') + '.');
  const profileText = facts.map(f => f.text).join('\n'), profileLow = profileText.toLowerCase();

  /* ---- On-device model wrapper ---- */
  const LM = self.LanguageModel;
  let aiState = 'unavailable', useAI = false;
  async function detect() { if (!LM || !LM.availability) return 'unavailable'; try { return await LM.availability(); } catch { return 'unavailable'; } }
  async function askModel(system, user, onStatus) {
    const session = await LM.create({ initialPrompts: [{ role: 'system', content: system }], monitor(m) { m.addEventListener('downloadprogress', e => onStatus && onStatus('Your browser is downloading its on-device model… ' + Math.round((e.loaded || 0) * 100) + '%')); } });
    try { return String(await session.prompt(user)).trim(); } finally { try { session.destroy(); } catch {} }
  }
  const firstJson = (text, open, close) => { const a = text.indexOf(open), b = text.lastIndexOf(close); if (a < 0 || b <= a) throw new Error('no json'); return JSON.parse(text.slice(a, b + 1)); };

  /* ---- Rule engines (the offline fallback, and the default where there is no model) ---- */
  const STOP = new Set('a an the is are was were be been do does did has have had he she his her him they it its of in on at to for with and or but not any what which who whom how when where why can could would should will shall may this that these those there about from by as you your i me my we our tell give show list know work works worked working use uses used using shashi shashikumar angajala'.split(' '));
  const SYN = { vr: ['vr', 'virtual', 'immersive'], contact: ['email', 'linkedin', 'github', 'contact'], reach: ['email', 'contact'], hire: ['contact', 'email'], tools: ['selenium', 'testng', 'maven', 'jira', 'tfs'], languages: ['java', 'sql', 'python', 'javascript', 'programming'], automate: ['automation', 'selenium', 'framework'], automation: ['automation', 'selenium', 'framework', 'hybrid'], years: ['years', 'experience'], experience: ['experience', 'years'], studied: ['b.tech', 'education'], degree: ['b.tech'], college: ['institute', 'b.tech'], certificate: ['certification'], certified: ['certification'], certifications: ['certification'], awards: ['award'], ai: ['ai', 'llm', 'llms', 'ollama', 'prompt'], api: ['api', 'apis', 'postman', 'rest'], company: ['zen', 'technologies'], installer: ['installshield', 'msi', 'installers'], located: ['based', 'hyderabad'], location: ['based', 'hyderabad'], live: ['based', 'hyderabad'] };
  const words = t => (t.toLowerCase().match(/[a-z0-9.#+]+/g) || []).map(w => w.replace(/\.$/, ''));
  function askRules(q) {
    const terms = new Set(); words(q).forEach(w => { if (STOP.has(w) || w.length < 2) return; terms.add(w); (SYN[w] || []).forEach(s => terms.add(s)); if (w.endsWith('s')) terms.add(w.slice(0, -1)); });
    if (!terms.size) return { text: 'Ask about skills, projects, experience, awards, certifications, education or how to get in touch.', found: false };
    const scored = facts.map(f => { const fw = new Set(words(f.text)); let n = 0; terms.forEach(t => { if (fw.has(t) || (t.length > 3 && f.text.toLowerCase().includes(t))) n++; }); if (terms.has(f.topic)) n += 1.5; return { f, n }; }).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 3);
    if (!scored.length) return { text: 'That is not in the profile I have. Try asking about skills, projects, experience, awards, certifications, education or contact details.', found: false };
    return { text: scored.map(x => x.f.text).join('\n\n'), found: true };
  }

  const CASE_LIB = [
    { when: /log ?in|sign ?in|password|otp|auth/, cases: [['Valid credentials sign the user in', 'Enter a registered user and the correct password; submit.', 'The user lands on the home screen and a session starts.', 'Positive'], ['Wrong password is rejected without revealing which field is wrong', 'Enter a registered user and a wrong password; submit.', 'A generic error is shown; no session starts.', 'Negative'], ['Account locks or throttles after repeated failures', 'Submit a wrong password 5 or more times in a row.', 'Further attempts are throttled or the account is locked, with a clear message.', 'Security'], ['Password field never shows or logs the value', 'Type a password; inspect the field, page source and network request.', 'The value is masked on screen and not written to logs or the URL.', 'Security']] },
    { when: /otp|verification code|2fa|two.factor/, cases: [['Expired code is rejected', 'Request a code, wait past its validity period, then submit it.', 'The code is rejected and a new one can be requested.', 'Negative'], ['A code cannot be used twice', 'Sign in with a valid code, sign out, and submit the same code again.', 'The second use is rejected.', 'Security']] },
    { when: /search|filter|find/, cases: [['A known term returns matching results', 'Search for a term that exists.', 'Matching results are listed, most relevant first.', 'Positive'], ['No results shows a helpful empty state', 'Search for a term that matches nothing.', 'An empty state explains there are no results; no error.', 'Negative'], ['Special characters do not break the search', 'Search for % _ \' " < > and an emoji.', 'The input is treated as text; no error and no script runs.', 'Security']] },
    { when: /upload|attach|file|image|photo|document/, cases: [['A supported file uploads', 'Choose a file of an allowed type within the size limit.', 'The file uploads and is shown with its name and size.', 'Positive'], ['An unsupported type is rejected', 'Choose a file with a disallowed extension.', 'The file is rejected with a message naming the allowed types.', 'Negative'], ['A file just over the size limit is rejected', 'Choose a file slightly larger than the limit.', 'The upload is refused before or during transfer, with the limit stated.', 'Boundary'], ['A renamed executable is not accepted as an image', 'Rename a .exe to .jpg and upload it.', 'The content is checked, not just the extension; the file is rejected.', 'Security']] },
    { when: /pay|checkout|card|order|cart|price|total/, cases: [['A valid payment completes the order once', 'Complete checkout with valid details.', 'One order is created, one charge is made, a confirmation is shown.', 'Positive'], ['Double-clicking Pay does not charge twice', 'Press the pay button twice quickly.', 'Only one order and one charge exist.', 'Negative'], ['Totals add up after every change', 'Change quantities, apply and remove a discount.', 'Line totals, tax and grand total are recalculated correctly each time.', 'Positive'], ['A declined payment leaves the cart intact', 'Pay with a card that is declined.', 'A clear message is shown; the cart is unchanged; no order is created.', 'Negative']] },
    { when: /sign ?up|register|form|profile|field|input/, cases: [['All valid fields save', 'Fill every field with valid values; submit.', 'The data is saved and shown back exactly as entered.', 'Positive'], ['Required fields left empty are flagged', 'Submit with each required field empty in turn.', 'Each empty required field is flagged next to the field; nothing is saved.', 'Negative'], ['Leading and trailing spaces are handled', 'Enter values padded with spaces.', 'Spaces are trimmed or rejected consistently; no duplicate records.', 'Boundary']] },
    { when: /email|e-mail/, cases: [['Malformed email addresses are rejected', 'Enter "user@", "user@site", "@site.com" and "a b@site.com".', 'Each one is rejected with a format message.', 'Negative']] },
    { when: /date|calendar|schedule|booking|time/, cases: [['Impossible and edge dates are handled', 'Enter 31 Feb, 29 Feb in a non-leap year, and a date in the past.', 'Invalid dates are rejected; past dates follow the stated rule.', 'Boundary'], ['Time zones do not shift the saved date', 'Save a date near midnight, then view it from another time zone.', 'The date shown matches what was entered.', 'Negative']] },
    { when: /list|table|page|pagination|scroll|export|report/, cases: [['Zero, one and many rows display correctly', 'Open the list with 0, 1 and more rows than one page holds.', 'Empty state, single row and pagination all render correctly.', 'Boundary'], ['Exported data matches the screen', 'Export the list and compare row count and totals with the screen.', 'Counts and totals are identical.', 'Positive']] }
  ];
  function casesRules(text) {
    const low = text.toLowerCase(), out = [], seen = new Set();
    const push = c => { if (!seen.has(c[0])) { seen.add(c[0]); out.push({ title: c[0], steps: c[1], expected: c[2], type: c[3] }); } };
    const ranges = [...low.matchAll(/(\d+)\s*(?:to|-|–|and)\s*(\d+)/g)].slice(0, 2);
    ranges.forEach(m => { const lo = +m[1], hi = +m[2]; if (hi <= lo) return;
      [[lo - 1, false], [lo, true], [hi, true], [hi + 1, false]].forEach(([v, ok]) => push(['Value ' + v + ' is ' + (ok ? 'accepted' : 'rejected') + ' (range ' + lo + ' to ' + hi + ')', 'Enter ' + v + ' and submit.', ok ? v + ' is accepted.' : v + ' is rejected with a message stating the allowed range.', 'Boundary']));
      push(['A decimal or text value is rejected (range ' + lo + ' to ' + hi + ')', 'Enter ' + (lo + 0.5) + ', then "abc", and submit each.', 'Both are rejected; nothing is saved.', 'Negative']); });
    const len = low.match(/(?:max(?:imum)?|up to|limit(?:ed)? to)\s*(\d+)\s*(?:char|letter|digit)/);
    if (len) { const n = +len[1]; push(['Exactly ' + n + ' characters is accepted', 'Enter ' + n + ' characters and submit.', 'The value is accepted and saved in full.', 'Boundary']); push([(n + 1) + ' characters is rejected or stopped', 'Try to enter ' + (n + 1) + ' characters.', 'Input stops at ' + n + ' or an error states the limit; nothing is silently cut.', 'Boundary']); }
    CASE_LIB.forEach(g => { if (g.when.test(low)) g.cases.forEach(push); });
    if (out.length < 3) [['The main path works end to end', 'Follow the feature as a typical user would, with valid data.', 'The feature completes and the result is shown correctly.', 'Positive'], ['Invalid input is rejected with a clear message', 'Repeat with empty, too-long and wrongly formatted input.', 'Nothing is saved; each problem is explained next to its field.', 'Negative']].forEach(push);
    [['Repeating the action does not duplicate the result', 'Submit twice quickly, then refresh and use the back button.', 'The action happens once; no duplicate record or message.', 'Negative'], ['The feature works by keyboard alone', 'Complete the flow using only Tab, Shift+Tab, Enter and Space.', 'Every control is reachable, focus is visible, and the flow completes.', 'Usability'], ['A lost connection is handled', 'Disconnect the network mid-action, then reconnect.', 'A clear message appears; no data is lost or half-saved.', 'Negative']].forEach(push);
    return out.slice(0, 12);
  }

  const sentences = t => t.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+|\s*[;\n]\s*|\s+(?:and then|then)\s+/i).map(s => s.trim().replace(/[.!?]+$/, '')).filter(Boolean);
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  function bugRules(text) {
    const ss = sentences(text), low = text.toLowerCase();
    const ACT = /\b(click|clicked|press|pressed|tap|tapped|open|opened|go to|went|enter|entered|type|typed|select|selected|choose|chose|log ?in|logged|sign|save|saved|upload|uploaded|scroll|submit|submitted|search|searched|add|added|delete|deleted|install|launch|start|started|when i|after i|if i)\b/i;
    const BAD = /\b(crash|crashes|crashed|error|fail|fails|failed|not|doesn'?t|didn'?t|won'?t|can'?t|cannot|stuck|wrong|slow|blank|freez|froze|hang|missing|gone|lost|broken|empty|nothing)\b/i;
    const steps = ss.filter(s => ACT.test(s)).map(s => cap(s.replace(/^(when|after|if)\s+i\s+/i, '').replace(/\s*,?\s*(?:it|the app|the page|app)\s+.*$/i, m => BAD.test(m) ? '' : m))).filter(s => s.length > 2);
    const actual = ss.filter(s => BAD.test(s)).map(cap);
    const sev = /crash|data loss|lost|gone|cannot log|can'?t log|security|payment|charged|freez|froze|hang/.test(low) ? 'High' : /error|fail|wrong|broken|not work|doesn'?t|missing|blank/.test(low) ? 'Medium' : 'Low';
    const freq = /sometimes|intermittent|random|occasionally|once in a while|not always/.test(low) ? 'Intermittent' : /always|every time|each time|100%|consistently/.test(low) ? 'Always' : 'Not stated';
    const missing = [];
    if (!/\b(v?\d+\.\d+|version|build|windows|android|ios|chrome|firefox|edge|safari|mac|linux)\b/i.test(text)) missing.push('Environment: app version or build, operating system, browser or device.');
    if (steps.length < 2) missing.push('Exact steps, one action per line, starting from a known screen.');
    if (freq === 'Not stated') missing.push('How often it happens (always, or how many times out of ten).');
    if (!/expect|should|supposed/i.test(text)) missing.push('What the reporter expected to happen instead.');
    missing.push('Evidence: a screenshot or recording, plus logs from the time of the failure.');
    const first = (actual[0] || ss[0] || 'Problem reported').replace(/^(the\s+)?app(lication)?\s+/i, 'App ').slice(0, 90);
    return { title: cap(first), steps: steps.length ? steps : ['(Add the exact steps that lead to the problem.)'], expected: /should|expect|supposed/i.test(text) ? cap(ss.find(s => /should|expect|supposed/i.test(s))) : 'The action completes normally. Confirm the exact expectation with the reporter.', actual: actual.length ? actual.join('. ') + '.' : cap(ss.join('. ')) + '.', severity: sev, frequency: freq, missing };
  }

  const TERMS = ['Selenium', 'Selenium WebDriver', 'TestNG', 'JUnit', 'Maven', 'Gradle', 'Java', 'Python', 'JavaScript', 'TypeScript', 'C#', 'SQL', 'MySQL', 'Postman', 'REST Assured', 'API testing', 'Cypress', 'Playwright', 'Appium', 'Winium', 'Cucumber', 'BDD', 'Jenkins', 'CI/CD', 'Git', 'GitHub', 'SVN', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'JMeter', 'performance testing', 'load testing', 'security testing', 'mobile testing', 'JIRA', 'TFS', 'Agile', 'Scrum', 'ISTQB', 'Page Object Model', 'POM', 'data-driven', 'keyword-driven', 'hybrid framework', 'regression', 'functional', 'integration', 'smoke', 'sanity', 'UAT', 'endurance', 'manual testing', 'automation', 'test cases', 'bug reports', 'Unreal Engine', 'VR', 'InstallShield', 'Apache POI', 'Excel', 'Linux', 'Windows', 'desktop', 'web', 'LLM', 'prompt engineering', 'OCR', 'React', 'Node.js', 'Katalon', 'Robot Framework', 'Tosca', 'SoapUI', 'GraphQL', 'microservices', 'ETL', 'Tableau', 'Salesforce', 'SAP'];
  const has = (hay, term) => new RegExp('(^|[^a-z0-9])' + term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(hay);
  function fitRules(jd) {
    const low = jd.toLowerCase(), asked = TERMS.filter(t => has(low, t));
    const matched = asked.filter(t => has(profileLow, t)), missing = asked.filter(t => !has(profileLow, t));
    const evidence = matched.slice(0, 8).map(t => { const f = facts.find(x => has(x.text.toLowerCase(), t)); return { term: t, where: f ? f.text.slice(0, 140) + (f.text.length > 140 ? '…' : '') : '' }; });
    return { asked, matched, missing, evidence, score: asked.length ? Math.round(matched.length / asked.length * 100) : null };
  }

  /* ---- UI ---- */
  const tools = [
    { id: 'ask', tab: 'Ask about Shashi', label: 'Your question', ph: 'Has he tested VR applications? Which automation tools does he use?', go: 'Ask', sample: 'Which automation tools and frameworks has he used?' },
    { id: 'cases', tab: 'Test cases', label: 'Describe a feature', ph: 'A login form with email, password and a 6-digit OTP. Quantity field accepts 1 to 10.', go: 'Generate test cases', sample: 'Checkout page where order quantity accepts whole numbers from 1 to 10, with a discount code field and card payment.' },
    { id: 'bug', tab: 'Bug report', label: 'Paste a messy complaint', ph: 'app crashes sometimes when i click save after typing a long note, everything is gone', go: 'Write the bug report', sample: 'i opened the app and logged in then when i click save on a long note the app crashes sometimes and my note is gone. really annoying' },
    { id: 'fit', tab: 'Job fit', label: 'Paste a job description', ph: 'We need a QA engineer with Selenium, Java, API testing, Jenkins…', go: 'Check the fit', sample: 'Looking for a QA Automation Engineer with 3+ years in Selenium WebDriver, Java, TestNG and Maven. Experience with API testing using Postman or REST Assured, CI/CD with Jenkins, Git, and Agile delivery. Knowledge of Playwright, Docker and performance testing with JMeter is a plus. ISTQB preferred.' }
  ];
  const mode = el('div', 'ai-mode'); mode.innerHTML = '<span class="ai-dot"></span><span class="ai-mode-text">Checking for an on-device AI model…</span><label class="ai-use" hidden><input type="checkbox" id="aiUse"> Use on-device AI</label>';
  const tabs = el('div', 'ai-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'AI desk tools');
  host.append(mode, tabs);
  const panels = {};
  tools.forEach((t, i) => {
    const b = el('button', 'ai-tab', t.tab); b.type = 'button'; b.id = 'aitab-' + t.id; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'aipanel-' + t.id); b.setAttribute('aria-selected', i === 0); b.tabIndex = i === 0 ? 0 : -1;
    const p = el('div', 'ai-panel'); p.id = 'aipanel-' + t.id; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id); p.hidden = i !== 0;
    const lab = el('label', null, t.label); lab.htmlFor = 'aiin-' + t.id;
    const ta = el('textarea'); ta.id = 'aiin-' + t.id; ta.rows = t.id === 'ask' ? 2 : 4; ta.placeholder = t.ph; ta.maxLength = 4000;
    const row = el('div', 'actions'); const go = el('button', 'ai-go', t.go); go.type = 'button'; const ex = el('button', 'linkbtn', 'Try an example'); ex.type = 'button'; row.append(go, ex);
    const status = el('p', 'ai-status'); status.setAttribute('aria-live', 'polite'); const out = el('div', 'ai-out'); out.id = 'aiout-' + t.id;
    p.append(lab, ta, row, status, out); host.append(p); tabs.append(b); panels[t.id] = { b, p, ta, go, status, out };
    b.addEventListener('click', () => select(t.id));
    ex.addEventListener('click', () => { ta.value = t.sample; run(t.id); });
    go.addEventListener('click', () => run(t.id));
    if (t.id === 'ask') ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run('ask'); } });
  });
  function select(id) { tools.forEach(t => { const x = panels[t.id], on = t.id === id; x.p.hidden = !on; x.b.setAttribute('aria-selected', on); x.b.tabIndex = on ? 0 : -1; }); }
  tabs.addEventListener('keydown', e => { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; const ids = tools.map(t => t.id), cur = ids.findIndex(i => panels[i].b.getAttribute('aria-selected') === 'true'), next = ids[(cur + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length]; select(next); panels[next].b.focus(); });

  const by = (out, engine) => { const n = el('p', 'ai-by', engine === 'ai' ? 'Answered by your browser\'s on-device AI model. Check it against the page before relying on it.' : 'Answered by built-in rules on this page (no AI model was used).'); out.append(n); };
  const copyBtn = (out, getText) => { const b = el('button', 'linkbtn', 'Copy as text'); b.type = 'button'; b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(getText()); b.textContent = 'Copied ✓'; } catch { b.textContent = 'Copy not available'; } setTimeout(() => { b.textContent = 'Copy as text'; }, 1800); }); out.append(b); };

  function showAsk(out, text, engine) { out.replaceChildren(); text.split(/\n{2,}/).forEach(par => out.append(el('p', 'ai-answer', par))); by(out, engine); }
  function showCases(out, cases, engine) {
    out.replaceChildren(); const tb = el('table', 'ai-table'); tb.innerHTML = '<thead><tr><th>ID</th><th>Test case</th><th>Steps</th><th>Expected result</th><th>Type</th></tr></thead>'; const body = el('tbody');
    cases.forEach((c, i) => { const tr = el('tr'); [('TC-' + String(i + 1).padStart(2, '0')), c.title, c.steps, c.expected, c.type].forEach((v, k) => { const td = el('td', k === 4 ? 'tc-type t-' + String(v || '').toLowerCase() : null, v == null ? '' : String(v)); tr.append(td); }); body.append(tr); });
    tb.append(body); const wrap = el('div', 'ai-scroll'); wrap.append(tb); out.append(wrap);
    copyBtn(out, () => cases.map((c, i) => 'TC-' + String(i + 1).padStart(2, '0') + ' [' + c.type + '] ' + c.title + '\n  Steps: ' + c.steps + '\n  Expected: ' + c.expected).join('\n\n')); by(out, engine);
  }
  function showBug(out, r, engine) {
    out.replaceChildren(); const card = el('article', 'bugrep ai-bug'); const head = el('header'); head.append(el('span', 'bid', 'DRAFT'), el('span', 'sev sev-' + String(r.severity || 'medium').toLowerCase(), r.severity || 'Medium')); card.append(head, el('h4', null, r.title));
    const dl = el('dl'); const rowOf = (k, v) => { dl.append(el('dt', null, k)); const dd = el('dd'); if (Array.isArray(v)) { const ol = el(k === 'Still needed' ? 'ul' : 'ol'); v.forEach(s => ol.append(el('li', null, String(s)))); dd.append(ol); } else dd.textContent = v == null ? '' : String(v); dl.append(dd); };
    rowOf('Steps to reproduce', r.steps || []); rowOf('Expected', r.expected); rowOf('Actual', r.actual); rowOf('Frequency', r.frequency); rowOf('Still needed', r.missing || []);
    card.append(dl); out.append(card);
    copyBtn(out, () => 'Title: ' + r.title + '\nSeverity: ' + r.severity + '\nFrequency: ' + r.frequency + '\n\nSteps to reproduce:\n' + (r.steps || []).map((s, i) => (i + 1) + '. ' + s).join('\n') + '\n\nExpected: ' + r.expected + '\nActual: ' + r.actual + '\n\nStill needed:\n' + (r.missing || []).map(s => '- ' + s).join('\n')); by(out, engine);
  }
  function showFit(out, f, summary, engine) {
    out.replaceChildren();
    if (!f.asked.length) { out.append(el('p', 'ai-answer', 'I could not find any skills or tools I recognise in that text. Paste the requirements part of the job description.')); return; }
    const top = el('div', 'fit-top'); top.append(el('b', 'fit-score', f.score + '%'), el('span', null, f.matched.length + ' of ' + f.asked.length + ' requested skills appear in the profile')); out.append(top);
    const chips = (title, list, cls) => { if (!list.length) return; out.append(el('h4', 'fit-h', title)); const d = el('div', 'tags ' + cls); list.forEach(t => d.append(el('span', null, t))); out.append(d); };
    chips('In the profile', f.matched, 'fit-yes'); chips('Asked for, not in the profile', f.missing, 'fit-no');
    if (summary) out.append(el('p', 'ai-answer', summary));
    if (f.evidence.length) { out.append(el('h4', 'fit-h', 'Where it shows up')); const ul = el('ul', 'fit-ev'); f.evidence.forEach(e => { const li = el('li'); li.append(el('b', null, e.term + ': '), document.createTextNode(e.where)); ul.append(li); }); out.append(ul); }
    out.append(el('p', 'ai-by', 'The match is a word-for-word check of the job text against the profile on this page. It does not judge depth of experience.' + (engine === 'ai' ? ' The summary sentence was written by your browser\'s on-device AI model.' : '')));
  }

  const SYS = {
    ask: 'You answer questions about a software tester for visitors to his portfolio. Use ONLY the facts below. If the answer is not in the facts, say plainly that the profile does not say. Never invent employers, dates, tools or numbers. Answer in at most four short sentences, in the third person.\n\nFACTS:\n' + profileText,
    cases: 'You are a senior QA engineer. For the feature the user describes, write 8 to 10 test cases covering positive, negative, boundary, security and usability. Reply with ONLY a JSON array; each item has the string fields "title", "steps", "expected" and "type" (one of Positive, Negative, Boundary, Security, Usability). No text outside the JSON.',
    bug: 'You are a senior QA engineer. Turn the user\'s complaint into a bug report. Use only what the complaint says; do not invent versions, devices or steps. Reply with ONLY a JSON object with the fields "title" (string), "steps" (array of strings), "expected" (string), "actual" (string), "severity" (High, Medium or Low), "frequency" (Always, Intermittent or Not stated) and "missing" (array of strings naming information still needed). No text outside the JSON.',
    fit: 'You compare a job description with a candidate. You are given two lists already computed by code. Write two or three plain sentences summarising the fit using ONLY those lists. Do not add skills to either list and do not judge depth of experience.'
  };
  async function run(id) {
    const x = panels[id], text = x.ta.value.trim();
    if (!text) { x.status.textContent = 'Type something first.'; x.ta.focus(); return; }
    x.go.disabled = true; x.status.textContent = useAI ? 'Thinking on your device…' : '';
    const say = t => { x.status.textContent = t; };
    try {
      if (id === 'ask') { let ans = null; if (useAI) try { ans = await askModel(SYS.ask, text, say); } catch { ans = null; } if (ans) showAsk(x.out, ans, 'ai'); else showAsk(x.out, askRules(text).text, 'rules'); }
      else if (id === 'cases') { let cs = null; if (useAI) try { const arr = firstJson(await askModel(SYS.cases, text, say), '[', ']'); if (Array.isArray(arr) && arr.length) cs = arr.slice(0, 12).map(c => ({ title: String(c.title || ''), steps: String(c.steps || ''), expected: String(c.expected || ''), type: String(c.type || 'Positive') })); } catch { cs = null; } showCases(x.out, cs || casesRules(text), cs ? 'ai' : 'rules'); }
      else if (id === 'bug') { let r = null; if (useAI) try { const o = firstJson(await askModel(SYS.bug, text, say), '{', '}'); if (o && o.title) r = { title: String(o.title), steps: [].concat(o.steps || []).map(String), expected: String(o.expected || ''), actual: String(o.actual || ''), severity: ['High', 'Medium', 'Low'].includes(o.severity) ? o.severity : 'Medium', frequency: String(o.frequency || 'Not stated'), missing: [].concat(o.missing || []).map(String) }; } catch { r = null; } showBug(x.out, r || bugRules(text), r ? 'ai' : 'rules'); }
      else { const f = fitRules(text); let sum = null; if (useAI && f.asked.length) try { sum = await askModel(SYS.fit, 'Skills the job asks for that ARE in the candidate profile: ' + (f.matched.join(', ') || 'none') + '.\nSkills the job asks for that are NOT in the profile: ' + (f.missing.join(', ') || 'none') + '.', say); } catch { sum = null; } showFit(x.out, f, sum, sum ? 'ai' : 'rules'); }
      x.status.textContent = '';
    } finally { x.go.disabled = false; }
  }
  window.SK_AI = { askRules, casesRules, bugRules, fitRules, run };

  /* ---- Model detection: decides the mode line and upgrades the Defect interview to free-text questions ---- */
  detect().then(state => {
    aiState = state; const txt = mode.querySelector('.ai-mode-text'), use = mode.querySelector('.ai-use'), box = mode.querySelector('#aiUse');
    if (state === 'unavailable') { mode.classList.add('rules'); txt.textContent = 'Built-in rules mode. This browser has no on-device AI model, so the tools run on rules written into this page.'; return; }
    mode.classList.add('model'); use.hidden = false; useAI = box.checked = state === 'available';
    txt.textContent = state === 'available' ? 'On-device AI is ready. Answers are generated by your browser\'s own model; nothing is sent anywhere.' : 'Your browser offers an on-device AI model. Tick the box and it will download the model once (a browser download, not from this site).';
    box.addEventListener('change', () => { useAI = box.checked; });
    const iv = window.SK_INTERVIEW, qs = document.getElementById('interviewQs');
    if (iv && qs) { const f = el('form', 'arc-free'); const inp = el('input'); inp.type = 'text'; inp.placeholder = 'Or ask your own question…'; inp.setAttribute('aria-label', 'Ask the reporter your own question'); inp.maxLength = 200; const go = el('button', null, 'Ask'); f.append(inp, go); qs.after(f);
      f.addEventListener('submit', async e => { e.preventDefault(); const q = inp.value.trim(); if (!q) return; go.disabled = true; let a;
        try { a = await askModel('You are role-playing a non-technical user who reported this problem: ' + iv.report + '\nHidden facts about what really happens: ' + iv.facts + '\nAnswer the tester\'s question in one or two short sentences, as that user would, using only the hidden facts. Describe what you observed; never state the technical cause yourself. If the facts do not cover the question, say you are not sure.', q); } catch { a = 'Sorry, I am not sure. Try one of the questions above.'; }
        iv.answer(q, a); inp.value = ''; go.disabled = false; }); }
  });
})();
