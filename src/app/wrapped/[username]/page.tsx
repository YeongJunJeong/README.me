"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WrappedSlides } from "@/components/WrappedSlides";
import { motion } from "framer-motion";
import type { WrappedData } from "@/lib/analyze";

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export default function WrappedPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("GitHub 데이터를 가져오는 중...");

  useEffect(() => {
    const isFromHome = sessionStorage.getItem("fromHome");
    const navEntries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

    if (!isFromHome && isReload) {
      window.location.replace("/");
      return;
    }

    const clearFromHomeTimer = setTimeout(() => {
      sessionStorage.removeItem("fromHome");
    }, 1000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    async function load() {
      // Try sessionStorage cache (with TTL)
      try {
        const cached = sessionStorage.getItem(`readmeme:${username}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed._ts && Date.now() - parsed._ts < CACHE_TTL) {
            setData(parsed);
            setLoading(false);
            return;
          }
          // Stale cache — refetch
          sessionStorage.removeItem(`readmeme:${username}`);
        }
      } catch {
        // ignore parse errors
      }

      // Fetch fresh
      setProgress("GitHub 데이터를 가져오는 중...");
      const progressTimer = setTimeout(() => {
        setProgress("AI가 프로필을 분석하고 있어요...");
      }, 3000);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "분석에 실패했습니다");
        }

        const result = await res.json();
        // Store with timestamp
        result._ts = Date.now();
        sessionStorage.setItem(`readmeme:${username}`, JSON.stringify(result));
        setData(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("요청 시간이 초과되었습니다. 네트워크를 확인해 주세요.");
        } else {
          setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
        }
      } finally {
        clearTimeout(progressTimer);
        clearTimeout(timeout);
        setLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-accent-green/20 border-t-accent-green rounded-full animate-spin mx-auto mb-6" />
          <p className="text-text-primary text-lg font-medium mb-2">
            @{username}
          </p>
          <p className="text-text-secondary text-sm">{progress}</p>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-accent-red/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-accent-red text-2xl">!</span>
          </div>
          <p className="text-lg font-bold mb-2">분석 실패</p>
          <p className="text-text-secondary text-sm mb-8">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError("");
                setLoading(true);
                sessionStorage.removeItem(`readmeme:${username}`);
                window.location.reload();
              }}
              className="px-6 py-3 rounded-lg bg-accent-green text-bg-primary font-medium text-sm hover:brightness-110 transition-all"
            >
              다시 시도
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-lg bg-bg-card border border-border font-medium text-sm hover:border-accent-green/50 transition-all"
            >
              홈으로
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!data) return null;

  return <WrappedSlides stats={data.stats} analysis={data.analysis} />;
}
