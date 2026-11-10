import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3215";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Use a local test server only.");
const results = [];
for (const id of ["terms", "privacy", "shipping", "return", "accessibility", "cookies"]) {
  const response = await fetch(`${base}/policies/${id}`);
  assert.equal(response.status, 200, `${id} page`);
  const html = await response.text();
  assert.ok(html.includes("policy-body"), `${id} has policy content`);
  assert.ok(!response.headers.get("set-cookie")?.includes("storely_visitor="), "No analytics identifier before a choice");
  results.push(`${id}: 200, content present, no analytics cookie`);
}
for (const cookie of ["", "sl_cookie_consent=v1:essential"]) {
  const response = await fetch(`${base}/api/storely/event`, { method: "POST", headers: { "content-type": "application/json", cookie }, body: JSON.stringify({ event: "add_to_cart", path: "/checkout" }) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("set-cookie"), null);
}
results.push("Tracking endpoint declines tracking without consent and with essential-only choice");
const accepted = await fetch(`${base}/policies/cookies?utm_source=legal-test`, { headers: { cookie: "sl_cookie_consent=v1:analytics" } });
const stored = accepted.headers.getSetCookie();
assert.ok(stored.some(cookie => cookie.startsWith("storely_visitor=")));
assert.ok(stored.some(cookie => cookie.startsWith("storely_attr=")));
// Regular document request, without RSC: exercises cookies without recording a page event.
results.push("Explicit analytics choice enables attribution cookies");
const denied = await fetch(`${base}/policies/cookies?utm_source=legal-test`, { headers: { cookie: "sl_cookie_consent=v1:essential; storely_attr=old" } });
assert.ok(denied.headers.get("set-cookie")?.includes("storely_attr=;"));
assert.ok(!denied.headers.get("set-cookie")?.includes("storely_visitor="));
results.push("Withdrawal clears attribution and stops new tracking cookies");
const order = await fetch(`${base}/api/storely/order`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lines: [{ variantId: "test-invalid-variant", quantity: 1 }], name: "בדיקה מקומית", email: "test@example.invalid", phone: "0500000000", city: "בדיקה", street: "בדיקה", shippingName: "משלוח רגיל", policies: ["privacy", "shipping"] }) });
assert.equal(order.status, 400);
assert.match((await order.json()).reason, /תקנון/);
results.push("Server rejects purchase without terms acceptance before contacting payment services");
console.log(results.join("\n"));
