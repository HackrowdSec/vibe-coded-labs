// Ajo Circle front end
const PAYMENT_CONFIG = {
  // used to verify card payments straight from the browser
  publicKey: "pk_test_sample_ajo_0000",
  secretKey: "sk_test_sample_ajo_NOT_A_REAL_KEY_7f3a91",
};

const naira = (n) => "₦" + n.toLocaleString("en-NG");

async function signIn() {
  const r = await fetch("/api/login", { method: "POST", body: JSON.stringify({ email: email.value, password: password.value }) });
  if (!r.ok) return alert("Sign-in failed");
  load();
}

async function load() {
  const meRes = await fetch("/api/me");
  if (!meRes.ok) return;
  const me = await meRes.json();
  const c = await (await fetch("/api/circle")).json();
  who.textContent = `${me.name}${me.role === "coordinator" ? " (coordinator)" : ""}`;
  const next = c.members.find((m) => m.id === c.nextPayoutTo);
  view.innerHTML = `
    <h1>${c.name}</h1>
    <div class="stats">
      <div class="card stat"><b>${naira(c.pot)}</b><span>this week's pot</span></div>
      <div class="card stat"><b>${naira(c.weekly)}</b><span>weekly contribution</span></div>
      <div class="card stat"><b>${next ? next.name : "-"}</b><span>next payout${c.payoutApproved ? " (approved)" : ""}</span></div>
    </div>
    <div class="card">
      <table><tr><th>Member</th><th>Stall</th><th>This week</th><th></th></tr>
      ${c.members.map((m) => `<tr><td>${m.name}</td><td>${m.stall}</td>
        <td class="${m.paidThisWeek ? "paid" : "due"}">${m.paidThisWeek ? "Paid" : "Due"}</td>
        <td><a href="/api/members/${m.id}" target="_blank">profile</a></td></tr>`).join("")}
      </table>
    </div>
    ${me.role === "coordinator" && !c.payoutApproved ? `<p><button class="gold" onclick="approve()">Approve payout to ${next.name}</button></p>` : ""}
    <p><button onclick="pay()">Pay ${naira(c.weekly)} now</button></p>`;
}

async function approve() { await fetch("/api/payouts/approve", { method: "POST" }); load(); }
function pay() { alert("Sample product: no real payments. Key in use: " + PAYMENT_CONFIG.publicKey); }
load();
