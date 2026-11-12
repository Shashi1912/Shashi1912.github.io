// The portfolio tests itself: every game is played, every config-driven link is checked.
// Run with `npm test` (serves this folder on 127.0.0.1:8770 and drives it in Chromium).
const { test, expect } = require('@playwright/test');

// The AI desk must behave the same everywhere, so tests run it on the built-in rules (no on-device model).
const noModel = page => page.addInitScript(() => { try { delete self.LanguageModel; } catch {} Object.defineProperty(self, 'LanguageModel', { value: undefined, configurable: true }); });

async function open(page, path = '/') {
  await noModel(page);
  await page.goto(path);
  await skipIntro(page);
}
// Every load plays the ~5s opening; skip it so the page is usable at once (the intro may end on its own first).
async function skipIntro(page) {
  const intro = page.locator('#intro'), skip = page.locator('#skip');
  await expect(async () => {
    if (!/done/.test(await intro.getAttribute('class') || '')) await skip.click({ force: true, timeout: 3000 }).catch(() => {}); // the button animates, so skip the stability wait
    await expect(intro).toHaveClass(/done/, { timeout: 500 });
  }).toPass({ timeout: 15000 });
}
const badge = page => page.locator('#questBadge');
const gameCount = (page, id) => page.evaluate(g => games[g].n, id);

