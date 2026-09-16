"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildFpsPayload, decodeFpsPayload, validateFps, type FpsPayee } from "@/lib/fpsQr";

/**
 * FPS (轉數快) payment QR generator. Everything runs in the browser: the payee
 * details never reach the server, which is the honest claim to make about a
 * page that asks for payment identifiers.
 */

export type FpsLabels = {
  payeeType: string;
  fpsId: string;
  fpsIdHint: string;
  mobile: string;
  mobileHint: string;
  email: string;
  emailHint: string;
  payeeValue: string;
  bankCode: string;
  bankCodeHint: string;
  amount: string;
  amountHint: string;
  currency: string;
  merchantName: string;
  merchantNameHint: string;
  billNumber: string;
  billNumberHint: string;
  preview: string;
  empty: string;
  download: string;
  copy: string;
  copied: string;
  inside: string;
  insideHint: string;
  privacy: string;
  errors: Record<string, string>;
  fieldNames: Record<string, string>;
};

export const fpsLabelsEn: FpsLabels = {
  payeeType: "How do people pay you?",
  fpsId: "FPS ID",
  fpsIdHint: "The 7–9 digit FPS identifier your bank issued.",
  mobile: "Mobile number",
  mobileHint: "The Hong Kong mobile registered with FPS, e.g. 9123 4567.",
  email: "Email address",
  emailHint: "The email address registered with FPS.",
  payeeValue: "Your FPS identifier",
  bankCode: "Bank code (optional)",
  bankCodeHint: "3-digit clearing code, if your mobile or email is registered with more than one bank.",
  amount: "Amount (optional)",
  amountHint: "Leave empty for a reusable code the payer types the amount into.",
  currency: "Currency",
  merchantName: "Name shown to the payer (optional)",
  merchantNameHint: "Up to 25 characters. Left as NA when empty.",
  billNumber: "Invoice / order number (optional)",
  billNumberHint: "Letters, numbers and hyphens. Not every bank app displays it.",
  preview: "Your FPS QR code",
  empty: "Enter your FPS ID, mobile or email and the code appears here.",
  download: "Download PNG",
  copy: "Copy code content",
  copied: "Copied",
  inside: "What's inside this code",
  insideHint: "The payload follows the HKMA/HKICL Common QR Code Specification.",
  privacy: "Generated entirely in your browser. Nothing is uploaded, stored or logged.",
  errors: {
    "empty-payee": "Enter your FPS ID, mobile number or email.",
    "fps-id": "An FPS ID is 7 to 9 digits.",
    mobile: "Enter a Hong Kong mobile number, e.g. 9123 4567.",
    email: "That doesn't look like an email address.",
    "bank-code": "A bank clearing code is 3 digits, e.g. 004.",
    amount: "Enter an amount like 250 or 58.50.",
    "merchant-name": "Keep the name to 25 characters or fewer.",
    "bill-number": "Use letters, numbers and hyphens only.",
  },
  fieldNames: {
    "00": "Payload format",
    "01": "Type (11 = any amount, 12 = fixed amount)",
    "26": "FPS payee details",
    "52": "Merchant category",
    "53": "Currency",
    "54": "Amount",
    "58": "Country",
    "59": "Name shown",
    "60": "City",
    "62": "Additional data",
    "63": "Checksum",
  },
};

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

type PayeeType = FpsPayee["type"];

