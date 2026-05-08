import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #fef9f1 0%, #f5f5f4 100%)",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Amber orb */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(234, 88, 12, 0.18) 0%, transparent 70%)",
          }}
        />

        {/* Family tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#fef3c7",
            color: "#92400e",
            padding: "8px 16px",
            borderRadius: "999px",
            fontSize: "20px",
            fontWeight: 600,
            alignSelf: "flex-start",
          }}
        >
          ✦ Demo · part of the Lending Agent family
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              fontSize: "96px",
              fontWeight: 500,
              color: "#0f172a",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Your AR network,
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 500,
              color: "#b45309",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            supervised properly.
          </div>
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: "26px",
            color: "#475569",
            marginTop: "32px",
            lineHeight: 1.4,
            maxWidth: "1000px",
          }}
        >
          An operating system for principal firms. Register every AR. Detect risk early. Evidence supervision the way the FCA expects, with PS22/11 baked in.
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            color: "#64748b",
            fontSize: "20px",
          }}
        >
          <div>lending-agent-oversight.vercel.app</div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#f59e0b",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              ⛨
            </div>
            <div style={{ color: "#0f172a", fontWeight: 600 }}>
              Lending Agent Oversight
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
