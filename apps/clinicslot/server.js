// ClinicSlot: online booking for private clinics. SAMPLE product for a talk. Runs on 127.0.0.1 only.
// The browser talks to the data API directly with the anon key (Supabase style). Access is decided by rules.json.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const db = require("./data");

const PORT = Number(process.env.PORT) || 3002;
const ANON_KEY = "anon_sample_clinicslot_public_key_0001";
const rules = JSON.parse(fs.readFileSync(path.join(__dirname, "rules.json"), "utf8"));

function send(res, status, body, type) {
  const json = typeof body !== "string";
  res.writeHead(status, { "content-type": json ? "application/json" : type || "text/html; charset=utf-8", "x-powered-by": "ClinicSlot/0.3.1 (Node 24)" });
  res.end(json ? JSON.stringify(body, null, 2) : body);
}
const readJson = (req) => new Promise((r) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { try { r(JSON.parse(b || "{}")); } catch { r({}); } }); });

async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname;

  const pages = { "/": "index.html", "/staff": "staff.html", "/app.js": "app.js", "/style.css": "style.css" };
  if (req.method === "GET" && pages[p]) {
    const f = pages[p];
    return send(res, 200, fs.readFileSync(path.join(__dirname, "public", f), "utf8"), f.endsWith(".js") ? "text/javascript" : f.endsWith(".css") ? "text/css" : undefined);
  }

  // Data API: /rest/v1/<table>
  const m = p.match(/^\/rest\/v1\/(\w+)$/);
  if (m) {
    if (req.headers.apikey !== ANON_KEY) return send(res, 401, { message: "Invalid API key" });
    const table = m[1], rule = rules[table];
    if (!rule || !db[table]) return send(res, 404, { message: "Unknown table" });
    if (req.method === "GET") {
      if (!rule.read) return send(res, 403, { message: "Permission denied" });
      return send(res, 200, db[table]);
    }
    if (req.method === "POST") {
      if (!rule.write) return send(res, 403, { message: "Permission denied" });
      const row = await readJson(req);
      row.id = Math.max(...db[table].map((r) => r.id)) + 1;
      db[table].push(row);
      return send(res, 201, row);
    }
  }
  send(res, 404, { message: "Not found" });
}

http.createServer((req, res) => handle(req, res).catch(() => send(res, 500, { message: "Server error" })))
  .listen(PORT, "127.0.0.1", () => console.log(`ClinicSlot (SAMPLE) on http://localhost:${PORT}`));
