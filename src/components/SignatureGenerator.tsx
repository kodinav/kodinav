"use client";

import { useState } from "react";

/**
 * Email signature generator — table-based HTML (the only markup email
 * clients render reliably), copied as rich text straight into Gmail or
 * Outlook settings. Client-side only.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

function esc(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function SignatureGenerator() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [accent, setAccent] = useState("#175a3d");
  const [copied, setCopied] = useState<"" | "rich" | "html">("");

  const site = website.trim().replace(/^https?:\/\//i, "");
  const siteUrl = site ? `https://${site}` : "";

  const rows: string[] = [];
  if (phone.trim()) rows.push(`<a href="tel:${esc(phone.replace(/[^+\d]/g, ""))}" style="color:#444444;text-decoration:none;">${esc(phone)}</a>`);
  if (email.trim()) rows.push(`<a href="mailto:${esc(email)}" style="color:#444444;text-decoration:none;">${esc(email)}</a>`);
  if (site) rows.push(`<a href="${esc(siteUrl)}" style="color:${esc(accent)};text-decoration:none;">${esc(site)}</a>`);

  const html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#222222;">
  <tr>
    <td style="border-left:3px solid ${esc(accent)};padding-left:12px;">
      <strong style="font-size:15px;color:#111111;">${esc(name || "Your Name")}</strong><br/>
      ${role.trim() ? `<span style="color:#666666;">${esc(role)}${company.trim() ? ` — ${esc(company)}` : ""}</span><br/>` : company.trim() ? `<span style="color:#666666;">${esc(company)}</span><br/>` : ""}
      ${rows.join('<span style="color:#bbbbbb;"> &nbsp;·&nbsp; </span>')}
    </td>
  </tr>
</table>`;

  const filled = Boolean(name.trim());

  const copyRich = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([`${name}\n${role}${company ? ` — ${company}` : ""}\n${phone} ${email} ${site}`], { type: "text/plain" }),
        }),
      ]);
      setCopied("rich");
    } catch {
      await navigator.clipboard.writeText(html);
      setCopied("html");
    }
    setTimeout(() => setCopied(""), 1800);
  };

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied("html");
    setTimeout(() => setCopied(""), 1800);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sig-name" className={labelCls}>Name *</label>
            <input id="sig-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Aisha Khan" />
          </div>
          <div>
            <label htmlFor="sig-role" className={labelCls}>Role</label>
            <input id="sig-role" className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder" />
          </div>
        </div>
        <div>
          <label htmlFor="sig-company" className={labelCls}>Company</label>
          <input id="sig-company" className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Sunrise Dental Clinic" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sig-phone" className={labelCls}>Phone</label>
            <input id="sig-phone" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 123 4567" />
          </div>
          <div>
            <label htmlFor="sig-email" className={labelCls}>Email</label>
            <input id="sig-email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aisha@sunrise.ae" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sig-site" className={labelCls}>Website</label>
            <input id="sig-site" className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="sunrisedental.ae" />
          </div>
          <div>
            <label htmlFor="sig-accent" className={labelCls}>Accent colour</label>
            <input id="sig-accent" type="color" className="h-11.5 w-full cursor-pointer border border-line-strong bg-transparent px-1" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-4">Preview</p>
        <div className="border border-line bg-[#ffffff] p-5" dangerouslySetInnerHTML={{ __html: html }} />
        {filled && (
          <>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyRich}
                className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5"
              >
                {copied === "rich" ? "Copied ✓" : "Copy signature"}
              </button>
              <button
                type="button"
                onClick={copyHtml}
                className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.14em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                {copied === "html" ? "Copied ✓" : "Copy HTML"}
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              &ldquo;Copy signature&rdquo; pastes formatted into Gmail
              (Settings → Signature) and Outlook. &ldquo;Copy HTML&rdquo; is
              for tools that ask for code. Table-based markup, because that is
              the only thing all email clients render the same way.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
