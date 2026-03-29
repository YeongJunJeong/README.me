import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black gradient-text mb-4">404</p>
        <p className="text-xl font-bold mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-text-secondary text-sm mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-accent-green text-bg-primary font-medium text-sm hover:brightness-110 transition-all"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
