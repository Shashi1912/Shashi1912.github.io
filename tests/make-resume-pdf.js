// Rebuilds the downloadable resume PDF from resume.html, so the PDF always matches config/site-config.js.
// Usage (from the PortFolio folder): node tests/make-resume-pdf.js
// Writes assets/Shashikumar_Angajala_Resume.pdf. Point `resume` in config/site-config.js at it.
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('@playwright/test');

const PORT = 8841, root = path.resolve(__dirname, '..');
const out = path.join(root, 'assets', 'Shashikumar_Angajala_Resume.pdf');

(async () => {
  const server = spawn(process.execPath, [path.join(__dirname, 'serve.js'), String(PORT)], { stdio: 'ignore' });
  try {
    await new Promise(r => setTimeout(r, 800));
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:' + PORT + '/resume.html', { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: out, format: 'A4', printBackground: false, preferCSSPageSize: true });
    await browser.close();
    console.log('wrote ' + path.relative(root, out));
  } finally { server.kill(); }
})();
