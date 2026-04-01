import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { fetchGitHubStats } from "@/lib/github";
import { buildAnalysisPrompt, type WrappedAnalysis } from "@/lib/analyze";

const DEFAULT_ANALYSIS: WrappedAnalysis = {
  codingMBTI: "NULL-dev",
  mbtiTitle: "미지의 개발자",
  mbtiDescription: "아직 분석할 데이터가 부족해요. 더 많은 코드를 작성해 보세요!",
  personality: "조용히 코드를 쌓아가는 타입",
  roast: "프로필이 너무 깔끔해서 볶을 게 없어요...",
  strengths: ["꾸준함", "미니멀리즘", "잠재력"],
  funFacts: ["아직 발견된 재미있는 사실이 없어요"],
  commitStyle: "조용한 커밋 장인",
  spirit_animal: "🐱 호기심 많은 코딩 고양이",
  summary: "조용하지만 꾸준한 개발자. 앞으로의 성장이 기대됩니다!",
};

// Strip any Korean characters from codingMBTI — must be English only
function sanitizeMBTI(value: string): string {
  // Remove Korean (Hangul) characters
  const stripped = value.replace(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g, "").trim();
  // Must match pattern like XXXX-word (letters + hyphen + letters)
  const valid = /^[A-Z]{2,6}-[a-zA-Z]+$/.test(stripped);
  return valid ? stripped : DEFAULT_ANALYSIS.codingMBTI;
}

function validateAnalysis(raw: Record<string, unknown>): WrappedAnalysis {
  return {
    codingMBTI: typeof raw.codingMBTI === "string" ? sanitizeMBTI(raw.codingMBTI) : DEFAULT_ANALYSIS.codingMBTI,
    mbtiTitle: typeof raw.mbtiTitle === "string" ? raw.mbtiTitle : DEFAULT_ANALYSIS.mbtiTitle,
    mbtiDescription: typeof raw.mbtiDescription === "string" ? raw.mbtiDescription : DEFAULT_ANALYSIS.mbtiDescription,
    personality: typeof raw.personality === "string" ? raw.personality : DEFAULT_ANALYSIS.personality,
    roast: typeof raw.roast === "string" ? raw.roast : DEFAULT_ANALYSIS.roast,
    strengths: Array.isArray(raw.strengths) ? raw.strengths.map(String) : DEFAULT_ANALYSIS.strengths,
    funFacts: Array.isArray(raw.funFacts) ? raw.funFacts.map(String) : DEFAULT_ANALYSIS.funFacts,
    commitStyle: typeof raw.commitStyle === "string" ? raw.commitStyle : DEFAULT_ANALYSIS.commitStyle,
    spirit_animal: typeof raw.spirit_animal === "string" ? raw.spirit_animal : DEFAULT_ANALYSIS.spirit_animal,
    summary: typeof raw.summary === "string" ? raw.summary : DEFAULT_ANALYSIS.summary,
  };
}

const analysisCache = new Map<string, { ts: number; data: any }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function POST(req: NextRequest) {
  try {
    let body: { username?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { username } = body;
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const sanitized = username.trim().replace(/[^a-zA-Z0-9\-]/g, "");
    if (!sanitized || sanitized.length > 39) {
      return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
    }

    // Check hit in global memory cache
    const cachedItem = analysisCache.get(sanitized);
    if (cachedItem && Date.now() - cachedItem.ts < CACHE_TTL) {
      return NextResponse.json(cachedItem.data);
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "서버 설정 오류: OpenAI API 키가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    // 1. Fetch GitHub stats
    const stats = await fetchGitHubStats(sanitized);

    // 2. AI Analysis
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a witty developer culture expert who creates fun GitHub Wrapped analyses. Always respond with valid JSON only. No markdown fences.",
        },
        {
          role: "user",
          content: buildAnalysisPrompt(stats),
        },
      ],
      temperature: 0,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "{}";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        parsed = {};
      }
    }

    const analysis = validateAnalysis(parsed);
    const resultData = { stats, analysis };

    // Save to cache before returning
    analysisCache.set(sanitized, { ts: Date.now(), data: resultData });
    // Naive LRU: keep under 500 entries
    if (analysisCache.size > 500) {
      const firstKey = analysisCache.keys().next().value;
      if (firstKey) analysisCache.delete(firstKey);
    }

    return NextResponse.json(resultData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const status = message.includes("not found")
      ? 404
      : message.includes("rate limit")
        ? 429
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
