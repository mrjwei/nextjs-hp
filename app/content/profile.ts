import type { Lang } from "app/i18n/config"

export type SocialId = "linkedin" | "github" | "email"

export type Social = {
  id: SocialId
  href: string
  inHeader: boolean
}

export type ProofItem = { label: string }

export type HowIWorkItem = { title: string; body: string }

export type Profile = {
  role: string
  eyebrow: string
  headline: string
  subhead: string
  meta: { title: string; description: string }
  proof: ProofItem[]
  howIWork: HowIWorkItem[]
  rolesSought: string[]
  languages: string[]
  social: Social[]
  features: {
    advisory: boolean
    newsletter: boolean
    cv: boolean
  }
}

const social: Social[] = [
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/jesse-wei-profile/",
    inHeader: true,
  },
  { id: "github", href: "https://github.com/mrjwei", inHeader: true },
  {
    id: "email",
    href: "mailto:jesseweijapan@gmail.com",
    inHeader: false,
  },
]

const features = {
  advisory: false,
  newsletter: true,
  // Files not supplied yet — set to true once the CV PDFs land under /cv.
  cv: false,
}

// Home highlights: pinned items show first on Home, in this order, and the
// remaining slots fill with the most recent. Shared by EN and JA; a pin with
// no match in a language (e.g. an untranslated post) is skipped there.
export const highlights: { projects: string[]; posts: string[] } = {
  // Project IDs, as in a post's `project` frontmatter, e.g. "LingoBun".
  projects: [],
  // Post slugs (the file name without .mdx), e.g. "ai-design-guidelines".
  posts: [],
}

export const profile: Record<Lang, Profile> = {
  en: {
    role: "Product designer & engineer",
    eyebrow: "Product designer & engineer · Design × frontend × AI · Japan",
    headline: "Changing how people work, through design and AI.",
    subhead:
      "Ten years of B2B product design and 3+ years leading frontend. I've helped a paper-run welfare business onto digital workflows, cut a booking flow's peak-season inquiries from 200+ a week to about four, and built a first design system for a team that had none. Now I build LLM features into real operations, with a person at every decision that matters.",
    meta: {
      title:
        "Jesse Wei — Product designer & engineer for digital and AI transformation",
      description:
        "Product designer and frontend engineer with ten years in B2B, bringing digital and AI-assisted workflows into businesses that run on paper, spreadsheets and legacy code — from requirements to a system people adopt. Based in Japan; works in English, Japanese and Chinese.",
    },
    proof: [
      { label: "10 yrs B2B product · 3+ yrs frontend lead" },
      { label: "Booking redesign: 200+ → ~4 inquiries/week" },
      { label: "Paper-run welfare operator → ~100 staff on digital workflows" },
      { label: "LLM systems built for 2 client businesses, with human review gates" },
    ],
    howIWork: [
      {
        title: "Understand the operation",
        body: "Start from how the work is done today — on paper, in spreadsheets, in people's heads — and what the business actually needs to change.",
      },
      {
        title: "Decide who decides",
        body: "Design the system and its review points: what's deterministic code, what an LLM drafts, and what a person must sign off.",
      },
      {
        title: "Design and build it",
        body: "Interface and production frontend in one head, so trade-offs are made once instead of traded across a handoff.",
      },
      {
        title: "Prove it and make it stick",
        body: "Tests, evaluation and field feedback until the team uses it every day, plus a design system so it stays consistent after I leave.",
      },
    ],
    rolesSought: [
      "Design engineer / UX engineer",
      "AI product engineer",
      "Technical director · AI & digital transformation",
      "Forward deployed / solutions engineer",
    ],
    languages: ["Chinese (native)", "English", "Japanese", "Korean"],
    social,
    features,
  },
  ja: {
    role: "プロダクトデザイナー／エンジニア",
    eyebrow: "プロダクトデザイナー／エンジニア・UX×フロントエンド×生成AI・日本",
    headline: "デザインとAIで、人の働き方を変える。",
    subhead:
      "B2Bプロダクトデザイン10年、フロントエンド開発リード3年以上。紙で回っていた福祉事業のDX、繁忙期の問い合わせを週200件超から約4件に減らした予約フロー改善、デザインの土台がなかった組織での初のデザインシステム構築。いまは、要所に人の確認を組み込んだ生成AI機能を、実際の業務に実装しています。",
    meta: {
      title: "Jesse Wei — 業務DX・生成AI実装を担うプロダクトデザイナー／エンジニア",
      description:
        "B2Bプロダクトデザイン10年・フロントエンド開発リードの経験を持つプロダクトデザイナー／エンジニア。紙・スプレッドシート・レガシーシステムで回る業務に、デジタルと生成AIを組み込みます。要件定義から設計・開発・定着まで一貫して担当。拠点は日本、英語・日本語・中国語に対応。",
    },
    proof: [
      { label: "B2Bプロダクト10年・フロントエンドリード3年以上" },
      { label: "予約フロー改善：問い合わせ 週200件超→約4件" },
      { label: "紙運用の福祉事業→約100名規模のデジタル運用へ" },
      { label: "クライアント2社に生成AIシステムを構築（人の確認を組み込んだ設計）" },
    ],
    howIWork: [
      {
        title: "業務を理解する",
        body: "紙・スプレッドシート・個人の頭の中にある「いまのやり方」と、事業として本当に変えるべき点から始めます。",
      },
      {
        title: "判断の分担を設計する",
        body: "コードで決めること、AIに下書きさせること、人が必ず確認することを切り分けて設計します。",
      },
      {
        title: "デザインし、つくる",
        body: "UIと本番のフロントエンドを一人で担うので、トレードオフを引き継ぎの中で失わずに判断できます。",
      },
      {
        title: "検証し、定着させる",
        body: "テスト・評価・現場のフィードバックで毎日使われる状態まで仕上げ、デザインシステムで品質が続く仕組みを残します。",
      },
    ],
    rolesSought: [
      "デザインエンジニア／UXエンジニア",
      "AIプロダクトエンジニア",
      "テクニカルディレクター（DX・生成AI）",
      "Forward Deployed Engineer",
    ],
    languages: ["中国語（母語）", "英語", "日本語", "韓国語"],
    social,
    features,
  },
}
