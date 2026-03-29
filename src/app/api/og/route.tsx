import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function isValidAvatarUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "avatars.githubusercontent.com"
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = (searchParams.get("username") || "developer").slice(0, 39);
    const mbti = (searchParams.get("mbti") || "INTJ-debug").slice(0, 20);
    const title = (searchParams.get("title") || "코딩 마스터").slice(0, 20);
    const topLang = (searchParams.get("lang") || "TypeScript").slice(0, 20);
    const stars = (searchParams.get("stars") || "0").slice(0, 10);
    const commits = (searchParams.get("commits") || "0").slice(0, 10);
    const rawAvatar = searchParams.get("avatar") || "";
    const summary = (searchParams.get("summary") || "").slice(0, 150);

    const avatar = isValidAvatarUrl(rawAvatar) ? rawAvatar : "";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0d1117",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Background Glows */}
          <div
            style={{
              position: "absolute",
              top: "-200px",
              left: "-100px",
              width: "800px",
              height: "800px",
              background: "rgba(57, 211, 83, 0.15)",
              filter: "blur(120px)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-200px",
              right: "-100px",
              width: "800px",
              height: "800px",
              background: "rgba(88, 166, 255, 0.1)",
              filter: "blur(120px)",
              borderRadius: "50%",
            }}
          />

          {/* The Actual Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "750px",
              height: "520px",
              background: "#161b22",
              borderRadius: "32px",
              border: "2px solid #30363d",
              padding: "48px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            {/* Header: Avatar and Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
              {avatar && (
                <img
                  src={avatar}
                  width={80}
                  height={80}
                  style={{ borderRadius: "50%", border: "4px solid #39d353" }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "36px", fontWeight: "bold", color: "#f0f6fc" }}>
                  {username}
                </span>
                <span style={{ fontSize: "20px", color: "#8b949e", marginTop: "4px" }}>
                  @{username}
                </span>
              </div>
            </div>

            {/* MBTI Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
              <span
                style={{
                  fontSize: "56px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #2ea043, #39d353)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {mbti}
              </span>
              <span style={{ fontSize: "24px", color: "#39d353", marginTop: "8px" }}>
                {title}
              </span>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: "flex",
                width: "90%",
                justifyContent: "space-between",
                padding: "24px 48px",
                background: "#0d1117",
                borderRadius: "16px",
                border: "1px solid #21262d",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: "#39d353" }}>{topLang}</span>
                <span style={{ fontSize: "14px", color: "#8b949e", marginTop: "6px" }}>Top Language</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* SVG Star replacing emoji */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#e3b341">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span style={{ fontSize: "32px", fontWeight: "bold", color: "#e3b341" }}>{stars}</span>
                </div>
                <span style={{ fontSize: "14px", color: "#8b949e", marginTop: "6px" }}>Stars</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: "#58a6ff" }}>{commits}</span>
                <span style={{ fontSize: "14px", color: "#8b949e", marginTop: "6px" }}>Commits</span>
              </div>
            </div>

            {/* Summary (if any) */}
            {summary && (
              <div
                style={{
                  fontSize: "16px",
                  color: "#8b949e",
                  textAlign: "center",
                  maxWidth: "650px",
                  lineHeight: "1.5",
                  marginTop: "24px",
                }}
              >
                {summary}
              </div>
            )}

            {/* Logo/Watermark at bottom */}
            <div style={{ position: "absolute", bottom: "24px", fontSize: "16px", color: "#484f58", fontWeight: "bold" }}>
              README.me
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
