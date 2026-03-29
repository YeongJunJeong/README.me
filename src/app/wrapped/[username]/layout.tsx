import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const ogUrl = `/api/og?username=${encodeURIComponent(username)}`;

  return {
    title: `@${username}의 README.me — GitHub Wrapped`,
    description: `@${username}의 GitHub 활동을 분석한 개발자 카드입니다. 나만의 README.me를 만들어 보세요!`,
    openGraph: {
      title: `@${username}의 README.me`,
      description: `@${username}의 GitHub Wrapped — 나만의 코딩 MBTI를 확인하세요!`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `@${username}의 README.me`,
      description: `@${username}의 GitHub Wrapped — 나만의 코딩 MBTI를 확인하세요!`,
      images: [ogUrl],
    },
  };
}

export default function WrappedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
