// server.js — CommonJS (no "type":"module" needed)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.options("*", cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

// If Node v18+ you have global fetch; else polyfill dynamically:
const fetchFn = global.fetch || ((...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))
);

const PORT = process.env.PORT || 4242;
const GELATO_BASE = "https://order.gelatoapis.com";
const GELATO_API_KEY = process.env.GELATO_API_KEY || "";

// tiny logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => res.type("text").send("OK /"));
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.post("/api/gelato/create-order", async (req, res) => {
  try {
    if (!GELATO_API_KEY) return res.status(500).json({ error: "Missing GELATO_API_KEY in .env" });

    const payload = req.body;
    if (!payload?.items?.length) return res.status(400).json({ error: "No items provided" });
    if (!payload?.shipping?.country) return res.status(400).json({ error: "Missing shipping address" });

    const gelatoReq = {
      orderType: "order",
      orderReferenceId: payload.orderId,
      customerReferenceId: payload.customerId,
      currency: payload.currency || "EUR",
      items: payload.items,
      shippingAddress: payload.shipping,
      shipmentMethodUid: payload.items?.[0]?.shipmentMethodUid || "standard",
      metadata: [{ key: "channel", value: "localhost-dev" }]
    };

    const r = await fetchFn(`${GELATO_BASE}/v4/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": GELATO_API_KEY },
      body: JSON.stringify(gelatoReq)
    });

    const text = await r.text();
    if (!r.ok) {
      console.error("[Gelato error]", r.status, text);
      return res.status(r.status).json({ ok: false, error: "gelato_error", status: r.status, detail: text });
    }
    res.json({ ok: true, gelato: JSON.parse(text) });
  } catch (err) {
    console.error("[Server catch]", err);
    res.status(500).json({ ok: false, error: "server_error", detail: String(err?.message || err) });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API running: http://localhost:${PORT}`);
  console.log(`[env] GELATO_API_KEY present?`, !!process.env.GELATO_API_KEY);
});
