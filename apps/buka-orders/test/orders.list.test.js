// Baseline test: the order list only shows your own orders.
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const { createServer } = require("../server");

let server, base;
before(async () => {
  server = createServer();
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test("order list shows only my orders", async () => {
  const login = await fetch(`${base}/api/login`, { method: "POST", body: JSON.stringify({ email: "ada@sample.test", password: "ada-demo" }) });
  const cookie = login.headers.get("set-cookie").split(";")[0];
  const list = await (await fetch(`${base}/api/orders`, { headers: { cookie } })).json();
  assert.ok(list.length > 0 && list.every((o) => o.userId === "u1"));
});
