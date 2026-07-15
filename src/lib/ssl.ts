import { connect, type PeerCertificate } from "node:tls";
import { AuditError, assertPublicUrl, type SslInfo } from "./audit";

/** Certificate name fields are typed string | string[]; normalise to one string. */
function str(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

/**
 * Reads a host's TLS certificate the way a browser would: connect, verify the
 * chain against the system CA store, report validity dates. Verification is
 * done with rejectUnauthorized: false so we can still READ an untrusted cert
 * and explain why it fails, but the socket's own verdict is what we report —
 * we never do the judging ourselves.
 */
export async function inspectCertificate(input: string): Promise<SslInfo> {
  const trimmed = input.trim().replace(/^https?:\/\//i, "").split("/")[0];
  if (!trimmed) throw new AuditError("Enter a domain to check.");
  let url: URL;
  try {
    url = new URL(`https://${trimmed}`);
  } catch {
    throw new AuditError("That does not look like a domain.");
  }
  await assertPublicUrl(url);
  const host = url.hostname;

  return new Promise<SslInfo>((resolve, reject) => {
    const socket = connect(
      {
        host,
        port: 443,
        servername: host,
        rejectUnauthorized: false,
        timeout: 10_000,
      },
      () => {
        const cert = socket.getPeerCertificate() as PeerCertificate;
        if (!cert || !cert.valid_to) {
          socket.destroy();
          reject(new AuditError("The server answered but presented no certificate."));
          return;
        }
        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / 86_400_000);
        const info: SslInfo = {
          host,
          trusted: socket.authorized,
          trustError: socket.authorized ? null : (socket.authorizationError?.toString() ?? null),
          issuer: str(cert.issuer?.O) ?? str(cert.issuer?.CN),
          subject: str(cert.subject?.CN),
          validFrom: new Date(cert.valid_from).toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining,
          altNames: (cert.subjectaltname ?? "")
            .split(",")
            .map((s) => s.trim().replace(/^DNS:/i, ""))
            .filter(Boolean)
            .slice(0, 12),
        };
        socket.destroy();
        resolve(info);
      }
    );
    socket.on("timeout", () => {
      socket.destroy();
      reject(new AuditError("The server did not answer on port 443 within 10 seconds."));
    });
    socket.on("error", () => {
      socket.destroy();
      reject(
        new AuditError(
          "Could not open a secure connection. The domain may not serve HTTPS at all — which is itself the finding."
        )
      );
    });
  });
}
