import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp3':'audio/mpeg','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    const relative = path.relative(root,file);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p => p.startsWith('.') || p === 'node_modules')) {res.writeHead(403);res.end();return;}
    let info;
    try {info = await stat(file);if (info.isDirectory()) {file = path.join(file,'index.html');info = await stat(file);}}
    catch {file = path.join(root,'404.html');info = await stat(file);res.statusCode = 404;}
    res.setHeader('Content-Type',types[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Accept-Ranges','bytes');
    const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
    let start = 0, end = info.size - 1;
    if (range) {start = Number(range[1]);end = range[2] ? Math.min(Number(range[2]),end) : end;
      if (start > end) {res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}
      res.statusCode = 206;res.setHeader('Content-Range',`bytes ${start}-${end}/${info.size}`);
    }
    res.setHeader('Content-Length',end-start+1);
    if (req.method === 'HEAD') {res.end();return;}
    createReadStream(file,{start,end}).pipe(res);
  } catch {res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',() => console.log(`SeattleVO preview: http://127.0.0.1:${port}`));
