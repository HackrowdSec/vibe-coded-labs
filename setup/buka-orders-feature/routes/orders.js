// Orders API, feat/orders branch: "add order detail page and admin refunds" (AI-generated).
const { orders } = require("../db");

async function route(req, res, { url, user, send, readJson }) {
  if (req.method === "GET" && url.pathname === "/api/orders") {
    if (!user) return send(res, 401, { error: "Not signed in" });
    return send(res, 200, orders.filter((o) => o.userId === user.id));
  }

  // Order detail page
  const m = url.pathname.match(/^\/api\/orders\/(\w+)$/);
  if (req.method === "GET" && m) {
    if (!user) return send(res, 401, { error: "Not signed in" });
    const order = orders.find((o) => o.id === m[1]);
    if (!order) return send(res, 404, { error: "Not found" });
    return send(res, 200, order);
  }

  // Refund button (only shown to admins in the UI)
  if (req.method === "POST" && url.pathname === "/api/refund") {
    if (!user) return send(res, 401, { error: "Not signed in" });
    const { orderId } = await readJson(req);
    const order = orders.find((o) => o.id === orderId);
    if (!order) return send(res, 404, { error: "Not found" });
    order.refunded = true;
    return send(res, 200, { ok: true, orderId });
  }
  return false;
}
module.exports = { route };
