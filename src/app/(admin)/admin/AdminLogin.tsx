"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
      return;
    }
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setError(data.error ?? "Login failed");
    setBusy(false);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 pt-[12vh]">
      <div className="flex flex-col gap-3">
        <p className="annotation flex items-center gap-3">
          <span className="crosshair text-accent" aria-hidden />
          Restricted — Studio Access
        </p>
        <h1 className="text-4xl">Admin login.</h1>
      </div>

      {configured ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-password" className="annotation mb-2 block">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full border border-line-strong bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center border border-foreground bg-foreground px-8 py-3.5 font-mono text-xs tracking-[0.18em] text-background uppercase transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#efeae0] active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? "Checking…" : "Enter →"}
          </button>
          {error && <p className="text-sm text-accent">{error}</p>}
        </form>
      ) : (
        <p className="border border-line-strong p-5 text-sm leading-relaxed text-muted">
          Admin is not configured on this deployment. Set the{" "}
          <code className="font-mono text-foreground">ADMIN_PASSWORD</code>{" "}
          environment variable and redeploy.
        </p>
      )}
    </div>
  );
}