test.describe('page health', () => {
  test('loads with no script errors and no calls to other sites', async ({ page }) => {
    const errors = [], foreign = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:8791') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) foreign.push(r.url()); });
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    await open(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    expect(errors).toEqual([]); expect(foreign).toEqual([]); expect(failed).toEqual([]);
  });

  test('every section renders its content from the config', async ({ page }) => {
    await open(page);
    await expect(page.locator('#aboutCopy p')).toHaveCount(2);
    await expect(page.locator('.stat')).toHaveCount(4);
    await expect(page.locator('.node')).toHaveCount(7);
    await expect(page.locator('.proj')).toHaveCount(7);
    await expect(page.locator('.bugrep')).toHaveCount(3);
    await expect(page.locator('.arc')).toHaveCount(4);
    await expect(page.locator('.ai-tab')).toHaveCount(4);
    await expect(page.locator('.score')).toHaveCount(6);
  });

  test('investigations come from the config and bug reports start collapsed', async ({ page }) => {
    await open(page);
    await expect(page.locator('#work details')).toHaveCount(4);
    await expect(page.locator('#work summary').first()).toContainText('Endurance');
    await expect(page.locator('#work details').first()).toHaveAttribute('open', '');
    await expect(page.locator('#work summary').nth(1)).toContainText('Memory leaks');
    await expect(page.locator('#bugrepGrid')).toBeHidden();
    await page.click('#bugrepToggle');
    await expect(page.locator('#bugrepToggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#bugrepGrid .bugrep').first()).toBeVisible();
    await page.click('#bugrepToggle');
    await expect(page.locator('#bugrepGrid')).toBeHidden();
  });

  test('wing reveal: on by default, sections open fully, and the config switch turns it off', async ({ page }) => {
    await open(page);
    await expect(page.locator('html')).toHaveClass(/wr-on/);
    expect(await page.locator('.wr-panel').count()).toBeGreaterThan(10);
    // a nav jump lands on a fully open section: no wing panel left showing over it
    await page.click('nav a[href="#projects"]', { force: true });
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('#projects > .wr-panel')].every(p => getComputedStyle(p).display === 'none'))).toBe(true);
    // keyboard focus inside a section opens it at once
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('#qty').focus();
    expect(await page.evaluate(() => [...document.querySelectorAll('#lab > .wr-panel')].every(p => getComputedStyle(p).display === 'none'))).toBe(true);
    // effects.wingReveal = false: the original page, no panels at all
    await page.route('**/site-config.js', async route => { const res = await route.fetch(); await route.fulfill({ response: res, body: (await res.text()).replace(/^(\s*)wingReveal: true/m, '$1wingReveal: false') }); });
    await page.reload();
    await expect(page.locator('.wr-panel')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/wr-on/);
  });

  // Rewrites `effects` switches in the served config. The regex is anchored to the property line, because the
  // comments above the block contain the same words.
  const withEffects = (page, flags) => page.route('**/site-config.js', async route => {
    const res = await route.fetch(); let body = await res.text();
    for (const [k, v] of Object.entries(flags)) body = body.replace(new RegExp('^(\\s*)' + k + ': (true|false)', 'm'), '$1' + k + ': ' + v);
    await route.fulfill({ response: res, body });
  });

  test('wing flap 3D: on gives the five-layer rig, off gives the original single-SVG butterfly', async ({ page }) => {
    await open(page);
    await expect(page.locator('.bloom .bfly .bf-layer')).toHaveCount(5);
    await expect(page.locator('.bloom > svg.morpho')).toHaveCount(0);
    await withEffects(page, { wingFlap3D: false });
    await page.reload(); await page.locator('#skip').click({ timeout: 2000 }).catch(() => {});
    await expect(page.locator('.bloom > svg.morpho')).toHaveCount(1);
    await expect(page.locator('.bloom .wing-left')).toHaveCount(1);
    await expect(page.locator('.bfly')).toHaveCount(0);
  });

  test('scroll story: on by default, and off gives no tone layers, no html.story and no pin wrapper', async ({ page }) => {
    await open(page);
    await expect(page.locator('html')).toHaveClass(/(^|\s)story(\s|$)/);
    await expect(page.locator('.tone')).toHaveCount(2);
    await expect(page.locator('#projects .pin .pin-stage .projgrid')).toHaveCount(1);
    await withEffects(page, { scrollStory: false });
    await page.reload(); await page.locator('#skip').click({ timeout: 2000 }).catch(() => {});
    await expect(page.locator('.tone')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/(^|\s)story(\s|$)/);
    await expect(page.locator('.pin')).toHaveCount(0);
    await expect(page.locator('#projectsHost > .projgrid')).toHaveCount(1);
    await expect(page.locator('.proj')).toHaveCount(7);
  });

  test('all three effect switches off: the page has none of the effects', async ({ page }) => {
    await withEffects(page, { wingReveal: false, wingFlap3D: false, scrollStory: false });
    await open(page);
    expect(await page.evaluate(() => ({
      wr: document.documentElement.classList.contains('wr-on'), story: document.documentElement.classList.contains('story'),
      panels: document.querySelectorAll('.wr-panel').length, rig: document.querySelectorAll('.bfly').length,
      tone: document.querySelectorAll('.tone').length, pin: document.querySelectorAll('.pin').length,
      stages: document.querySelectorAll('.guide .g-stage').length, guideSvg: !!document.querySelector('.guide > svg.morpho')
    }))).toEqual({ wr: false, story: false, panels: 0, rig: 0, tone: 0, pin: 0, stages: 0, guideSvg: true });
  });

  test('no horizontal scrolling on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await open(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('site-config.js drives the page', () => {
  test('changing email, LinkedIn, GitHub and resume updates every link', async ({ page }) => {
    await page.route('**/site-config.js', async route => {
      const res = await route.fetch(); let body = await res.text();
      body = body.replace(/email: '[^']*'/, "email: 'qa@example.test'").replace(/linkedin: '[^']*'/, "linkedin: 'https://linkedin.example.test/in/x'")
        .replace(/github: '[^']*'/, "github: 'https://github.example.test/someone/'").replace(/resume: '[^']*'/, "resume: 'assets/other.pdf'");
      await route.fulfill({ response: res, body });
    });
    await open(page);
    for (const a of await page.locator('[data-cfg="email"]').all()) await expect(a).toHaveAttribute('href', 'mailto:qa@example.test');
    for (const a of await page.locator('[data-cfg="linkedin"]').all()) await expect(a).toHaveAttribute('href', 'https://linkedin.example.test/in/x');
    for (const a of await page.locator('[data-cfg="github"]').all()) await expect(a).toHaveAttribute('href', 'https://github.example.test/someone/');
    for (const a of await page.locator('[data-cfg="resume"]').all()) await expect(a).toHaveAttribute('href', 'assets/other.pdf');
    await expect(page.locator('[data-cfg-text="email"]')).toHaveText('qa@example.test');
    await expect(page.locator('.projgrid a.more').first()).toHaveAttribute('href', 'https://github.example.test/someone/AIAgent');
  });

  test('one years setting updates the first screen, counter, About, resume card and resume page', async ({ page }) => {
    await page.route('**/site-config.js', async route => { const res = await route.fetch(); await route.fulfill({ response: res, body: (await res.text()).replace(/years: \d+,/, 'years: 7,') }); });
    await open(page);
    await expect(page.locator('#heroFacts li').first()).toHaveText('7+ years in QA');
    await expect(page.locator('.stat b').first()).toHaveAttribute('data-n', '7');
    await expect(page.locator('#aboutCopy')).toContainText('Over 7 years');
    await expect(page.locator('[data-cfg-text="resumeNote"]')).toContainText('7 years in QA');
    await expect(page.locator('body')).not.toContainText('{years}');
    await page.goto('/resume.html');
    await expect(page.locator('#sheet')).toContainText('around 7 years of experience');
  });

  test('one title everywhere, availability shown, empty results hidden, filled results shown', async ({ page }) => {
    await open(page);
    for (const el of await page.locator('[data-cfg-text="role"]').all()) await expect(el).toHaveText('Software Quality Engineer');
    await expect(page.locator('#availability')).toHaveText('Open to full-time roles and freelance projects');
    await expect(page.locator('nav .btn')).toHaveText('Contact ↗');
    await expect(page.locator('.proj-result')).toHaveCount(0);
    await page.route('**/site-config.js', async route => { const res = await route.fetch(); await route.fulfill({ response: res, body: (await res.text()).replace("result: '',", "result: 'Regression pass cut from 3 days to 4 hours',") }); });
    await page.reload();
    await expect(page.locator('.proj-result')).toHaveCount(1);
  });

  test('a new project in the config appears as a card', async ({ page }) => {
    await page.route('**/site-config.js', async route => {
      const res = await route.fetch(); const body = await res.text();
      await route.fulfill({ response: res, body: body + "\nwindow.SITE.projects.push({kind:'Test',title:'Injected <b>project</b>',text:'Added by the test.',tags:['X']});" });
    });
    await open(page);
    await expect(page.locator('.proj')).toHaveCount(8);
    await expect(page.locator('.proj h3').last()).toHaveText('Injected <b>project</b>'); // escaped, not rendered as HTML
  });
});

