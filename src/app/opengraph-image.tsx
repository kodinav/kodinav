import { ImageResponse } from "next/og";
import { site } from "@/data/site";

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
          background: "#f4f3ee",
          color: "#16171b",
          fontFamily: "sans-serif",
          border: "14px solid #16171b",
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
          <span style={{ color: "#52545b" }}>Independent Software Studio</span>
          <span
            style={{
              width: 20,
              height: 20,
              background: "#1b3ad6",
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
          }}
        >
          <span>We build software</span>
          <span>
            that helps businesses{" "}
            <span style={{ color: "#1b3ad6" }}>grow.</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#52545b",
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
