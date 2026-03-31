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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0d1117",
            fontFamily: "sans-serif",
            color: "#f0f6fc",
            position: "relative",
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              top: "-80px",
              width: "400px",
              height: "400px",
              background: "rgba(31,111,235,0.12)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              width: "400px",
              height: "400px",
              background: "rgba(88,166,255,0.08)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />

          {/* Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "460px",
              background: "#161b22",
              borderRadius: "24px",
              border: "2px solid #30363d",
              padding: "36px 32px",
              position: "relative",
            }}
          >
            {/* Avatar */}
            {avatar && (
              <img
                src={avatar}
                width={80}
                height={80}
                style={{
                  borderRadius: "50%",
                  border: "3px solid #58a6ff",
                  marginBottom: "16px",
                }}
              />
            )}

            {/* Name */}
            <span style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "2px" }}>
              {username}
            </span>
            <span style={{ fontSize: "13px", color: "#8b949e", marginBottom: "24px" }}>
              @{username}
            </span>

            {/* MBTI */}
            <span
              style={{
                fontSize: "44px",
                fontWeight: 900,
                letterSpacing: "-1px",
                background: "linear-gradient(135deg, #1f6feb, #79c0ff)",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: "6px",
              }}
            >
              {mbti}
            </span>
            <span style={{ fontSize: "18px", color: "#58a6ff", fontWeight: "bold", marginBottom: "24px" }}>
              {title}
            </span>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: "16px 24px",
                background: "#0d1117",
                borderRadius: "12px",
                border: "1px solid #21262d",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#58a6ff" }}>{topLang}</span>
                <span style={{ fontSize: "10px", color: "#8b949e", marginTop: "4px" }}>Top Lang</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#e3b341" }}>⭐ {stars}</span>
                <span style={{ fontSize: "10px", color: "#8b949e", marginTop: "4px" }}>Stars</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#58a6ff" }}>{commits}</span>
                <span style={{ fontSize: "10px", color: "#8b949e", marginTop: "4px" }}>Commits</span>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div style={{ fontSize: "12px", color: "#8b949e", textAlign: "center", lineHeight: 1.5 }}>
                {summary}
              </div>
            )}

            {/* Watermark */}
            <span style={{ marginTop: "16px", fontSize: "11px", color: "#484f58", fontWeight: "bold" }}>
              README.me
            </span>
          </div>
        </div>
      ),
      { width: 540, height: 720 }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
