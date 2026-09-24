import type { Lang } from "app/i18n/config"

export type SocialId = "linkedin" | "github" | "instagram" | "email"

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
  focusTags: string[]
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
    id: "instagram",
    href: "https://www.instagram.com/mrjwei/",
    inHeader: false,
  },
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

const focusTags = ["ai", "machine-learning", "deep-learning", "security"]

export const profile: Record<Lang, Profile> = {
  en: {
    role: "Applied AI engineer",
    eyebrow: "Applied AI engineer · Japan & Australia",
    headline: "AI that gets used, not just demoed.",
    subhead:
      "I ship LLM systems into real business workflows — from messy Japanese documents to evaluated, production-ready pipelines. A decade of product design and engineering is why people actually adopt them.",
    meta: {
      title:
        "Jesse Wei — Applied AI engineer shipping LLM systems into real workflows",
      description:
        "Applied AI engineer who ships LLM systems into real business workflows — document pipelines, evaluation and delivery — backed by ten years of product design and engineering. Based in Japan, working in English, Japanese and Chinese.",
    },
    proof: [
      { label: "LLM pipelines shipped for 2 client businesses" },
      { label: "Eval harness · 146 labelled attacks scored" },
      { label: "10 yrs product · 3+ yrs frontend leadership" },
      { label: "EN · 日本語 · 中文" },
    ],
    howIWork: [
      {
        title: "Scope it with the customer",
        body: "Start from the workflow, not the model — where AI can be trusted, where it can't, and what a human has to sign off on.",
      },
      {
        title: "Build the pipeline",
        body: "Retrieval, orchestration, guardrails, cost and latency budgets — production code, not a notebook demo.",
      },
      {
        title: "Prove it with evals",
        body: "Ground truth, a scoring rubric, and a re-run before every change — so \"it works\" is a number, not a feeling.",
      },
    ],
    focusTags,
    rolesSought: [
      "Forward Deployed Engineer",
      "AI Solutions Engineer",
      "Applied AI (生成AI) Engineer",
    ],
    languages: ["Chinese (native)", "English", "Japanese", "Korean"],
    social,
    features,
  },
  ja: {
    role: "アプライドAIエンジニア",
    eyebrow: "アプライドAIエンジニア・日本／オーストラリア",
    headline: "デモで終わらない、現場で使われるAIを。",
    subhead:
      "生成AI／LLMシステムを実際の業務に実装しています。日本語の複雑な文書処理から、評価設計を伴う本番運用可能なパイプラインまで一貫して担当。10年のプロダクトデザインと開発の経験が、「使われるAI」につながっています。",
    meta: {
      title: "Jesse Wei — 業務に実装されるAIをつくるアプライドAIエンジニア",
      description:
        "生成AI／LLMシステムを実際の業務に実装するアプライドAIエンジニア。文書処理パイプライン、評価設計、顧客との要件整理から本番運用までを担当し、10年のプロダクトデザイン・開発経験で「使われるAI」をつくります。拠点は日本、英語・日本語・中国語で対応可能です。",
    },
    proof: [
      { label: "クライアント企業2社にLLMパイプラインを実装" },
      { label: "評価ハーネス · 146件のラベル付き攻撃を採点" },
      { label: "プロダクト経験10年・フロントエンドリード3年以上" },
      { label: "英語 · 日本語 · 中国語" },
    ],
    howIWork: [
      {
        title: "顧客と一緒に要件を定める",
        body: "起点はモデルではなく業務フロー。AIを信頼できる範囲はどこか、どこで人間の承認が必須かを最初に決めます。",
      },
      {
        title: "パイプラインを構築する",
        body: "検索、オーケストレーション、ガードレール、コストとレイテンシの予算設計まで——ノートブックのデモではなく本番コードとして。",
      },
      {
        title: "評価で証明する",
        body: "正解データ、採点基準、変更のたびの再評価。「動いている」を感覚ではなく数値で示します。",
      },
    ],
    focusTags,
    rolesSought: [
      "アプライドAIエンジニア",
      "Forward Deployed Engineer",
      "AIプロダクトエンジニア",
    ],
    languages: ["中国語（母語）", "英語", "日本語", "韓国語"],
    social,
    features,
  },
}
