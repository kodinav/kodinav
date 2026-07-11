import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#efeae0",
          color: "#16140f",
          fontFamily: "sans-serif",
          border: "16px solid #16140f",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontWeight: 700 }}>Kodinav</span>
          <span style={{ color: "#55503f" }}>Independent Software Studio</span>
          <span
            style={{
              width: 20,
              height: 20,
              background: "#ff4400",
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            textTransform: "uppercase",
          }}
        >
          <span>We build software</span>
          <span>
            that helps businesses{" "}
            <span style={{ color: "#ff4400" }}>grow.</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#55503f",
          }}
        >
          <span>Websites · Web Apps · Mobile Apps · AI</span>
          <span>Founded by {site.founder}</span>
        </div>
      </div>
    ),
    size
  );
}