export function FpsQrGenerator({ labels = fpsLabelsEn }: { labels?: FpsLabels }) {
  const t = labels;
  const [type, setType] = useState<PayeeType>("fpsId");
  const [value, setValue] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"344" | "156">("344");
  const [merchantName, setMerchantName] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [rendered, setRendered] = useState<{ payload: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const input = {
    payee: { type, value, ...(type === "fpsId" ? {} : { bankCode: bankCode.trim() || undefined }) } as FpsPayee,
    amount: amount.trim() || undefined,
    currency,
    merchantName: merchantName.trim() || undefined,
    billNumber: billNumber.trim() || undefined,
  };
  const problem = validateFps(input);
  const payload = problem ? "" : buildFpsPayload(input);
  const showError = value.trim().length > 0 && problem && problem !== "empty-payee";

  // The rendered image is tagged with the payload it belongs to, so a stale
  // code is never shown and the effect never sets state synchronously.
  useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    QRCode.toDataURL(payload, { margin: 2, width: 900, errorCorrectionLevel: "M" })
      .then((url) => {
        if (!cancelled) setRendered({ payload, url });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [payload]);

  const png = rendered && rendered.payload === payload ? rendered.url : "";

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const label = type === "fpsId" ? t.fpsId : type === "mobile" ? t.mobile : t.email;
  const hint = type === "fpsId" ? t.fpsIdHint : type === "mobile" ? t.mobileHint : t.emailHint;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className="annotation mb-3">{t.payeeType}</legend>
          <div className="flex flex-wrap gap-2.5">
            {(["fpsId", "mobile", "email"] as const).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={type === id}
                onClick={() => setType(id)}
                className={`border px-4 py-2.5 text-sm transition-colors ${
                  type === id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {id === "fpsId" ? t.fpsId : id === "mobile" ? t.mobile : t.email}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="fps-value" className="annotation mb-2 block">
            {label}
          </label>
          <input
            id="fps-value"
            className={inputCls}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode={type === "fpsId" ? "numeric" : type === "mobile" ? "tel" : "email"}
            placeholder={type === "fpsId" ? "1234567" : type === "mobile" ? "9123 4567" : "pay@example.com"}
            aria-describedby="fps-value-hint"
          />
          <p id="fps-value-hint" className="mt-2 text-xs leading-relaxed text-faint">
            {hint}
          </p>
          {showError && <p className="mt-2 text-sm text-[#b42318]">{t.errors[problem] ?? problem}</p>}
        </div>

        {type !== "fpsId" && (
          <div>
            <label htmlFor="fps-bank" className="annotation mb-2 block">
              {t.bankCode}
            </label>
            <input
              id="fps-bank"
              className={inputCls}
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              inputMode="numeric"
              placeholder="004"
            />
            <p className="mt-2 text-xs leading-relaxed text-faint">{t.bankCodeHint}</p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fps-amount" className="annotation mb-2 block">
              {t.amount}
            </label>
            <input
              id="fps-amount"
              className={inputCls}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="250"
            />
            <p className="mt-2 text-xs leading-relaxed text-faint">{t.amountHint}</p>
          </div>
          <div>
            <label htmlFor="fps-currency" className="annotation mb-2 block">
              {t.currency}
            </label>
            <select
              id="fps-currency"
              className={inputCls}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "344" | "156")}
            >
              <option value="344">HKD</option>
              <option value="156">CNY</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fps-name" className="annotation mb-2 block">
              {t.merchantName}
            </label>
            <input
              id="fps-name"
              className={inputCls}
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              maxLength={25}
              placeholder="KODINAV"
            />
            <p className="mt-2 text-xs leading-relaxed text-faint">{t.merchantNameHint}</p>
          </div>
          <div>
            <label htmlFor="fps-bill" className="annotation mb-2 block">
              {t.billNumber}
            </label>
            <input
              id="fps-bill"
              className={inputCls}
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="INV-2026-014"
            />
            <p className="mt-2 text-xs leading-relaxed text-faint">{t.billNumberHint}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-5 border border-line-strong bg-surface-raised p-6 sm:p-8">
          <p className="annotation self-start">{t.preview}</p>
          {png ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URL generated in the browser */}
              <img src={png} alt={t.preview} width={260} height={260} className="size-[260px] max-w-full" />
              <div className="flex w-full flex-col gap-2.5 sm:flex-row">
                <a
                  href={png}
                  download="fps-qr-code.png"
                  className="inline-flex flex-1 items-center justify-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5"
                >
                  {t.download}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(payload).then(() => setCopied(true));
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.14em] uppercase transition-colors hover:border-accent hover:text-accent"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-sm leading-relaxed text-muted">{t.empty}</p>
          )}
          <p className="text-xs leading-relaxed text-faint">{t.privacy}</p>
        </div>

        {payload && (
          <details className="border border-line p-5">
            <summary className="cursor-pointer text-sm font-medium text-foreground">{t.inside}</summary>
            <p className="mt-2 text-xs leading-relaxed text-faint">{t.insideHint}</p>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              {decodeFpsPayload(payload).map((f) => (
                <div key={f.id} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-muted">
                    <span className="font-mono text-xs text-faint">{f.id}</span> {t.fieldNames[f.id] ?? ""}
                  </dt>
                  <dd className="break-all text-right font-mono text-xs text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 break-all font-mono text-[0.7rem] leading-relaxed text-faint">{payload}</p>
          </details>
        )}
      </div>
    </div>
  );
}
