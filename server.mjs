import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const requested = clean === "/" ? "/index.html" : clean;
  return normalize(join(root, requested));
}

createServer(async (req, res) => {
  try {
    const filePath = safePath(req.url || "/");
    const ext = extname(filePath);
    const finalPath = ext ? filePath : join(root, "index.html");
    const body = await readFile(finalPath);
    res.writeHead(200, { "Content-Type": types[extname(finalPath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    res.writeHead(200, { "Content-Type": types[".html"] });
    res.end(body);
  }
}).listen(port, () => {
  console.log(`Scribe AI demo running at http://localhost:${port}`);
});
