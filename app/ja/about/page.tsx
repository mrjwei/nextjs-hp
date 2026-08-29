import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "@/components/footer"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "プロフィール",
  description:
    "Jesse Weiは日本を拠点に活動するプロダクトデザイナー兼エンジニアです。デザイン文化の醸成、デザイン主導の開発ワークフロー、保守可能なデザインシステムの構築に10年携わってきました。",
  pathname: "/ja/about",
  alternatePathname: "/about",
  alternateLang: "en",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <span className="eyebrow">プロフィール</span>
      <h1 className="mt-3 mb-10 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">
        私について
      </h1>
      <div className="grid grid-cols-12 gap-8 md:gap-16">
        <div className="text-[var(--text-body)] col-span-12 order-2 md:col-span-8 md:order-1">
          <p className="mb-4">
            はじめまして、Jesse Weiと申します。日本を拠点に活動する
            <strong className="text-[var(--text-strong)]">
              プロダクトデザイナー兼エンジニア
            </strong>
            です。10年にわたり、実際に使われるプロダクトを企業とともに作ってきましたが、長く残った価値はインターフェースそのものではなく、その周辺にあるものでした。
            <strong className="text-[var(--text-strong)]">
              デザイン文化が存在しなかった組織にそれを根付かせること、デザイン主導の開発ワークフロー、そして作った本人がいなくなった後も保守可能であり続けるデザインシステム
            </strong>
            です。
          </p>
          <p className="mb-4">
            この視点は、少し変わったキャリアの積み重ねから来ています。キャリアの出発点はプロダクトデザインでしたが、インターフェースの裏側で何が起きているのかへの好奇心がエンジニアリングへと私を導き、オーストラリアでITの修士号を取得してその方向転換を確かなものにしました。現在はデザインと本番用のコードの両方を手がけており、それによって
            <strong className="text-[var(--text-strong)]">
              ユーザビリティ、ビジネス目標、エンジニアリング上の制約が、引き継ぎのたびに失われることなく、ひとつの意思決定の中に留まります
            </strong>
            。キャリアの大半を制約の多い環境——レガシーシステム、少人数チーム、デジタル変革がまだ馴染みのない業界——で過ごしてきたため、理想的な選択ではなく、道理にかなった妥協点を見出すことが仕事の中心でした。
            <strong className="text-[var(--text-strong)]">
              中国語（母語）、英語、日本語、韓国語
            </strong>
            を使って仕事をしており、グローバルな視点を日本のビジネス慣習に持ち込んでいます。これは見た目以上に重要な意味を持ちます。私の仕事の多くは、何らかの形での「翻訳」だからです。
          </p>

          <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
            これまでの実績
          </h2>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              DEN株式会社 — 社会福祉、7年間。
            </strong>{" "}
            紙ベースの運用だった従業員20名の施設を、AIを活用したデジタルワークフローを持つ、従業員約100名規模の複数施設事業へと成長させる支援をしました。従業員の生産性と利益はともに向上し、月間数千ドル規模の収益が、今では誰も手を動かさずに自動で発生し続けています。社会福祉は日本で最もデジタル化が遅れている業界のひとつであり、これは何もせずに得られる結果ではありませんでした。
          </p>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              Zerospec株式会社 — エネルギー、チーム初のデザイナーとして。
            </strong>{" "}
            主力製品である燃料配送効率化のためのWebアプリケーションは、意図的なUI/UXデザインを経ずにリリースされていました。ユーザビリティ、ビジネス目標、実際のリソースの制約のバランスを取りながら、段階的でプロトタイプ駆動、実装と歩調を合わせたプロセスを導入し、フィードバックループを短縮するとともに、デザインから開発への引き継ぎをほぼシームレスにしました。そのうえで、それを支えるデザインシステムを構築しました。より難しかったのは文化的な側面です。デザインを誰も本気で捉えていなかった会社を、デザインを前提に計画を立てる会社へと変えていくことでした。
          </p>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              WAmazing株式会社 — スキー場リフト券予約、デザインと開発。
            </strong>{" "}
            レガシーコード、複雑なアーキテクチャ、そして繁忙期にダウンタイムの余地が一切ないビジネス。提案するすべての変更は、実行する価値があるかどうかをエンジニアリング上のリスクとして事前に見積もる必要がありました。実際の開発経験を持つチーム唯一のプロダクトデザイナーとして、私がそのリスク見積もりを担い、サービスを不安定にすることなく、改善と新機能が継続的にリリースされるよう、デザインと開発の調整を行いました。
          </p>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              マネーフォワード株式会社 — HR Cloud、フロントエンドリード。
            </strong>{" "}
            エンタープライズ向けHR SaaSプロダクトのフロントエンド開発をリードし、チームにはひとつのルールを徹底しました。コードへの変更は、ユーザーにとってより良い体験によってのみ正当化されるべきであり、その逆であってはならない、というものです。エンジニアリング上の都合は、インターフェースの品質にとって静かに、しかし常にかかり続ける圧力です。コードとデザインの両方の立場から議論できる人間であることが、このルールを維持できた理由です。
          </p>

          <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
            これから目指すもの
          </h2>
          <p className="mb-4">
            私が最も関心を持っているのは、
            <strong className="text-[var(--text-strong)]">
              責任を持って構築されたAIネイティブなデザインワークフロー
            </strong>
            です——デザイナーを不要にするのではなく、デザイナーの働き方そのものを変えるツールです。具体的には、デザインの意図や判断根拠、ドキュメント、再現可能なプロセスこそを本当の成果物として扱うこと。ソフトウェアエンジニアリングの考え方をデザインの実践に取り入れ、デザインしたものが実際に作れて、かつビジネス目標に耐えうるものにすること。そして、事業のオーナーと直接向き合い、デザイン、AI、その他本当に役立つあらゆる手段を使って、業務の進め方そのものを再考することです。
          </p>
          <p>
            この領域での仕事や協業の機会を探しています。連絡先は
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <span>LinkedIn</span>
            </Link>
            <span>、</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <span>GitHub</span>
            </Link>
            <span>、</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/mrjwei/"
            >
              <ArrowIcon />
              <span>Instagram</span>
            </Link>
            <span>から。</span>
          </p>
        </div>
        <div className="col-12 order-1 md:col-span-4 md:order-2">
          <Image
            src="/avatar.png"
            alt="Jesse Weiのアバター画像"
            width={563}
            height={517}
            className="max-w-[160px] h-auto rounded-lg"
            sizes="160px"
            priority
          />
        </div>
      </div>
    </section>
  )
}
