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
    let summary = searchParams.get("summary") || "";
    summary = summary.length > 200 ? summary.slice(0, 200) + "..." : summary;

    const avatar = isValidAvatarUrl(rawAvatar) ? rawAvatar : "";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0d1117",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Background Glows for Story */}
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "1000px",
              height: "1000px",
              background: "rgba(57, 211, 83, 0.15)",
              filter: "blur(200px)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "1000px",
              height: "1000px",
              background: "rgba(88, 166, 255, 0.1)",
              filter: "blur(200px)",
              borderRadius: "50%",
            }}
          />

          {/* The Actual Vertical Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              width: "880px",
              height: "1500px",
              background: "#161b22",
              borderRadius: "64px",
              border: "3px solid #30363d",
              padding: "80px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
              position: "relative",
            }}
          >
            {/* Top Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {avatar && (
                <img
                  src={avatar}
                  width={200}
                  height={200}
                  style={{ borderRadius: "50%", border: "8px solid #39d353", marginBottom: "40px" }}
                />
              )}
              <span style={{ fontSize: "64px", fontWeight: "bold", color: "#f0f6fc", marginBottom: "16px" }}>
                {username}
              </span>
              <span style={{ fontSize: "32px", color: "#8b949e" }}>
                @{username}
              </span>
            </div>

            {/* MBTI Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "60px 0" }}>
              <span
                style={{
                  fontSize: "100px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #2ea043, #39d353)",
                  backgroundClip: "text",
                  color: "transparent",
                  marginBottom: "24px",
                }}
              >
                {mbti}
              </span>
              <span style={{ fontSize: "40px", color: "#39d353", fontWeight: "bold" }}>
                {title}
              </span>
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: "48px",
                background: "#0d1117",
                borderRadius: "32px",
                border: "2px solid #21262d",
                marginBottom: "60px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "56px", fontWeight: "bold", color: "#39d353" }}>{topLang}</span>
                <span style={{ fontSize: "28px", color: "#8b949e", marginTop: "16px" }}>Top Language</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* SVG Star replacing emoji */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#e3b341">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span style={{ fontSize: "56px", fontWeight: "bold", color: "#e3b341" }}>{stars}</span>
                </div>
                <span style={{ fontSize: "28px", color: "#8b949e", marginTop: "16px" }}>Stars</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "56px", fontWeight: "bold", color: "#58a6ff" }}>{commits}</span>
                <span style={{ fontSize: "28px", color: "#8b949e", marginTop: "16px" }}>Commits</span>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div
                style={{
                  fontSize: "32px",
                  color: "#8b949e",
                  textAlign: "center",
                  maxWidth: "90%",
                  lineHeight: "1.6",
                }}
              >
                "{summary}"
              </div>
            )}
          </div>

          {/* Watermark */}
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              fontSize: "32px",
              color: "#484f58",
              fontWeight: "bold"
            }}
          >
            README.me
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    );
  } catch {
    return new Response("Failed to generate story image", { status: 500 });
  }
}
