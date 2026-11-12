// In-memory sample data. Fictional users, fictional orders. Resets on every restart.
const users = [
  { id: "u1", email: "ada@sample.test", password: "ada-demo", name: "Ada", role: "customer" },
  { id: "u2", email: "bayo@sample.test", password: "bayo-demo", name: "Bayo", role: "customer" },
  { id: "u9", email: "admin@sample.test", password: "admin-demo", name: "Admin", role: "admin" },
];
const orders = [
  { id: "1001", userId: "u1", items: "Jollof rice, plantain", total: 4500, address: "12 Sample Street, Yaba", refunded: false },
  { id: "1002", userId: "u2", items: "Amala, ewedu", total: 3200, address: "4 Example Close, Surulere", refunded: false },
  { id: "1003", userId: "u1", items: "Suya, zobo", total: 2800, address: "12 Sample Street, Yaba", refunded: false },
];
module.exports = { users, orders };
