"use client";

import { motion } from "framer-motion";
import type { GitHubStats } from "@/lib/github";
import type { WrappedAnalysis } from "@/lib/analyze";
import { useState, useEffect, useCallback } from "react";

interface Props {
  stats: GitHubStats;
  analysis: WrappedAnalysis;
}

export function ShareCard({ stats, analysis }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [ogUrl, setOgUrl] = useState("");

  // Build URLs client-side only to avoid hydration mismatch
  useEffect(() => {
    const url = `${window.location.origin}/wrapped/${stats.user.login}`;
    setShareUrl(url);
    setOgUrl(
      `${window.location.origin}/api/og?` +
        new URLSearchParams({
          username: stats.user.login,
          mbti: analysis.codingMBTI,
          title: analysis.mbtiTitle,
          lang: stats.topLanguage,
          stars: String(stats.totalStars),
          commits: String(stats.commitCount),
          avatar: stats.user.avatar_url,
          summary: analysis.summary.slice(0, 120),
        }).toString()
    );
  }, [stats, analysis]);

  const tweetText = (() => {
    const base = `나의 코딩 MBTI는 ${analysis.codingMBTI} (${analysis.mbtiTitle})!\n\n`;
    const summary = analysis.summary.length > 100
      ? analysis.summary.slice(0, 97) + "..."
      : analysis.summary;
    const suffix = "\n\n나만의 README.me 만들기 👉";
    return base + summary + suffix;
  })();

  const shareTwitterUrl = shareUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}` : "#";
  const shareLinkedInUrl = shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` : "#";

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS or denied permission
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const downloadCard = useCallback(() => {
    const storyUrl = `${window.location.origin}/api/story?` +
      new URLSearchParams({
        username: stats.user.login,
        mbti: analysis.codingMBTI,
        title: analysis.mbtiTitle,
        lang: stats.topLanguage,
        stars: String(stats.totalStars),
        commits: String(stats.commitCount),
        avatar: stats.user.avatar_url,
        summary: analysis.summary.slice(0, 120),
      }).toString();

    const link = document.createElement("a");
    link.href = storyUrl;
    link.download = `readmeme-story-${stats.user.login}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stats, analysis]);

  return (
    <div className="slide-bg-6 w-full max-w-md mx-auto p-6 rounded-2xl border border-border">
      <motion.h2
        className="text-2xl font-bold text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        나의 README.me
      </motion.h2>

      {/* Preview Card */}
      <motion.div
        className="card-gradient-border p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={stats.user.avatar_url}
            alt={stats.user.login}
            className="w-12 h-12 rounded-full ring-1 ring-accent-green"
          />
          <div>
            <p className="font-semibold text-sm">
              {stats.user.name || stats.user.login}
            </p>
            <p className="text-text-muted text-xs">@{stats.user.login}</p>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-3xl font-black gradient-text">{analysis.codingMBTI}</p>
          <p className="text-accent-green text-sm font-medium mt-1">{analysis.mbtiTitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-sm font-bold text-accent-green">{stats.topLanguage}</p>
            <p className="text-[10px] text-text-muted">Top Lang</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-accent-yellow">★ {stats.totalStars}</p>
            <p className="text-[10px] text-text-muted">Stars</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-accent-blue">{stats.commitCount}</p>
            <p className="text-[10px] text-text-muted">Commits</p>
          </div>
        </div>

        <p className="text-xs text-text-secondary text-center leading-relaxed">
          {analysis.summary}
        </p>

        <p className="text-[10px] text-text-muted text-center mt-4 pt-3 border-t border-border">
          readme.me에서 나만의 카드 만들기
        </p>
      </motion.div>

      {/* Share buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <a
          href={shareTwitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-lg bg-[#1DA1F2] hover:bg-[#1a8cd8] font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X (Twitter)에 공유
        </a>

        <a
          href={shareLinkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-lg bg-[#0077B5] hover:bg-[#006399] font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn에 공유
        </a>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={copyLink}
            className="flex-1 py-3 rounded-lg bg-bg-card border border-border hover:border-accent-green/50 font-medium text-sm transition-all"
          >
            {copied ? "✓ 복사됨!" : "링크 복사"}
          </button>
          <button
            type="button"
            onClick={downloadCard}
            className="flex-1 py-3 rounded-lg bg-bg-card border border-border hover:border-accent-blue/50 font-medium text-sm transition-all"
          >
            카드 저장
          </button>
        </div>
      </motion.div>

      {/* Back to home */}
      <motion.div
        className="mt-6 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-bg-card border border-border text-text-primary hover:border-accent-green hover:text-accent-green font-medium transition-all w-full"
        >
          ← 다른 유저 분석하기
        </a>
      </motion.div>
    </div>
  );
}
