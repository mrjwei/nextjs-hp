import type { Lang } from "app/i18n/config"

export type SocialId = "linkedin" | "github" | "instagram" | "email"

export type Social = {
  id: SocialId
  href: string
  inHeader: boolean
}

export type ProofItem = { label: string; href?: string }

export type HowIWorkItem = { title: string; body: string; href?: string }

export type Profile = {
  role: string
  eyebrow: string
  headline: string
  subhead: string
  meta: { title: string; description: string }
  /** ISO date in `updated`. */
  availability: { open: boolean; text: string; updated: string }
  proof: ProofItem[]
  howIWork: HowIWorkItem[]
  focusTags: string[]
  rolesSought: string[]
  languages: string[]
  social: Social[]
  features: {
    galleryInNav: boolean
    advisory: boolean
    newsletter: boolean
    now: boolean
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
    inHeader: true,
  },
]

const features = {
  galleryInNav: true,
  advisory: false,
  newsletter: true,
  now: false,
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
    availability: {
      open: true,
      text: "Open to applied AI / FDE roles · Tokyo & Australia · from early 2027",
      updated: "2026-09-23",
    },
    proof: [],
    howIWork: [],
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
    availability: {
      open: true,
      text: "求職中 · 東京／オーストラリア · 2027年初頭から",
      updated: "2026-09-23",
    },
    proof: [],
    howIWork: [],
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
