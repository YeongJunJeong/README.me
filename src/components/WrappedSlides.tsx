"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import type { GitHubStats } from "@/lib/github";
import type { WrappedAnalysis } from "@/lib/analyze";
import { ShareCard } from "./ShareCard";

interface Props {
  stats: GitHubStats;
  analysis: WrappedAnalysis;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function WrappedSlides({ stats, analysis }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalSlides = 6;

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentSlide((prev) => {
        const next = prev + newDirection;
        if (next < 0) return 0;
        if (next >= totalSlides) return totalSlides - 1;
        return next;
      });
    },
    [totalSlides]
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) paginate(1);
    else if (info.offset.x > threshold) paginate(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  const slides = [
    <SlideIntro key="intro" stats={stats} />,
    <SlideLanguages key="langs" stats={stats} />,
    <SlideActivity key="activity" stats={stats} analysis={analysis} />,
    <SlideMBTI key="mbti" analysis={analysis} />,
    <SlideRoast key="roast" stats={stats} analysis={analysis} />,
    <ShareCard key="share" stats={stats} analysis={analysis} />,
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      role="region"
      aria-label="GitHub Wrapped slides"
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 p-3 bg-bg-primary/80 backdrop-blur-sm">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden bg-border cursor-pointer"
            onClick={() => {
              setDirection(i > currentSlide ? 1 : -1);
              setCurrentSlide(i);
            }}
            aria-label={`슬라이드 ${i + 1}로 이동`}
          >
            <motion.div
              className="h-full bg-accent-blue"
              initial={false}
              animate={{ width: i <= currentSlide ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>

      {/* Slide content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="w-full min-h-screen flex items-center justify-center px-4 pt-12 pb-20"
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center gap-4 z-50 py-4 bg-bg-primary/80 backdrop-blur-sm">
        <button
          onClick={() => paginate(-1)}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-lg bg-bg-card border border-border text-sm disabled:opacity-20 hover:border-accent-blue/50 transition-all"
        >
          ← 이전
        </button>
        <span className="text-text-secondary text-sm tabular-nums min-w-[60px] text-center">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          onClick={() => paginate(1)}
          disabled={currentSlide === totalSlides - 1}
          className="px-4 py-2 rounded-lg bg-bg-card border border-border text-sm disabled:opacity-20 hover:border-accent-blue/50 transition-all"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}

/* =================== Slide Components =================== */

function SlideIntro({ stats }: { stats: GitHubStats }) {
  const years = Math.floor(stats.accountAgeDays / 365);

  return (
    <div className="slide-bg-1 w-full max-w-md mx-auto text-center p-8 rounded-2xl border border-border">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <img
          src={stats.user.avatar_url}
          alt={stats.user.login}
          className="w-24 h-24 rounded-full mx-auto mb-4 ring-2 ring-accent-blue ring-offset-2 ring-offset-bg-primary"
        />
      </motion.div>
      <motion.h2
        className="text-2xl font-bold mb-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {stats.user.name || stats.user.login}
      </motion.h2>
      <motion.p
        className="text-text-secondary text-sm mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        @{stats.user.login}
      </motion.p>
      <motion.p
        className="text-text-secondary text-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {stats.user.bio || ""}
      </motion.p>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center">
          <p className="text-text-secondary text-sm">GitHub에 함께한 지</p>
          <p className="text-4xl font-black gradient-text my-1">
            {years > 0 ? `${years}년` : `${stats.accountAgeDays}일`}
          </p>
          {years > 0 && (
            <p className="text-text-secondary text-sm">{stats.accountAgeDays.toLocaleString()}일째</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <StatBox label="Repos" value={stats.user.public_repos} color="text-text-primary" />
          <StatBox label="Followers" value={stats.user.followers} color="text-text-primary" />
          <StatBox label="Stars" value={stats.totalStars} color="text-accent-yellow" />
        </div>
      </motion.div>

      <motion.p
        className="mt-8 text-text-secondary text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        스와이프하거나 → 키로 넘겨 보세요
      </motion.p>
    </div>
  );
}

function SlideLanguages({ stats }: { stats: GitHubStats }) {
  const sorted = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const total = sorted.reduce((sum, [, v]) => sum + v, 0);

  const langColors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    Java: "#b07219",
    Go: "#00add8",
    Rust: "#dea584",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Ruby: "#701516",
    PHP: "#4f5d95",
    Swift: "#f05138",
    Kotlin: "#a97bff",
    Dart: "#00b4ab",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Lua: "#000080",
    Zig: "#ec915c",
    Elixir: "#6e4a7e",
    Scala: "#c22d40",
    Haskell: "#5e5086",
  };

  return (
    <div className="slide-bg-2 w-full max-w-md mx-auto p-8 rounded-2xl border border-border">
      <motion.h2
        className="text-2xl font-bold text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        언어 DNA
      </motion.h2>
      <motion.p
        className="text-text-secondary text-sm text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Top Language:{" "}
        <span className="text-accent-blue font-semibold">{stats.topLanguage}</span>
      </motion.p>

      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map(([lang, size], i) => {
            const pct = Math.max(1, Math.round((size / total) * 100));
            const color = langColors[lang] || "#8b949e";
            return (
              <motion.div
                key={lang}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    {lang}
                  </span>
                  <span className="text-text-secondary">{pct}%</span>
                </div>
                <div className="h-2 bg-border-light rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-text-secondary text-4xl mb-2">🤷</p>
          <p className="text-text-secondary text-sm">
            public 레포에서 언어 데이터를 찾지 못했어요
          </p>
          <p className="text-text-secondary text-xs mt-1">
            private 레포가 많은 분이신가 봐요!
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SlideActivity({
  stats,
  analysis,
}: {
  stats: GitHubStats;
  analysis: WrappedAnalysis;
}) {
  const hasActivity = stats.commitCount > 0 || stats.prCount > 0 || stats.activeDays > 0;

  return (
    <div className="slide-bg-3 w-full max-w-md mx-auto p-8 rounded-2xl border border-border">
      <motion.h2
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        코딩 활동 리포트
      </motion.h2>

      {hasActivity ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            className="bg-bg-card rounded-xl p-4 text-center border border-border"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-3xl font-bold text-accent-blue">{stats.commitCount}</p>
            <p className="text-text-secondary text-xs mt-1">Recent Commits</p>
          </motion.div>
          <motion.div
            className="bg-bg-card rounded-xl p-4 text-center border border-border"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-3xl font-bold text-accent-blue">{stats.activeDays}</p>
            <p className="text-text-secondary text-xs mt-1">Active Days</p>
          </motion.div>
          <motion.div
            className="bg-bg-card rounded-xl p-4 text-center border border-border"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-3xl font-bold text-accent-purple">{stats.prCount}</p>
            <p className="text-text-secondary text-xs mt-1">Pull Requests</p>
          </motion.div>
          <motion.div
            className="bg-bg-card rounded-xl p-4 text-center border border-border"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-3xl font-bold text-accent-orange">{stats.totalForks}</p>
            <p className="text-text-secondary text-xs mt-1">Total Forks</p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="text-center py-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-text-secondary text-sm">
            최근 public 활동 기록이 없어요
          </p>
          <p className="text-text-secondary text-xs mt-1">
            (GitHub Events API는 최근 90일 public 활동만 반영합니다)
          </p>
        </motion.div>
      )}

      <motion.div
        className="bg-bg-card rounded-xl p-4 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">커밋 스타일</p>
        <p className="text-sm font-medium">{analysis.commitStyle}</p>
      </motion.div>

      <motion.div
        className="mt-3 bg-bg-card rounded-xl p-4 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">스피릿 애니멀</p>
        <p className="text-base font-medium">{analysis.spirit_animal}</p>
      </motion.div>
    </div>
  );
}

function SlideMBTI({ analysis }: { analysis: WrappedAnalysis }) {
  return (
    <div className="slide-bg-4 w-full max-w-md mx-auto p-8 rounded-2xl border border-border text-center">
      <motion.p
        className="text-text-secondary text-sm mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        나의 코딩 MBTI는
      </motion.p>

      <motion.h2
        className="text-5xl sm:text-6xl font-black gradient-text mb-3"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        {analysis.codingMBTI}
      </motion.h2>

      <motion.p
        className="text-xl font-semibold text-accent-blue mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {analysis.mbtiTitle}
      </motion.p>

      <motion.p
        className="text-text-secondary text-sm mb-6 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {analysis.mbtiDescription}
      </motion.p>

      <motion.div
        className="space-y-3 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-text-secondary text-xs uppercase tracking-wider">성격 한 줄 요약</p>
        <p className="text-sm font-medium bg-bg-card rounded-lg p-3 border border-border">
          {analysis.personality}
        </p>
      </motion.div>

      <motion.div
        className="mt-4 space-y-2 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-text-secondary text-xs uppercase tracking-wider">강점</p>
        {analysis.strengths.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-bg-card rounded-lg px-3 py-2 text-sm border border-border"
          >
            <span className="text-accent-blue text-xs">●</span>
            {s}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function SlideRoast({
  stats,
  analysis,
}: {
  stats: GitHubStats;
  analysis: WrappedAnalysis;
}) {
  return (
    <div className="slide-bg-5 w-full max-w-md mx-auto p-8 rounded-2xl border border-border">
      <motion.h2
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        살짝 볶아볼게요 🔥
      </motion.h2>

      <motion.div
        className="bg-bg-card rounded-xl p-5 mb-6 border border-border"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm leading-relaxed">{analysis.roast}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">재미있는 사실들</p>
        <div className="space-y-2">
          {analysis.funFacts.map((fact, i) => (
            <motion.div
              key={i}
              className="bg-bg-card rounded-lg px-4 py-3 text-sm border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              <span className="text-accent-yellow mr-2">→</span>
              {fact}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top repos */}
      {stats.topRepos.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">베스트 레포</p>
          <div className="space-y-2">
            {stats.topRepos.slice(0, 3).map((repo) => (
              <div
                key={repo.name}
                className="bg-bg-card rounded-lg px-4 py-3 flex justify-between items-center border border-border"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{repo.name}</p>
                  <p className="text-xs text-text-secondary">{repo.language || "—"}</p>
                </div>
                <span className="text-accent-yellow text-sm ml-3 shrink-0">
                  ★ {repo.stargazers_count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color = "text-text-primary",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-bg-card rounded-lg p-3 text-center border border-border">
      <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
      <p className="text-text-secondary text-xs">{label}</p>
    </div>
  );
}
