<div align="center">

# README.me

### Your GitHub Wrapped

[English](README_EN.md) | **한국어**

<img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
<img src="https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?logo=openai" alt="OpenAI" />
<img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel" />

</div>

---

## 이게 뭔가요?

**README.me**는 GitHub 프로필을 Spotify Wrapped 스타일로 분석해주는 웹앱입니다.

GitHub 유저네임을 입력하면:

1. **수집** — public GitHub 데이터를 가져옵니다 (레포, 언어, 활동, 스타)
2. **분석** — AI가 재미있는 코딩 성격 유형을 생성합니다
3. **프레젠테이션** — 스와이프 가능한 애니메이션 슬라이드로 보여줍니다
4. **공유** — 코딩 MBTI가 담긴 카드를 SNS에 공유할 수 있습니다

> _"내 코딩 MBTI는 INTJ-deploy래 ㅋㅋ" — 친구한테 공유해 보세요._

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| **코딩 MBTI** | AI가 생성하는 개발자 성격 유형 (`ENFP-debug`, `ISTJ-refactor` 등) |
| **6개 애니메이션 슬라이드** | 스와이프, 탭, 키보드 화살표로 탐색 |
| **언어 DNA** | 주로 사용하는 프로그래밍 언어 비주얼 분석 |
| **활동 리포트** | 커밋, PR, 활동일수, 커밋 스타일 분석 |
| **프렌들리 로스트** | AI가 GitHub 프로필을 (착하게) 볶아줌 |
| **공유 카드** | X (Twitter), LinkedIn 공유 + PNG 다운로드 |
| **OG 이미지** | SNS 공유 시 미리보기 이미지 자동 생성 |
| **로그인 불필요** | 토큰 없이 public 데이터만으로 작동 |

---

## 슬라이드 구성

| # | 슬라이드 | 내용 |
|---|---|---|
| 1 | **인트로** | 아바타, 이름, 가입 기간, 레포/팔로워/스타 |
| 2 | **언어 DNA** | 상위 6개 언어 + 애니메이션 프로그레스 바 |
| 3 | **활동 리포트** | 커밋, 활동일수, PR, 포크, 커밋 스타일, 스피릿 애니멀 |
| 4 | **코딩 MBTI** | MBTI 타입, 제목, 설명, 성격 요약, 강점 |
| 5 | **로스트** | 프렌들리 로스트, 재미있는 사실들, 베스트 레포 |
| 6 | **공유** | 프리뷰 카드, SNS 공유 버튼, 다운로드 |

---

## 기술 스택

```
프론트엔드     Next.js 16 (App Router) + React 19
스타일링       Tailwind CSS 4
애니메이션     Framer Motion
AI            OpenAI API (gpt-4o-mini)
데이터         GitHub REST API (토큰 없이도 사용 가능)
OG 이미지      @vercel/og (Edge Runtime)
언어           TypeScript
배포           Vercel
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # POST: GitHub 수집 + AI 분석
│   │   ├── og/route.tsx            # GET: OG 이미지 생성 (Edge)
│   │   └── story/route.tsx         # GET: 스토리 이미지 다운로드용
│   ├── wrapped/[username]/
│   │   ├── layout.tsx              # 동적 OG 메타데이터
│   │   └── page.tsx                # Wrapped 슬라이드 페이지
│   ├── error.tsx                   # 에러 페이지
│   ├── not-found.tsx               # 404 페이지
│   ├── globals.css                 # GitHub 다크 테마
│   ├── layout.tsx                  # 루트 레이아웃
│   └── page.tsx                    # 랜딩 페이지
├── components/
│   ├── Icons.tsx                   # SVG 아이콘
│   ├── ShareCard.tsx               # 공유 슬라이드 + SNS 버튼
│   └── WrappedSlides.tsx           # 6개 슬라이드 전체
└── lib/
    ├── analyze.ts                  # AI 프롬프트 빌더
    └── github.ts                   # GitHub API 클라이언트
```

---

## 시작하기

### 필수 조건

- Node.js 18+
- OpenAI API 키 ([여기서 발급](https://platform.openai.com/api-keys))

### 설치

```bash
git clone https://github.com/your-username/readmeme.git
cd readmeme
npm install
cp .env.example .env.local
```

`.env.local` 편집:

```env
OPENAI_API_KEY=sk-your-key-here

# 선택사항: GitHub API rate limit 상향 (60/hr -> 5000/hr)
GITHUB_TOKEN=ghp_your-token-here
```

### 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속.

---

## Vercel 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/readmeme)

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에서 Import
3. 환경변수 추가: `OPENAI_API_KEY`
4. 배포 완료

---

## 작동 원리

```
유저가 GitHub 유저네임 입력
        │
        ▼
   /api/analyze (POST)
        │
        ├── GitHub REST API
        │     ├── /users/{username}           유저 정보
        │     ├── /users/{username}/repos     레포 목록 (최대 200개)
        │     └── /users/{username}/events    최근 활동 (최대 100개)
        │
        ├── 데이터 가공
        │     ├── 언어 분포 (레포 크기 기반 가중치)
        │     ├── 스타/포크 합산
        │     ├── 활동 지표 (커밋, PR, 이슈, 활동일수)
        │     └── 상위 레포 정렬
        │
        └── OpenAI API (gpt-4o-mini)
              └── 코딩 MBTI, 로스트, 성격 분석,
                  재미있는 사실, 공유용 요약 생성
        │
        ▼
   /wrapped/{username}
   6개 애니메이션 슬라이드 + 공유 카드
```

---

## 환경변수

| 변수 | 필수 | 설명 |
|---|---|---|
| `OPENAI_API_KEY` | O | OpenAI API 키 (AI 분석용) |
| `GITHUB_TOKEN` | X | GitHub 개인 액세스 토큰 (rate limit 상향) |

서버 측 캐싱(24시간)으로 동일 유저에 대한 반복 API 호출을 최소화합니다.

---

## 라이선스

MIT

---

<div align="center">

**[README.me](https://readme.me)** — _당신의 코드가 들려주는 이야기. 같이 읽어볼까요?_

</div>
