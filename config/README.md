# Config

Everything you can change on the website without touching code is in **`site-config.js`** in this folder.
Open it in any text editor, change a value, save, and reload the page.

| To change | Edit this setting |
|---|---|
| Years of experience (everywhere) | `years` |
| Butterfly wing reveal while scrolling (on/off) | `effects.wingReveal` (`true` / `false`) |
| 3D wing flapping of the butterflies (on/off) | `effects.wingFlap3D` (`true` / `false`) |
| Scroll story: growing companion, career vine, sliding projects, depth, colour flow (on/off) | `effects.scrollStory` (`true` / `false`) |
| Headline job title | `role` |
| "Open to…" line in Contact | `availability` |
| Measurable result on a project card | that project's `result` |
| Measurable results on the resume page | `resumePage.experience[0].results` |
| Email, phone, LinkedIn, GitHub | `email`, `phone`, `linkedin`, `github` |
| Resume PDF | put the file in `assets/`, then set `resume` |
| The chips on the first screen | `heroFacts` |
| About text and skill tags | `about` |
| The four counters | `stats` |
| Career timeline | `career` |
| Projects and their case studies | `projects` |
| "How I test" investigations | `investigations` |
| Sample bug reports | `bugReports` |
| The print-ready resume page | `resumePage` |

Rules: keep the quotes around each value and the commas between items. Writing `{years}` inside any text
inserts the `years` number, so it never has to be typed twice.

Only real numbers go into `result` and `results`. Empty ones are simply not shown.