test.describe('field games', () => {
  test('bug hunt: five bugs, random places, celebration, then on to the resume card', async ({ page }) => {
    await open(page);
    await expect(page.locator('.hidebug')).toHaveCount(5);
    expect(await page.locator('details .hidebug').count()).toBe(1); // one always hides in a closed investigation
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
    for (const b of await page.locator('.hidebug').all()) { await b.scrollIntoViewIfNeeded(); await b.click({ force: true }); }
    expect(await gameCount(page, 'hunt')).toBe(5);
    await expect(page.locator('#celebrate')).toBeVisible();
    await expect(page.locator('#celTitle')).toHaveText('Bug hunt complete');
    await page.locator('#celClose').click();
    await expect(page.locator('.flycta.resume')).toBeFocused();
    await expect(page.locator('.flycta.resume')).toBeInViewport();
  });

  test('bug hunt places differ between visits', async ({ page }) => {
    const seen = new Set();
    for (let i = 0; i < 4; i++) {
      await page.goto('/');
      seen.add(await page.evaluate(() => [...document.querySelectorAll('.hidebug')].map(b => { const z = b.closest('details') || b.closest('section,footer,.expertise-strip'); return (z.id || z.tagName) + ':' + [...z.querySelectorAll('*')].indexOf(b); }).sort().join('|')));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test('butterfly catch: three catches by mouse', async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    // A drifter behind a hero button cannot be clicked (the button wins), so aim only at one that is on top.
    await page.evaluate(() => { window.reachable = () => { for (const d of drifts) { if (d.flee > 0) continue; const r = d.el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; if (x < 5 || y < 90 || x > innerWidth - 5 || y > innerHeight - 5) continue; const top = document.elementFromPoint(x, y); if (top && d.el.contains(top)) return { x, y }; } return null; }; });
    for (let i = 0; i < 3; i++) {
      await expect(async () => {
        const pt = await page.evaluate(() => window.reachable());
        expect(pt).not.toBeNull();
        await page.mouse.click(pt.x, pt.y);
        expect(await gameCount(page, 'catch')).toBe(i + 1);
      }).toPass({ timeout: 20000 });
    }
    await expect(page.locator('#celTitle')).toHaveText('Butterfly catch complete');
  });

  test('butterfly catch works from the keyboard', async ({ page }) => {
    await open(page);
    await page.locator('#kbCatch').focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => gameCount(page, 'catch')).toBe(1);
  });

  test('defect lab: reproduce on the original build, verify on the patched build', async ({ page }) => {
    await open(page);
    await page.fill('#qty', '0'); await page.click('#run');
    await expect(page.locator('#result')).toContainText('DEFECT FOUND');
    expect(await gameCount(page, 'lab')).toBe(1);
    await page.selectOption('#build', 'fixed'); await page.click('#suite');
    await expect(page.locator('#result')).toContainText('PASS · 6/6');
    expect(await gameCount(page, 'lab')).toBe(2);
  });

  test('spot the defect: exactly three planted defects', async ({ page }) => {
    await open(page);
    for (const b of await page.locator('#arc-spot .mk').all()) await b.click();
    expect(await gameCount(page, 'spot')).toBe(3);
    await expect(page.locator('#arc-spot .mk.fixed')).toHaveCount(3);
    await expect(page.locator('#arc-spot .mk-total')).toHaveText('Total · ₹540');
    await expect(page.locator('#arc-spot .arc-chip')).toBeVisible();
  });

  test('flaky test: see a failure, then name the timing cause', async ({ page }) => {
    await open(page);
    for (let i = 0; i < 3; i++) await page.click('#arc-flaky .arc-run');
    await expect(page.locator('#arc-flaky .runlog .fail').first()).toBeVisible();
    expect(await gameCount(page, 'flaky')).toBe(1);
    await page.locator('#arc-flaky .arc-opt', { hasText: 'password' }).click();
    expect(await gameCount(page, 'flaky')).toBe(1); // a wrong answer scores nothing
    await page.locator('#arc-flaky .arc-opt', { hasText: '200 ms timeout' }).click();
    expect(await gameCount(page, 'flaky')).toBe(2);
  });

  test('log detective: symptoms do not score, the root cause does', async ({ page }) => {
    await open(page);
    await page.locator('#arc-log .logline.lv-error').first().click();
    await expect(page.locator('#arc-log .arc-status')).toContainText('symptom');
    expect(await gameCount(page, 'log')).toBe(0);
    await page.locator('#arc-log .logline.lv-warn').first().click();
    expect(await gameCount(page, 'log')).toBe(1);
  });

  test('defect interview: ask, then pick the supported cause', async ({ page }) => {
    await open(page);
    await expect(page.locator('#arc-interview .arc-q')).toBeHidden();
    await page.locator('#arc-interview .arc-ask').nth(0).click();
    await page.locator('#arc-interview .arc-ask').nth(1).click();
    await expect(page.locator('#interviewChat p')).toHaveCount(2);
    for (const o of await page.locator('#arc-interview .arc-opt').all()) { if (await gameCount(page, 'interview')) break; await o.click(); }
    expect(await gameCount(page, 'interview')).toBe(1);
  });

  test('chaos mode: four injected defects, each click repairs one', async ({ page }) => {
    await open(page);
    const before = await page.locator('nav a[href="#projects"]').textContent();
    await page.click('#questOrb', { force: true });
    await page.check('#chaosToggle');
    await expect(page.locator('[data-chaos]')).toHaveCount(4);
    await expect(page.locator('.chaos-banner')).toContainText('4 injected defects');
    const url = page.url();
    for (let i = 0; i < 4; i++) { const el = page.locator('[data-chaos]').first(); await el.scrollIntoViewIfNeeded(); await el.click({ force: true }); }
    expect(await gameCount(page, 'chaos')).toBe(4);
    await expect(page.locator('[data-chaos]')).toHaveCount(0);
    expect(page.url()).toBe(url); // filing a defect on a link must not navigate
    expect(await page.locator('nav a[href="#projects"]').textContent()).toBe(before);
    await expect(page.locator('.chaos-banner')).toBeHidden();
  });

  test('games always start from zero: refresh, a new browser, and "Reset games"', async ({ page, browser }) => {
    // The longest test: three page loads, a second browser context and ~15 actions. Under a full parallel run it can
    // pass 30s on a busy machine (it did before the effects were added too), so it gets the triple budget.
    test.slow();
    await open(page);
    await page.fill('#qty', '0'); await page.click('#run');
    for (const b of await page.locator('#arc-spot .mk').all()) await b.click();
    await expect(badge(page)).toHaveText('4/21');
    await page.click('#questOrb', { force: true });
    // "Reset games" reloads the page: wait for the new page, then skip its intro like open() does
    await Promise.all([page.waitForEvent('load'), page.click('#questReset')]);
    await expect(badge(page)).toHaveText('0/21');
    await skipIntro(page);
    await page.fill('#qty', '0'); await page.click('#run');
    await expect(badge(page)).toHaveText('1/21');
    await page.reload();
    await expect(badge(page)).toHaveText('0/21');
    await skipIntro(page);
    await expect(page.locator('#arc-spot .arc-chip')).toBeHidden();
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('sk-') && k !== 'sk-theme'))).toEqual([]);
    const other = await browser.newContext(); const p2 = await other.newPage();
    await p2.goto('/'); await expect(p2.locator('#questBadge')).toHaveText('0/21'); await other.close();
  });

  test('progress saved by an older version is ignored and removed', async ({ page }) => {
    await page.addInitScript(() => { try { localStorage.setItem('sk-games', JSON.stringify({ hunt: 3, spot: 2 })); } catch {} });
    await open(page);
    await expect(badge(page)).toHaveText('0/21');
    expect(await page.evaluate(() => localStorage.getItem('sk-games'))).toBeNull();
  });

  test('clearing every game gives the grand celebration and a downloadable badge', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { for (const id of Object.keys(games)) while (games[id].n < games[id].total) score(id); });
    await expect(page.locator('#celebrate')).toHaveClass(/grand/);
    await expect(page.locator('#celTitle')).toHaveText('Every game cleared');
    await expect(page.locator('.quest')).toHaveClass(/alldone/);
    const [download] = await Promise.all([page.waitForEvent('download'), page.click('#celBadge')]);
    expect(download.suggestedFilename()).toBe('certified-bug-hunter.png');
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the motion-only game is left out and nothing animates in', async ({ page }) => {
    await open(page);
    await expect(page.locator('[data-game="catch"]')).toBeHidden();
    await expect(badge(page)).toHaveText('0/18');
    await expect(page.locator('#intro')).toBeHidden();
  });

  test('engine replay steps through six confirmed turns', async ({ page }) => {
    await open(page);
    await page.click('#openReplay');
    await expect(page.locator('#replayDialog')).toBeVisible();
    await page.click('#replayPlay');
    await expect(page.locator('#replayHost .turns tr.done')).toHaveCount(6);
    await expect(page.locator('#calcOut')).toHaveText('0');
    await expect(page.locator('#replayNow')).toContainText('6 of 6 turns confirmed');
    await page.keyboard.press('Escape');
    await expect(page.locator('#replayDialog')).toBeHidden();
  });

  test('case study dialog opens per project and closes', async ({ page }) => {
    await open(page);
    await page.locator('.projgrid [data-story]').first().click();
    await expect(page.locator('#storyDialog')).toBeVisible();
    await expect(page.locator('#storyDialog .story-body section')).toHaveCount(3);
    await expect(page.locator('#storyTitle')).toHaveText('AIAgent: testing assistant');
    await page.click('#storyDialog .dlg-close');
    await expect(page.locator('#storyDialog')).toBeHidden();
  });
});

