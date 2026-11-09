# Angajala Shashikumar — Portfolio Source Data

> Software Test Engineer · Hyderabad, India
> [LinkedIn](https://in.linkedin.com/in/shashikumar-angajala-19937a20a) · [GitHub](https://github.com/Shashi1912) · angajalashashikumar@gmail.com · +91 88019 54605

This file is the single source of truth for building the portfolio site. A machine-readable
version of the same data lives in [portfolio-data.json](portfolio-data.json).
Sources: GitHub API (`Shashi1912`), the QA resume PDF published in the `email-sender-app` repo,
and the local Automation_Engine project. Collected 2026-11-09.

---

## Professional Summary

Software Test Engineer with around **4 years of experience** in automation and manual testing of
desktop, VR, and web applications. Experienced in Hybrid frameworks using Java, Selenium
WebDriver, TestNG, and Maven. Skilled in Page Object Model (POM) and Apache POI for external
test data and configuration-based execution. Hands-on with defense and VR simulators built in
C#, Unreal Engine (4.2, 5.1), and Reality Engine, emphasizing long-duration stability and
immersive interactions. Experienced in InstallShield packaging and Agile delivery with
cross-functional teams.

## Core Skills

| Category | Skills |
|---|---|
| Automation tools | Selenium WebDriver, Winnium, TestNG, Maven, SVN |
| Programming | Java, SQL, Python, JavaScript |
| Frameworks | Hybrid, Data-Driven, Keyword-Driven, Page Object Model (POM) |
| Test management | TFS, JIRA |
| Testing types | Regression, Functional, System, Endurance, Integration, Smoke, UAT |
| Other | InstallShield, Batch Scripting, Requirements Analysis, Agile/Scrum, Apache POI, JavaMail API, Windows UI Automation (UIA), OCR perception, Local LLMs (Ollama), Prompt Engineering |

## Work Experience

### Software Test Engineer — Zen Technologies Ltd, Hyderabad (Nov 2021 – Present)

- Executed functional, regression, smoke, sanity, system, and UAT test suites across desktop and VR defense simulator modules with full requirement traceability.
- Built Hybrid automation frameworks using Java, Selenium WebDriver, TestNG, and Maven with POM for readable page objects and maintainable locators.
- Implemented Apache POI for reading Excel/property files to enable configuration-based and reusable test execution.
- Developed and validated MSI installers using InstallShield and batch scripts; handled fresh installs, upgrades, and on-site troubleshooting.
- Collaborated with CSD, SMEs, Production ARTS, developers, and Scrum teams; logged reproducible defects in JIRA/TFS with evidence and environment notes.
- Conducted client demos and knowledge transfers, including VR walkthroughs, ensuring environment readiness.

## Projects

### ⭐ Automation Engine — AI Desktop App Tester *(personal flagship, in active development)*

**Python 3.13 · Windows UIA · OCR · Local LLMs (Ollama) · SQLite — fully offline**

An AI agent that tests any Windows desktop app the way a human would. Give it an app and every
turn it runs **Perceive → Orient → Decide → Act → Verify → Remember**: it reads the UI through
the UIA tree plus OCR, picks one action via a code-first decision ladder (decision cache →
deterministic rules → small LLM → large LLM), performs it with raw SendInput, verifies a
falsifiable post-condition, and learns via a state graph and recorded recipes. Also includes
flow recording and replay, parameterized "exercises" that generate and loop test cases,
endurance metrics with memory-leak trend detection, crash triage tooling (crashdoctor),
incident evidence bundles (screenshot, UIA tree, metrics, minidump), and self-contained HTML
reports. Safety is enforced in code — deny lists, destructive-action refusal, focus guard —
never by prompt, and the LLM endpoint is loopback-only.

### AIAgent — AI Testing Assistant · [repo](https://github.com/Shashi1912/AIAgent)

**Python** — Chat-driven desktop assistant that generates test cases and bug reports and exports
them to Excel/PDF/Word; includes an automation recorder/executor and a UI element inspector.

### AWeSim Simulator Automation *(professional, Zen Technologies)*

**Java · Selenium · TestNG · Apache POI · C# / Unreal Engine 4.2** — Automated UI verification,
regression, and long-duration endurance sessions with a Hybrid POM framework, wait utilities,
and Excel-driven test data.

### DS Simulator Automation *(professional)*

**Java · Selenium · TestNG · Apache POI · Unreal Engine 4.2/5.1 · Reality Engine** — Automated
sanity, functional, and integration suites; externalized test data and runtime parameters.

### Map Reading VR Simulator *(professional)*

**C# · Unreal Engine 5.1** — Functional, regression, and endurance testing of a VR simulator;
verified motion controls, interaction responsiveness, and immersive behaviors.

### Funwork Analytics Tool *(professional)*

**Java · Selenium · Apache POI · JavaMail API** — Automated data extraction and Excel
consolidation with emailed reports.

### EmailApp · [repo](https://github.com/Shashi1912/EmailApp)

**React · Node.js · JavaScript** — Full-stack email application with XML-based configuration.

### email-sender-app · [repo](https://github.com/Shashi1912/email-sender-app)

**HTML · JavaScript · Node.js** — Lightweight single-page web email sender.

## Certifications & Training

- **2025** — Project Management Professional (Coursera)
- **2025** — Prompt Engineering for Generative AI (Coursera)
- **2025** — ISTQB Foundation Level Certification *(in progress)*

## Achievements

- **2022** — Key Contributor Award: automating simulator test flows and stabilizing long-duration checks
- **2023** — Excellence in QA: consistent defect reproduction, documentation, cross-team collaboration
- **2024** — Innovation in Automation: reusable POM components and configuration-driven execution
- **2024** — Process Improvement Award: POI-based Excel consolidation to cut manual reporting

## Education

- **2015–2019** — B.Tech, Electrical and Electronics Engineering, Mallareddy Institute of Engineering and Technology (JNTUH)

## Additional Strengths

- Strong understanding of software testing and defect life cycles
- Clear communication and documentation; collaborative team contributor
- Quick to learn and adopt new tools and frameworks
- Focus on process improvement, durable test artifacts, and knowledge sharing

---

## Data-collection notes (for whoever builds the site)

- **LinkedIn** serves an authwall to any non-logged-in client, so the profile page itself could not be scraped; the resume PDF (`email-sender-app/Angajala_Shaskikumar_QA_Resume.pdf`) was used instead and carries the same profile data. If the LinkedIn page has extras (headline, recommendations), pull them manually.
- **GitHub mismatch**: the resume prints `github.com/shashikumar-angajala`, but the real account is `github.com/Shashi1912`. Fix the resume or rename the account before publishing.
- **QuickEmailSender** repo is empty — populate it or leave it out of the portfolio.
- GitHub profile has no location, company, or website set — worth filling in for the portfolio to look complete.
