/**
 * Hong Kong FPS (轉數快) payment QR payloads.
 *
 * Follows the Common QR Code Specification for Retail Payments in Hong Kong
 * (HKMA / HKICL), which is EMVCo's merchant-presented QR with a Hong Kong
 * merchant-account template:
 *
 *   00  payload format indicator          "01"
 *   01  point of initiation               "11" static (no amount) / "12" with amount
 *   26  FPS merchant account template
 *         00  globally unique identifier  "hk.com.hkicl"
 *         01  clearing (bank) code        optional, with a mobile or email proxy
 *         02  FPS ID                      7–9 digits
 *         03  mobile number               "+852XXXXXXXX"
 *         04  email                       upper-cased
 *   52  merchant category code            "0000" when not a classified merchant
 *   53  transaction currency              344 HKD / 156 CNY
 *   54  transaction amount                optional
 *   58  country code                      "HK"
 *   59  merchant name                     ≤25 chars, "NA" when unknown
 *   60  merchant city                     "HK"
 *   62  additional data (01 = bill number)
 *   63  CRC-16/CCITT-FALSE over everything including the "6304" header
 *
 * Verified against the published test vector (FPS ID 9999999, HK$123) and
 * cross-checked against three independent open-source implementations — see
 * scripts/test-fps-qr.mjs, which fails the build's own check if this drifts.
 */

export type FpsPayee =
  | { type: "fpsId"; value: string }
  | { type: "mobile"; value: string; bankCode?: string }
  | { type: "email"; value: string; bankCode?: string };

export type FpsQrInput = {
  payee: FpsPayee;
  /** Decimal string, e.g. "123" or "58.50". Omit for a reusable, any-amount code. */
  amount?: string;
  currency?: "344" | "156";
  /** Shown by some bank apps. ≤25 characters; "NA" when you'd rather not say. */
  merchantName?: string;
  merchantCity?: string;
  /** Invoice or order number (tag 62-01). Support varies by bank app. */
  billNumber?: string;
};

/** EMV data object: 2-digit id, 2-digit length, value. */
const field = (id: string, value: string) => `${id}${String(value.length).padStart(2, "0")}${value}`;

/** CRC-16/CCITT-FALSE: poly 0x1021, init 0xFFFF, no reflection, no final XOR. */
export function crc16(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export const FPS_ID_RE = /^\d{7,9}$/;
export const HK_MOBILE_RE = /^(\+?852)?[2-9]\d{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AMOUNT_RE = /^\d{1,10}(\.\d{1,2})?$/;

/** Human-readable validation problem, or null when the input can be encoded. */
export function validateFps(input: FpsQrInput): string | null {
  const { payee } = input;
  const value = payee.value.trim();
  if (!value) return "empty-payee";
  if (payee.type === "fpsId" && !FPS_ID_RE.test(value)) return "fps-id";
  if (payee.type === "mobile" && !HK_MOBILE_RE.test(value.replace(/[\s-]/g, ""))) return "mobile";
  if (payee.type === "email" && !EMAIL_RE.test(value)) return "email";
  if (payee.type !== "fpsId" && payee.bankCode && !/^\d{3}$/.test(payee.bankCode)) return "bank-code";
  if (input.amount && !AMOUNT_RE.test(input.amount)) return "amount";
  if (input.amount && Number(input.amount) <= 0) return "amount";
  if (input.merchantName && input.merchantName.length > 25) return "merchant-name";
  if (input.billNumber && !/^[A-Za-z0-9-]{1,25}$/.test(input.billNumber)) return "bill-number";
  return null;
}

/** The QR payload string. Throws if the input is invalid — validate first. */
export function buildFpsPayload(input: FpsQrInput): string {
  const problem = validateFps(input);
  if (problem) throw new Error(`Invalid FPS QR input: ${problem}`);

  const { payee } = input;
  let account = field("00", "hk.com.hkicl");
  if (payee.type === "fpsId") {
    account += field("02", payee.value.trim());
  } else {
    if (payee.bankCode) account += field("01", payee.bankCode);
    if (payee.type === "mobile") {
      const digits = payee.value.replace(/[\s-]/g, "").replace(/^\+?852/, "");
      account += field("03", `+852${digits}`);
    } else {
      account += field("04", payee.value.trim().toUpperCase());
    }
  }

  const parts = [
    field("00", "01"),
    field("01", input.amount ? "12" : "11"),
    field("26", account),
    field("52", "0000"),
    field("53", input.currency ?? "344"),
    ...(input.amount ? [field("54", input.amount)] : []),
    field("58", "HK"),
    field("59", (input.merchantName?.trim() || "NA").slice(0, 25)),
    field("60", (input.merchantCity?.trim() || "HK").slice(0, 15)),
    ...(input.billNumber ? [field("62", field("01", input.billNumber))] : []),
  ];

  const payload = `${parts.join("")}6304`;
  return payload + crc16(payload);
}

/** Split a payload back into readable fields — powers the "what's inside" panel. */
export function decodeFpsPayload(payload: string): { id: string; value: string }[] {
  const out: { id: string; value: string }[] = [];
  let i = 0;
  while (i + 4 <= payload.length) {
    const id = payload.slice(i, i + 2);
    const length = Number(payload.slice(i + 2, i + 4));
    if (!Number.isFinite(length)) break;
    out.push({ id, value: payload.slice(i + 4, i + 4 + length) });
    i += 4 + length;
  }
  return out;
}
