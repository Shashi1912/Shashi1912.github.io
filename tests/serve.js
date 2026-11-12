// Tiny static file server for the tests (no dependencies). Usage: node tests/serve.js [port]
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), port = +process.argv[2] || 8791;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf' };
http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]); if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on http://127.0.0.1:' + port));
