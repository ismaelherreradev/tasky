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
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #262626 2%, transparent 0%), radial-gradient(circle at 75px 75px, #262626 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "24px",
          padding: "80px 60px",
          border: "2px solid #333",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {SiteConfig.title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {SiteConfig.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            fontSize: 24,
            color: "#71717a",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              marginRight: "12px",
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
