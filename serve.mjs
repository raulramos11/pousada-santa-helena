// Servidor estático mínimo para preview local.
//   node serve.mjs [porta]             -> serve até ser encerrado (use preview.ps1 para rodar desacoplado)
//   node serve.mjs [porta] --selftest  -> sobe, faz GET nas páginas principais, imprime o status e SAI
import { createServer } from 'node:http';
import { createReadStream, stat } from 'node:fs';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Raiz = pasta deste arquivo (não o cwd), para funcionar mesmo iniciado de outro diretório.
const root = resolve(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const selftest = args.includes('--selftest');
const port = Number(args.find((a) => /^\d+$/.test(a))) || 8081;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp',
};

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403).end('Forbidden'); return; }
  if (urlPath.endsWith('/')) file = join(file, 'index.html');
  stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': st.size });
    createReadStream(file).on('error', (e) => { console.error(e); res.destroy(e); }).pipe(res);
  });
});

server.on('error', (e) => { console.error(`Falha ao abrir a porta ${port}: ${e.message}`); process.exit(1); });

server.listen(port, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${port}`;
  console.log(base);
  if (!selftest) return;
  const paths = ['/', '/css/style.css', '/css/sections.css', '/js/main.js', '/img/logo.png'];
  let ok = true;
  for (const p of paths) {
    const r = await fetch(base + p);
    console.log(`${r.status} ${p}`);
    if (r.status !== 200) ok = false;
  }
  // Sai de forma graciosa: process.exit() com sockets do fetch ainda fechando
  // dispara uma assertion do libuv no Windows.
  process.exitCode = ok ? 0 : 1;
  server.close();
  server.closeAllConnections();
});
