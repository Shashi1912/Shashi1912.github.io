/*
  Site settings and content. Edit a value here, save, and reload the page: the website updates.
  Keep the quotes around each value, and the commas between items. Nothing here is sent anywhere.
  The same file feeds index.html (the site) and resume.html (the print-ready resume page).

  {years} anywhere in the text below is replaced by the `years` setting, so the number is typed once.
*/
window.SITE = {
  /* ---------- Identity and links ---------- */
  name: 'Shashikumar Angajala',
  // The headline title used across the site and the resume page. (Your Zen job title stays as it is in `career`.)
  role: 'Software Quality Engineer',

  // What you are open to. Shown in the contact section. Leave '' to hide the line.
  availability: 'Open to full-time roles and freelance projects',
  location: 'Hyderabad, India',

  // Years of experience. Change this one number and it updates the first screen, the counters,
  // the About text, the resume card and the resume page (everywhere {years} is written below).
  years: 5,

  // Shown on the "Email me" card and used by every mailto link (contact card, footer, quote form).
  // Set to '' to make the quote form download a .txt brief instead of opening the mail app.
  email: 'angajalashashikumar@gmail.com',

  // Optional. Leave '' to keep the phone number off the website and the resume page.
  phone: '',

  // LinkedIn profile (contact section, footer, resume page).
  linkedin: 'https://in.linkedin.com/in/shashikumar-angajala-19937a20a',

  // GitHub profile. A project's repo link is built from it: <github>/<repo>.
  github: 'https://github.com/Shashi1912',

  // The GitHub repository that hosts this website (used for the "See the test suite" link).
  repo: 'Shashi1912.github.io',

  // Resume file for the "Download my Resume" card and the footer link. Put the PDF in the assets folder.
  // Built from resume.html by `node tests/make-resume-pdf.js`, so it always matches this config.
  // (The older hand-made PDF was removed; it had outdated details.)
  resume: 'assets/Shashikumar_Angajala_Resume.pdf',

  // The small line under "Download my Resume" in the contact section.
  resumeNote: 'PDF · Software Quality Engineer · {years} years in QA',

  /* ---------- Effects ---------- */
  // Each switch turns one effect on (true) or off (false). Off always means the site as it was before that effect.
  // Visitors who ask their device for reduced motion never see any of them.
  //
  // wingReveal: true  = each section opens through a pair of 3D butterfly wings as you scroll.
  // wingReveal: false = the original straight scroll (the effect is switched off completely).
  //
  // wingFlap3D: true  = the butterflies beat their wings in 3D: wings turn on the body, bend, meet above it and sweep down.
  // wingFlap3D: false = the original flat wing flap.
  //
  // scrollStory: true  = the scroll tells the story: the little companion grows from caterpillar to cocoon to butterfly,
  //                      the career vine grows as you read, the projects slide sideways on large screens, headings float
  //                      at a different depth, and the page colour flows from section to section.
  // scrollStory: false = the original scrolling page.
  effects: {
    wingReveal: true,
    wingFlap3D: true,
    scrollStory: true
  },

  /* ---------- First screen ---------- */
  // Short facts shown under the opening paragraph. Keep each one to a few words.
  heroFacts: ['{years}+ years in QA', 'Zen Technologies', 'Desktop · VR · API', 'Java · Selenium · Python'],

  /* ---------- About section ---------- */
  about: {
    paragraphs: [
      'My QA work spans Windows applications, networked simulators, and APIs. I follow a problem across the interface, the network, and the data until another engineer can reproduce it.',
      'Over {years} years of that work at Zen Technologies, on desktop and VR defense simulators built in C# and Unreal Engine, taught me to care about long-duration stability, not just a passing suite.'
    ],
    // The small tags under the About text.
    skills: ['Java · Selenium · Winium', 'Postman · REST Assured', 'TestNG · Maven', 'MySQL · Windows']
  },

  /* ---------- Career section ---------- */
  // The four counters. n = the number, suffix = optional text after it.
  stats: [
    { n: '{years}', suffix: '+', label: 'Years in QA' },
    { n: 8, label: 'Projects tested & built' },
    { n: 3, label: 'Defense & VR simulators tested' },
    { n: 4, label: 'Team awards' }
  ],
  // Timeline entries, oldest first. The last one gets the perched butterfly.
  career: [
    { when: '2015 – 2019', title: 'B.Tech, Electrical & Electronics Engineering', text: 'Mallareddy Institute of Engineering and Technology, JNTUH.' },
    { when: 'NOV 2021', title: 'Software Test Engineer at Zen Technologies, Hyderabad', text: 'Functional, regression, system, endurance and UAT suites across desktop and VR defense simulators, with full requirement traceability. Hybrid Java–Selenium–TestNG frameworks, InstallShield installers, client demos and VR walkthroughs.' },
    { when: '2022', title: 'Key Contributor Award', text: 'For automating simulator test flows and stabilizing long-duration checks.' },
    { when: '2023', title: 'Excellence in QA', text: 'Consistent defect reproduction, documentation and cross-team collaboration.' },
    { when: '2024', title: 'Innovation in Automation · Process Improvement Award', text: 'Reusable POM components, configuration-driven execution, and POI-based Excel consolidation that cut manual reporting.' },
    { when: '2025', title: 'Project Management Professional · Prompt Engineering for Generative AI', text: 'Coursera certifications; ISTQB Foundation Level in progress.' },
    { when: 'TODAY', title: 'Teaching software to test software', text: 'Building an offline AI engine that works a Windows app the way a tester would, and this portfolio.' }
  ],

  /* ---------- Projects section ---------- */
  // The first project with featured: true becomes the large dark card. The rest fill the grid.
  //   kind  = small heading       title/text = card copy       tags = chips at the bottom
  //   repo  = GitHub repository name (optional; the link is built from `github` above)
  //   art   = card picture: 'chat', 'radar', 'gauge', 'vr', 'sheet', 'plane' (or leave out)
  //   story = optional case study shown by "Read the story": challenge, approach, outcome
  //   result = OPTIONAL measurable result, e.g. 'Regression pass cut from 3 days to 4 hours'. Only real numbers.
  //            Empty ('') shows nothing. When filled, it appears as a highlighted line on the card and in the story.
  projects: [
    {
      featured: true,
      result: '',
      kind: 'Flagship side project · fully offline AI',
      title: 'Automation Engine: the tester that works the app itself',
      text: 'Point it at any Windows desktop application and it tests like a human: it reads the screen through UI Automation and OCR, chooses one action per turn, predicts what should happen, then checks that it did. Deterministic rules and caches decide first; a local LLM is consulted only when code can\'t decide. It records flows, replays them as parameterized exercises, watches memory trends for leaks, and writes self-contained HTML reports with evidence for every incident.',
      tags: ['Python', 'Windows UIA', 'OCR', 'Local LLMs · Ollama', 'SQLite'],
      story: {
        challenge: 'Desktop applications rarely expose test hooks, so regression passes are done by hand, and scripted automation breaks as soon as the interface shifts.',
        approach: 'Every turn runs Perceive → Orient → Decide → Act → Verify → Remember. The model only proposes intent; code performs the action through raw SendInput and checks a falsifiable post-condition. Deny lists, destructive-action refusal and a focus guard live in code, never in a prompt, and the model endpoint is loopback-only.',
        outcome: 'It replays recorded flows and explores Windows apps such as Notepad and Calculator, capturing a screenshot, the UI tree and metrics for every incident, and writes a self-contained HTML report per run. Still in active development.'
      }
    },
    {
      kind: 'Side project · On GitHub', art: 'chat', repo: 'AIAgent',
      title: 'AIAgent: testing assistant',
      text: 'A desktop chat assistant that routes plain English to the right job: requirements become structured test cases, an issue description becomes a bug report, exported to Excel, PDF or Word. Ships with a UI recorder, an element inspector and screenshot tooling.',
      tags: ['Python', 'PyQt5', 'Selenium', 'OpenCV'],
      story: {
        challenge: 'Writing test cases and bug reports by hand is repetitive, and the format drifts from person to person.',
        approach: 'A chat front end routes each request to a generator: requirements become structured test cases, an issue description becomes a bug report. Results export to Excel, PDF or Word, next to a UI recorder and an element inspector.',
        outcome: 'Public on GitHub. The same idea, generating test artefacts from plain English, runs live in the AI desk on this page.'
      }
    },
    {
      kind: 'Zen Technologies', art: 'radar',
      result: '',
      title: 'AWeSim simulator automation',
      text: 'UI verification, regression and long-duration endurance for a desktop defense simulator; hybrid POM framework with wait utilities and Excel-driven test data.',
      tags: ['Java', 'Selenium', 'TestNG', 'UE 4.2'],
      story: {
        challenge: 'A desktop defense simulator needed repeatable UI verification, regression passes and long-duration endurance sessions.',
        approach: 'A Hybrid framework on Java, Selenium and TestNG with page objects, shared wait utilities and test data kept outside the code in Excel and configuration files.',
        outcome: 'Regression and endurance sessions run from configuration instead of by hand, and test data changes without touching the code.'
      }
    },
    {
      kind: 'Zen Technologies', art: 'gauge',
      result: '',
      title: 'DS simulator automation',
      text: 'Sanity, functional and integration suites with externalized test data and runtime parameters, verified across engine upgrades from UE 4.2 to 5.1 and Reality Engine.',
      tags: ['Java', 'Selenium', 'Apache POI', 'UE 4.2 / 5.1'],
      story: {
        challenge: 'The simulator moved across engine versions (Unreal Engine 4.2 to 5.1, and Reality Engine), and each move needed the same suites re-verified.',
        approach: 'Sanity, functional and integration suites on the Selenium–Java Hybrid framework, with test data and runtime parameters read through Apache POI and config files.',
        outcome: 'The same suites ran against each engine version by changing parameters, not test code.'
      }
    },
    {
      kind: 'Zen Technologies', art: 'vr',
      result: '',
      title: 'Map Reading VR simulator',
      text: 'Functional, regression and endurance testing in VR: motion controls, interaction responsiveness and immersive behavior, with defects logged to full reproduction steps.',
      tags: ['C#', 'Unreal Engine 5.1', 'JIRA / TFS'],
      story: {
        challenge: 'In VR a defect is often a feeling (lag, drift, an interaction that does not respond), which is hard to write down in a way a developer can reproduce.',
        approach: 'Functional, regression and endurance sessions focused on motion controls, interaction responsiveness and immersive behavior, each defect logged in JIRA/TFS with exact reproduction steps.',
        outcome: 'Defects reached developers as reproducible steps with evidence and environment notes.'
      }
    },
    {
      kind: 'Zen Technologies', art: 'sheet',
      result: '',
      title: 'Funwork analytics tool',
      text: 'Automated data extraction and Excel consolidation, with the finished reports mailed out automatically. The manual reporting it replaced earned a process award.',
      tags: ['Java', 'Selenium', 'Apache POI', 'JavaMail'],
      story: {
        challenge: 'Analytics reporting was assembled by hand: extract the data, consolidate it in Excel, mail it out.',
        approach: 'Selenium extracts the data, Apache POI consolidates it into Excel, and JavaMail sends the finished report.',
        outcome: 'The manual reporting step was replaced, recognised with the 2024 Process Improvement Award.'
      }
    },
    {
      kind: 'Side project · On GitHub', art: 'plane', repo: 'EmailApp',
      title: 'EmailApp: full-stack mailer',
      text: 'A React frontend over a Node and Nodemailer backend with XML-driven configuration for sender, subject and attachments; built to send a tailored application with resume attached in one click.',
      tags: ['React', 'Node.js', 'Nodemailer']
    }
  ],

  /* ---------- Investigations (the "How I test" section) ---------- */
  // Keep this to the major work. Each one opens on click.
  //   title = heading      parts = paragraphs as [label, text]; use '' for a paragraph with no label
  investigations: [
    {
      title: 'Endurance: long-duration stability',
      parts: [
        ['', 'Training simulators run for hours at a stretch, so a build that passes a ten-minute check can still fail a real session. On the desktop and VR simulators I ran long-duration endurance sessions alongside the regression suites.'],
        ['What I watch', 'Slowdowns, freezes and crashes that only appear after extended use, behaviour after many repeated scenario cycles, and whether the session ends as cleanly as it started.'],
        ['Evidence', 'Session duration, the point of failure, logs and environment notes, so a developer can rerun the same session.']
      ]
    },
    {
      title: 'Memory leaks: growth that never comes back',
      parts: [
        ['', 'A leak rarely fails a test. It shows as memory that climbs a little on every cycle and is never released, until the application slows down or dies hours later.'],
        ['Method', 'Sample the process memory at fixed intervals through a long run, then judge the trend, not single readings. My Automation Engine does this on its own: a sampler thread records the metrics, and a sustained upward slope over the window raises a leak incident.'],
        ['Evidence', 'The metrics window and its trend, a screenshot, the UI tree and the last actions taken, bundled with the incident.']
      ]
    },
    {
      title: 'Simulator replay accuracy',
      parts: [
        ['', 'During simulator testing, the target-zoom replay showed a mismatch between the point of aim and the displayed impact.'],
        ['Reproduction path', 'Record a session, capture the live aim and impact, then replay the same event at the same range. Compare the two frames and note the replay camera position.'],
        ['Evidence', 'The mismatch was observed. Fix verification is pending.']
      ]
    },
    {
      title: 'Regression across engine upgrades',
      parts: [
        ['', 'The DS simulator moved from Unreal Engine 4.2 to 5.1 and to Reality Engine. An engine move can change rendering, timing and input behaviour without any change to the feature itself.'],
        ['Method', 'Run the same sanity, functional and integration suites against each engine version, with test data and runtime parameters kept in external files so that only configuration changes between runs.'],
        ['Evidence', 'Suite results per engine version, compared like for like.']
      ]
    }
  ],

  /* ---------- Sample bug reports (shown under "Inside the test run") ---------- */
  // Illustrative reports in my reporting format. Edit, add or remove freely.
  bugReports: [
    {
      id: 'BUG-101', severity: 'Medium', status: 'Fixed in patched build',
      title: 'Checkout accepts an order quantity of 0',
      area: 'QA Lab sandbox on this page · Quantity validation',
      steps: ['Open the QA Lab section on this page.', 'Select "Original build".', 'Enter 0 as the order quantity.', 'Press "Run test".'],
      expected: 'Quantity 0 is rejected. The rule allows whole quantities from 1 to 10.',
      actual: 'Quantity 0 is accepted. The lower boundary check is off by one.',
      evidence: 'Reproducible every time on this page. The boundary suite reports 5 of 6 checks passed on the original build and 6 of 6 on the patched build.',
      live: true
    },
    {
      id: 'BUG-102', severity: 'High', status: 'Open · fix verification pending',
      title: 'Target-zoom replay shows the impact away from the recorded point of aim',
      area: 'Simulator · Session replay',
      steps: ['Record a firing session.', 'Capture the live point of aim and the displayed impact.', 'Replay the same event at the same range with target zoom.', 'Compare the live frame with the replay frame.'],
      expected: 'The replay shows the impact at the same position relative to the point of aim as the live session.',
      actual: 'The replay shows a mismatch between the point of aim and the displayed impact.',
      evidence: 'Paired live and replay frames, with the replay camera position noted for each.'
    },
    {
      id: 'BUG-103', severity: 'Medium', status: 'Open · cause under investigation',
      title: 'Winium tests raise NoSuchElementException on the 64-bit build only',
      area: 'Windows desktop automation · Winium',
      steps: ['Run the same Java test against the 32-bit build.', 'Run it again against the 64-bit build.', 'Inspect the accessibility tree for the first control that is not found.', 'Compare the locator, window context and timing between the two builds.'],
      expected: 'The same locators resolve the same controls in both builds.',
      actual: 'A subset of controls is located in the 32-bit build and raises NoSuchElementException in the 64-bit build.',
      evidence: 'Test logs from both builds and accessibility-tree captures for the first missing control.'
    }
  ],

  /* ---------- Resume page (resume.html) ---------- */
  resumePage: {
    summary: 'Software Quality Engineer with around {years} years of experience in automation and manual testing of desktop, VR, and web applications. Experienced in Hybrid frameworks using Java, Selenium WebDriver, TestNG, and Maven. Skilled in Page Object Model (POM) and Apache POI for external test data and configuration-based execution. Hands-on with defense and VR simulators built in C#, Unreal Engine (4.2, 5.1), and Reality Engine, emphasizing long-duration stability and immersive interactions.',
    skillGroups: [
      { label: 'Automation tools', items: 'Selenium WebDriver, Winium, TestNG, Maven, SVN' },
      { label: 'Programming', items: 'Java, SQL, Python, JavaScript' },
      { label: 'Frameworks', items: 'Hybrid, Data-Driven, Keyword-Driven, Page Object Model (POM)' },
      { label: 'Test management', items: 'TFS, JIRA' },
      { label: 'Testing types', items: 'Regression, Functional, System, Endurance, Integration, Smoke, UAT' },
      { label: 'Other', items: 'InstallShield, Batch Scripting, Apache POI, JavaMail API, Windows UI Automation, OCR, Local LLMs (Ollama), Prompt Engineering' }
    ],
    experience: [
      {
        role: 'Software Test Engineer', company: 'Zen Technologies Ltd, Hyderabad', when: 'Nov 2021 – Present',
        // OPTIONAL: real, measurable results. Each one is shown first, in bold, on the resume page. Leave [] until you have them.
        results: [],
        highlights: [
          'Executed functional, regression, smoke, sanity, system, and UAT test suites across desktop and VR defense simulator modules with full requirement traceability.',
          'Built Hybrid automation frameworks using Java, Selenium WebDriver, TestNG, and Maven with POM for readable page objects and maintainable locators.',
          'Implemented Apache POI for reading Excel/property files to enable configuration-based and reusable test execution.',
          'Developed and validated MSI installers using InstallShield and batch scripts; handled fresh installs, upgrades, and on-site troubleshooting.',
          'Collaborated with SMEs, developers, and Scrum teams; logged reproducible defects in JIRA/TFS with evidence and environment notes.',
          'Conducted client demos and knowledge transfers, including VR walkthroughs, ensuring environment readiness.'
        ]
      }
    ],
    education: [
      { title: 'B.Tech in Electrical and Electronics Engineering', where: 'Mallareddy Institute of Engineering and Technology, JNTUH', when: '2015 – 2019' }
    ],
    certifications: [
      'Project Management Professional · Coursera (2025)',
      'Prompt Engineering for Generative AI · Coursera (2025)',
      'ISTQB Foundation Level · in progress'
    ],
    awards: [
      'Key Contributor Award (2022) · automating simulator test flows and stabilizing long-duration checks',
      'Excellence in QA (2023) · consistent defect reproduction, documentation and collaboration',
      'Innovation in Automation (2024) · reusable POM components and configuration-driven execution',
      'Process Improvement Award (2024) · POI-based Excel consolidation that reduced manual reporting'
    ]
  }
};
