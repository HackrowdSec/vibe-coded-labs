// Ajo Circle: digital ajo for market traders. SAMPLE product for a talk. Runs on 127.0.0.1 only.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { members, circle } = require("./data");

const sessions = new Map();
const PORT = Number(process.env.PORT) || 3001;

function send(res, status, body, headers = {}) {
  const json = typeof body !== "string";
  res.writeHead(status, { "content-type": json ? "application/json" : headers.type || "text/html; charset=utf-8", ...headers });
  res.end(json ? JSON.stringify(body, null, 2) : body);
}
const readJson = (req) => new Promise((r) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { try { r(JSON.parse(b || "{}")); } catch { r({}); } }); });
function me(req) {
  const m = (req.headers.cookie || "").match(/(?:^|;\s*)ajo=([a-f0-9]+)/);
  return members.find((x) => x.id === (m && sessions.get(m[1]))) || null;
}
const publicView = (m) => ({ id: m.id, name: m.name, stall: m.stall, paidThisWeek: m.paidThisWeek });

async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname;

  if (req.method === "GET" && (p === "/" || p === "/app.js" || p === "/style.css")) {
    const file = p === "/" ? "index.html" : p.slice(1);
    const type = file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html; charset=utf-8";
    return send(res, 200, fs.readFileSync(path.join(__dirname, "public", file), "utf8"), { type });
  }

  if (req.method === "POST" && p === "/api/login") {
    const { email, password } = await readJson(req);
    const m = members.find((x) => x.email === email && x.password === password);
    if (!m) return send(res, 401, { error: "Wrong email or password" });
    const t = crypto.randomBytes(16).toString("hex");
    sessions.set(t, m.id);
    return send(res, 200, { name: m.name, role: m.role }, { "set-cookie": `ajo=${t}; HttpOnly; SameSite=Lax; Path=/` });
  }

  const user = me(req);
  if (p.startsWith("/api/") && !user) return send(res, 401, { error: "Please sign in" });

  if (req.method === "GET" && p === "/api/me") return send(res, 200, user);

  if (req.method === "GET" && p === "/api/circle") {
    return send(res, 200, { ...circle, members: members.map(publicView) });
  }

  // Member profile page
  const mm = p.match(/^\/api\/members\/(\w+)$/);
  if (req.method === "GET" && mm) {
    const m = members.find((x) => x.id === mm[1]);
    if (!m) return send(res, 404, { error: "Not found" });
    const { password, ...profile } = m;
    return send(res, 200, profile);
  }

  // Coordinator approves this week's payout (button only shown to coordinators)
  if (req.method === "POST" && p === "/api/payouts/approve") {
    circle.payoutApproved = true;
    return send(res, 200, { ok: true, paidTo: circle.nextPayoutTo, amount: circle.pot });
  }

  send(res, 404, { error: "Not found" });
}

http.createServer((req, res) => handle(req, res).catch(() => send(res, 500, { error: "Server error" })))
  .listen(PORT, "127.0.0.1", () => console.log(`Ajo Circle (SAMPLE) on http://localhost:${PORT}`));
