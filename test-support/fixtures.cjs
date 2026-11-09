// Test-only stock-price fixture. Never contacts the upstream proxy.
process.env.NODE_ENV = "test";
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const file = join(__dirname, "../data/test-likes.json");
const original = readFileSync(file);
writeFileSync(file, "{}");
process.on("exit", () => writeFileSync(file, original));
process.once("SIGTERM", () => process.exit(0));
process.once("SIGINT", () => process.exit(0));
global.fetch = async url => {
  const parsed = new URL(url);
  if (parsed.origin !== "https://stock-price-checker-proxy.freecodecamp.rocks") {
    throw new Error("Unexpected network call in stock-price fixture");
  }
  const symbol = parsed.pathname.split("/")[3];
  return { json: async () => ({ latestPrice: symbol === "GOOG" ? 100 : 120 }) };
};
