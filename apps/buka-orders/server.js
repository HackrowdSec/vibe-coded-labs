// Buka Orders: a SAMPLE app for a live talk demo. Runs on 127.0.0.1 only.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { users } = require("./db");
const orders = require("./routes/orders");

const sessions = new Map(); // token -> userId

function send(res, status, body, headers = {}) {
  const isJson = typeof body !== "string";
  res.writeHead(status, { "content-type": isJson ? "application/json" : "text/html; charset=utf-8", ...headers });
  res.end(isJson ? JSON.stringify(body) : body);
}
function readJson(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch { resolve({}); } });
  });
}
function currentUser(req) {
  const m = (req.headers.cookie || "").match(/(?:^|;\s*)session=([a-f0-9]+)/);
  const userId = m && sessions.get(m[1]);
  return users.find((u) => u.id === userId) || null;
}

async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/") {
    return send(res, 200, fs.readFileSync(path.join(__dirname, "public/index.html"), "utf8"));
  }
  if (req.method === "POST" && url.pathname === "/api/login") {
    const { email, password } = await readJson(req);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return send(res, 401, { error: "Wrong email or password" });
    const token = crypto.randomBytes(16).toString("hex");
    sessions.set(token, user.id);
    return send(res, 200, { name: user.name, role: user.role }, { "set-cookie": `session=${token}; HttpOnly; SameSite=Lax; Path=/` });
  }
  if (req.method === "GET" && url.pathname === "/api/me") {
    const user = currentUser(req);
    if (!user) return send(res, 401, { error: "Not signed in" });
    return send(res, 200, { name: user.name, role: user.role });
  }

  const handled = await orders.route(req, res, { url, user: currentUser(req), send, readJson });
  if (handled !== false) return;

  send(res, 404, { error: "Not found" });
}

function createServer() { return http.createServer((req, res) => handle(req, res).catch(() => send(res, 500, { error: "Server error" }))); }

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, "127.0.0.1", () => console.log(`Buka Orders (sample) on http://localhost:${port}`));
}
module.exports = { createServer, sessions };
