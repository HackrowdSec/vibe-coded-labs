// Orders API, baseline (main branch): a signed-in customer can list only their own orders.
const { orders } = require("../db");

async function route(req, res, { url, user, send }) {
  if (req.method === "GET" && url.pathname === "/api/orders") {
    if (!user) return send(res, 401, { error: "Not signed in" });
    return send(res, 200, orders.filter((o) => o.userId === user.id));
  }
  return false;
}
module.exports = { route };
