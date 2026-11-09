# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static portfolio site for Angajala Shashikumar (freelance QA / Software Test Engineer), themed around a bug→butterfly metamorphosis ("From Bugs to Brilliance"). No framework, no build step, no dependencies, no tests — plain HTML/CSS/JS served as files.

This folder lives inside the `D:\Automation_Engine` git repository (which has its own CLAUDE.md for the engine); commits from here land in that repo.

## Commands

```bash
python -m http.server 8000    # serve from this folder, open http://localhost:8000
```

Opening `index.html` directly also works (everything is relative paths, no fetches). There is no lint, build, or test command.

## Content source of truth

- `portfolio-data.json` — machine-readable profile data (person, skills, experience, projects, certs, education), collected 2026-11-09 from the GitHub API, the resume PDF in the `email-sender-app` repo, and the local Automation_Engine project.
- `PORTFOLIO.md` — the same data human-readable, plus data-collection notes (known issues: resume prints the wrong GitHub handle; LinkedIn can't be scraped anonymously).

When site copy about experience/skills/projects changes, keep it consistent with these files; when the facts change, update both files together.

## Architecture

Three files, loaded in an order that matters:

1. **`index.html`** holds a large inline `<style>` block containing *layered* themes: a base light theme, then a dark-grove theme appended below it that overrides the base (same selectors, later wins). After the inline block, `design.css` is linked.
2. **`design.css`** ("Forest editorial") overrides the inline styles again, and its *bottom* section ("Realistic assets override…") overrides its own earlier rules to size the photographic butterfly/caterpillar. CSS is cascade-by-append: new restyles are added at the end rather than editing earlier layers. Keep that pattern (or be prepared to untangle all layers at once).
3. **`sound.js`** — WebAudio-only ambient score (synthesized chords plus periodic wing-beat puffs of band-passed noise, deliberately no audio files or streaming). Listens for the custom `metamorphosis` window event to play phase stingers.

All page behavior is one inline `<script>` in index.html:

- **Butterfly/caterpillar instances**: `<template id="butterfly-shape">` holds a hand-drawn SVG emerald swallowtail, *Papilio palinurus* style (viewBox `0 0 540 460`: velvet-dark scalloped wings with tails, an emerald band with a blurred glow duplicate under it, feTurbulence scale-shimmer, lunules, veins; `.wing-left`/`.wing-right` groups flapped by CSS `scaleX` around origin `270px 238px`, `transform-box:view-box`). `butterfly(host, prefix, tpl?)` clones a template and remaps element IDs plus `url(#…)` references in **both `fill` and `filter` attributes** per instance; hosts: hero `.bloom`, intro `#introShape`, journey `.emerged`, scroll-following `.guide`, the nav logo `.mark` next to "Shashi", and three ambient `.drift` butterflies in the hero (`.d1/.d2/.d3`, sized and `hue-rotate`d per class), which are flown by a JS steering loop (`flyLoop`: wander noise, banking into turns, horizontal wrap; their old CSS flight keyframes are overridden with `animation:none`). The hero also has pointer+scroll parallax (`--bgx/--bgy` on `.hero` background-position, plus different translate rates for `.bloom`, `.wrap`, and the `#flight` canvas). Section `h2`s are split into word spans for staggered rise-on-reveal — the class is `wsplit`, NOT `split`, because `.split` is the site's two-column grid layout class and blockifies the spans. `<template id="caterpillar-shape">` is an SVG caterpillar with `.seg` body-wave and `.leg` walk-cycle animations (per-element `animation-delay` inline), cloned into journey `.larva` and QA-lab `.bug`. The right wing is mirrored by an *attribute* transform on an outer `<g>` so the CSS animation on the inner group doesn't overwrite it — keep that nesting. `assets/morpho-real.png` / `caterpillar-real.png` are the retired photo versions, no longer referenced.
- **`#flight` canvas**: a ~2400-particle butterfly flock. The same canvas element is physically moved (`prepend`) between the `#intro` overlay (dense swarm during the opening) and the hero (sparse ambient flock after). `startScene`/`finishScene` also manage `inert` on main/header/footer and focus.
- **Journey section**: 3-phase metamorphosis driven by `data-phase` on `.habitat`, auto-advanced on a timer gated by IntersectionObserver visibility, pause button, and tab visibility; each change dispatches the `metamorphosis` event (consumed by sound.js).
- **Career + Projects sections** (`#milestones`, `#projects`): real profile content from `portfolio-data.json`. A generic scroll-reveal system (`[data-reveal]` + IntersectionObserver adds `.seen`, stagger via `--d` inline delay) drives the timeline vine (`scaleY` on `.timeline:before`), node reveals, and project cards; stat numbers count up once via a second observer reading `data-n`/`data-s`. `#projects` leads with a featured dark card for the Automation Engine whose fake console animates the six turn-loop steps (`.console li` staggered by `--i`); each grid card has an inline-SVG illustration with its own idle animation (`.sweep`, `.needle`, `.lens`, `.row`, `.dot`, and `.plane` on an `offset-path`).
- **Living wordmark**: the nav brand is `#brandfly`, a canvas where ~300 tiny butterflies fly in from scattered positions and assemble "SHASHI" left-to-right (offscreen-canvas text sampling at a 3px grid; a 14%-alpha ghost of the word fades in once formed). The formation clock is held while the `#intro` overlay lacks `.done`, so the assembly plays after the intro ends and replays with the intro. Hovering scatters the swarm; leaving re-forms it. Under reduced motion the canvas hides and the plain `.brandtext` span shows; the real name lives in the `<strong>`'s aria-label. Note: rAF freezes while the Browser pane is occluded, so verify this animation with the pane visible.
- **Explorer features**: a scroll-progress bar in the header (`.pageprog`) with a caterpillar `.walker` that becomes a butterfly past 98%, and a bug-hunt game — five `.hidebug` buttons hidden across sections (one inside a closed `<details>`), each transforming into a butterfly when clicked, counted in the fixed `.hunt` pill (hidden while the intro overlay runs via `#intro:not(.done)~.hunt`). Catches dispatch a `bugfound` window event that sound.js answers with rising chimes. The hunt pill markup must stay AFTER the main inline script (it's created before the script's selectors run otherwise — the script sits between `</footer>` and the asides).
- **QA Lab**: the boundary-value demo's "Original build" intentionally accepts 0 (off-by-one defect) while "Patched build" doesn't — `check()` encodes this; it's the point of the section, not a bug to fix.
- **Contact form**: `contactEmail` const at the top of the script is intentionally empty — the form then downloads a `.txt` brief instead of opening mailto. **Set it before launch**; nothing is ever sent to a server.

## Conventions that must survive edits

- Fully static and offline: no CDNs, no external fonts, no network requests, no audio downloads. Assets are local files in `assets/`.
- Every animation respects `prefers-reduced-motion` (intro, guide, flock, journey, sound panel are disabled or skipped). Any new animation needs the same guard.
- Accessibility patterns in place: skip links, `aria-live` outputs, `aria-pressed` toggles, `inert` during the intro overlay, focus-visible outlines. Keep them when touching those areas.
