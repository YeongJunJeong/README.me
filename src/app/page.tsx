"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GitHubIcon } from "@/components/Icons";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim().replace(/[^a-zA-Z0-9\-]/g, "");
    if (!trimmed) return;

    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "분석에 실패했습니다");
      }

      const data = await res.json();
      data._ts = Date.now();
      sessionStorage.setItem(`readmeme:${trimmed}`, JSON.stringify(data));
      sessionStorage.setItem("fromHome", "true");
      router.push(`/wrapped/${trimmed}`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("요청 시간이 초과되었습니다. 다시 시도해 주세요.");
      } else {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects — subtle GitHub green glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-green/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-blue/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitHubIcon className="w-10 h-10 text-text-primary" />
            <h1 className="text-5xl sm:text-6xl font-bold">
              <span className="gradient-text">README.me</span>
            </h1>
          </div>
          <p className="text-text-secondary text-lg mb-1">
            Your GitHub Wrapped
          </p>
          <p className="text-text-muted text-sm">
            깃허브 프로필을 분석해서 나만의 개발자 카드를 만들어 보세요
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm sm:text-base">
              github.com/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="username"
              className="w-full pl-[105px] sm:pl-[130px] pr-4 py-4 bg-bg-card border border-border rounded-xl text-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40 transition-all"
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <motion.p
              className="text-accent-red text-sm text-left px-1"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-accent-green text-bg-primary hover:brightness-110 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <LoadingSpinner />
                생성중
              </span>
            ) : (
              "내 README.me 만들기"
            )}
          </button>
        </motion.form>

        {/* Example users */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-text-muted text-xs">또는 예시로 해보기</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {["torvalds", "yyx990803", "gaearon", "sindresorhus"].map(
              (name) => (
                <button
                  key={name}
                  onClick={() => {
                    setUsername(name);
                    setError("");
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-text-secondary hover:border-accent-green/50 hover:text-accent-green transition-all"
                >
                  @{name}
                </button>
              )
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-text-muted text-xs space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>GitHub public API + AI 기반 분석</p>
          <p className="text-text-muted/60">토큰 없이도 작동 · 데이터를 저장하지 않습니다</p>
        </motion.div>
      </motion.div>
    </main>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