test.describe('AI desk on built-in rules', () => {
  test('says which engine answered', async ({ page }) => {
    await open(page);
    await expect(page.locator('.ai-mode-text')).toContainText('Built-in rules mode');
  });

  test('Ask: answers from the profile, and admits what it does not know', async ({ page }) => {
    await open(page);
    await page.fill('#aiin-ask', 'Which automation tools does he use?'); await page.click('#aipanel-ask .ai-go');
    await expect(page.locator('#aiout-ask')).toContainText('Selenium');
    await page.fill('#aiin-ask', 'What is his favourite pizza topping?'); await page.click('#aipanel-ask .ai-go');
    await expect(page.locator('#aiout-ask')).toContainText('not in the profile');
  });

  test('Test cases: boundary values come from the stated range', async ({ page }) => {
    await open(page);
    await page.click('#aitab-cases');
    await page.fill('#aiin-cases', 'Quantity field accepts whole numbers from 1 to 10 on the checkout page');
    await page.click('#aipanel-cases .ai-go');
    const out = page.locator('#aiout-cases');
    for (const t of ['Value 0 is rejected', 'Value 1 is accepted', 'Value 10 is accepted', 'Value 11 is rejected']) await expect(out).toContainText(t);
    expect(await out.locator('tbody tr').count()).toBeGreaterThanOrEqual(8);
  });

  test('Bug report: structures a messy complaint and lists what is missing', async ({ page }) => {
    await open(page);
    await page.click('#aitab-bug');
    await page.fill('#aiin-bug', 'i logged in then when i click save on a long note the app crashes sometimes and my note is gone');
    await page.click('#aipanel-bug .ai-go');
    const out = page.locator('#aiout-bug');
    await expect(out.locator('.sev')).toHaveText('High');
    await expect(out).toContainText('Intermittent');
    await expect(out).toContainText('Environment');
  });

  test('Job fit: only claims skills that are in the profile', async ({ page }) => {
    await open(page);
    await page.click('#aitab-fit');
    await page.fill('#aiin-fit', 'QA engineer with Selenium, Java, TestNG, Jenkins, Docker and Cypress.');
    await page.click('#aipanel-fit .ai-go');
    const yes = page.locator('#aiout-fit .fit-yes'), no = page.locator('#aiout-fit .fit-no');
    for (const t of ['Selenium', 'Java', 'TestNG']) await expect(yes).toContainText(t);
    for (const t of ['Jenkins', 'Docker', 'Cypress']) await expect(no).toContainText(t);
    await expect(page.locator('#aiout-fit .fit-score')).toHaveText('50%');
  });

  test('visitor text is never rendered as HTML', async ({ page }) => {
    await open(page);
    await page.click('#aitab-bug');
    await page.fill('#aiin-bug', 'when i click <img src=x onerror="window.__xss=1"> the app crashes');
    await page.click('#aipanel-bug .ai-go');
    await expect(page.locator('#aiout-bug img')).toHaveCount(0);
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  });
});

test.describe('theme, scorecard, resume', () => {
  test('night grove toggles and is remembered', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await open(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.click('#themeToggle', { force: true });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#themeToggle')).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('first visit follows the system colour scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('scorecard reports real numbers and zero calls to other sites', async ({ page }) => {
    await open(page);
    await page.locator('#hood').scrollIntoViewIfNeeded();
    await expect(page.locator('#scThird')).toHaveText('0');
    await expect(page.locator('#scCookies')).toHaveText('0');
    await expect(page.locator('#scReady')).toHaveText(/^\d+\.\d\d s$/);
    await expect(page.locator('#scFiles')).toHaveText(/^\d+$/);
  });

  test('resume page is built from the same config', async ({ page }) => {
    await page.goto('/resume.html');
    await expect(page.locator('h1')).toHaveText('Shashikumar Angajala');
    for (const s of ['Summary', 'Skills', 'Experience', 'Projects', 'Awards', 'Certifications', 'Education']) await expect(page.locator('h2', { hasText: new RegExp('^' + s + '$') })).toBeVisible();
    await expect(page.locator('.contact a[href^="mailto:"]')).toHaveText('angajalashashikumar@gmail.com');
  });
});
