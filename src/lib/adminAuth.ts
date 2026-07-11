import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "kodinav_admin";
const SESSION_DAYS = 7;

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (s) return s;
  if (process.env.NODE_ENV === "production") return ""; // no default in prod
  return "kodinav-dev-admin"; // local development fallback
}

export function adminConfigured(): boolean {
  return secret().length > 0;
}

export function verifyPassword(password: string): boolean {
  const s = secret();
  if (!s) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(s);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(exp: number): string {
  return createHmac("sha256", `token:${secret()}`)
    .update(String(exp))
    .digest("hex");
}

export function createToken(): { value: string; maxAge: number } {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return {
    value: `${exp}.${sign(exp)}`,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const expected = sign(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}
