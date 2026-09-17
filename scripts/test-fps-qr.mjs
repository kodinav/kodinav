#!/usr/bin/env node
/**
 * Correctness check for the FPS QR payload builder.
 *
 * A wrong payment QR sends money to the wrong place, so this runs the builder
 * against the published test vector and the canonical EMVCo CRC example.
 * Run with: node --experimental-strip-types scripts/test-fps-qr.mjs
 */
import { buildFpsPayload, crc16, decodeFpsPayload } from "../src/lib/fpsQr.ts";

let failures = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) console.log(`      expected ${expected}\n      actual   ${actual}`);
};

// 1. CRC-16/CCITT-FALSE against its canonical check value
check("CRC-16/CCITT-FALSE check value", crc16("123456789"), "29B1");

// 2. Published FPS test vector: FPS ID 9999999, HK$123.
//    The vector's own trailing checksum ("84E1") is stale — the library that
//    publishes it recomputes the CRC at runtime with binascii.crc_hqx(x,
//    0xffff), which returns D1A3 for this payload, as do the JS libraries and
//    this implementation. So the structure is asserted against the vector and
//    the checksum against four agreeing implementations.
const vectorBody = "00020101021226270012hk.com.hkicl0207999999952040000530334454031235802HK5902NA6002HK6304";
const vector = buildFpsPayload({ payee: { type: "fpsId", value: "9999999" }, amount: "123" });
check("FPS test vector — field structure", vector.slice(0, -4), vectorBody);
check("FPS test vector — checksum", vector.slice(-4), "D1A3");

// 3. Static code (no amount) must use point-of-initiation 11 and carry a valid CRC
const staticPayload = buildFpsPayload({ payee: { type: "fpsId", value: "9999999" } });
check("static code point-of-initiation", decodeFpsPayload(staticPayload).find((f) => f.id === "01")?.value, "11");
check("static code CRC self-consistent", crc16(staticPayload.slice(0, -4)), staticPayload.slice(-4));

// 4. Mobile and email proxies
const mobile = buildFpsPayload({ payee: { type: "mobile", value: "9123 4567" }, amount: "58.50" });
check("mobile proxy normalised", decodeFpsPayload(decodeFpsPayload(mobile).find((f) => f.id === "26").value).find((f) => f.id === "03")?.value, "+85291234567");
check("amount preserved", decodeFpsPayload(mobile).find((f) => f.id === "54")?.value, "58.50");
const email = buildFpsPayload({ payee: { type: "email", value: "pay@example.com", bankCode: "004" } });
const emailAccount = decodeFpsPayload(decodeFpsPayload(email).find((f) => f.id === "26").value);
check("email upper-cased", emailAccount.find((f) => f.id === "04")?.value, "PAY@EXAMPLE.COM");
check("clearing code kept", emailAccount.find((f) => f.id === "01")?.value, "004");

// 5. Merchant name, city and bill number
const full = buildFpsPayload({ payee: { type: "fpsId", value: "123456789" }, amount: "12", merchantName: "KODINAV", merchantCity: "Kowloon", billNumber: "INV-2026-01" });
check("merchant name", decodeFpsPayload(full).find((f) => f.id === "59")?.value, "KODINAV");
check("merchant city", decodeFpsPayload(full).find((f) => f.id === "60")?.value, "Kowloon");
check("bill number", decodeFpsPayload(decodeFpsPayload(full).find((f) => f.id === "62").value).find((f) => f.id === "01")?.value, "INV-2026-01");
check("full payload CRC self-consistent", crc16(full.slice(0, -4)), full.slice(-4));

console.log(failures ? `\n${failures} check(s) failed` : "\nAll FPS QR checks passed");
process.exit(failures ? 1 : 0);
