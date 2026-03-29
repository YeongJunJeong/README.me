"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">⚠️</p>
        <p className="text-xl font-bold mb-2">오류가 발생했습니다</p>
        <p className="text-text-secondary text-sm mb-8">
          {error.message || "예상치 못한 오류가 발생했어요. 다시 시도해 주세요."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
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
      </div>
    </main>
  );
}
