import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { build, root } from "./build.mjs";
await build();
let timer;
fs.watch(path.join(root, "src"), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => build().catch(console.error), 150);
});
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4182);
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400);
      return res.end();
    }
    const file = path.resolve(
      dist,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!file.startsWith(dist + path.sep)) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html; charset=utf-8",
          ".js": "text/javascript; charset=utf-8",
          ".css": "text/css; charset=utf-8",
        }[path.extname(file)] || "text/plain",
      );
      res.setHeader("Cache-Control", "no-store");
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`本機預覽：http://127.0.0.1:${port}`),
  );
