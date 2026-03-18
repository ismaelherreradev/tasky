import { ImageResponse } from "next/og";

import { SiteConfig } from "~/config/site";

export const runtime = "nodejs";

export const alt = SiteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1da1f2",
        backgroundImage: "linear-gradient(45deg, #1da1f2, #0891b2)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "32px",
          padding: "60px 40px",
          margin: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1da1f2, #0891b2)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {SiteConfig.title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#334155",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.3,
          }}
        >
          {SiteConfig.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "32px",
            padding: "12px 24px",
            backgroundColor: "#f8fafc",
            borderRadius: "20px",
            fontSize: 20,
            color: "#475569",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              marginRight: "10px",
            }}
          />
          Project Management Made Simple
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
