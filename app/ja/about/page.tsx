import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "@/components/footer"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "プロフィール",
  description:
    "Jesse Weiは日本を拠点とするアプライドAIエンジニアです。生成AI／LLMシステムを実際の業務に実装し、文書処理パイプライン、評価設計、顧客との要件整理から本番運用までを担当しています。10年のプロダクトデザイン・開発経験があります。",
  pathname: "/ja/about",
  alternatePathname: "/about",
  alternateLang: "en",
})

const strong = "text-[var(--text-strong)]"
const h2 =
  "mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]"
const extLink =
  "inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"

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
            はじめまして、Jesse Weiと申します。日本を拠点とする
            <strong className={strong}>アプライドAIエンジニア</strong>
            で、現在はブリスベンでIT修士課程の修了を控えています。数百ページに及ぶ技術マニュアルのチェック、法令に基づく記録文書の下書き、セキュリティアラートの一次判定など、生成AI／LLMシステムを実際の業務に組み込む仕事をしています。モデルの呼び出しと同じくらい、
            <strong className={strong}>
              評価設計、ガードレール、そして実際に使う人
            </strong>
            に時間をかけています。
          </p>
          <p className="mb-4">
            私はプロダクトの「使う側」からこの領域に来ました。B2Bプロダクトデザインに10年、フロントエンド開発のリードに3年以上携わるなかで、ソフトウェアが失敗するのはデモの段階ではなく、現場に定着する段階だと学びました。曖昧な要望を要件に落とし込み、
            <strong className={strong}>
              どこまでをモデルに任せ、どこから人が判断するか
            </strong>
            を決め、チームが毎日安心して使えるものとして届ける——AIエンジニアリングのうち、私が最も力を発揮できるのはこの部分です。
            <strong className={strong}>
              中国語（母語）、英語、日本語、韓国語
            </strong>
            で仕事ができることも、見た目以上に重要です。AIを業務に届ける仕事の多くは、何らかの形での「翻訳」だからです。
          </p>

          <h2 className={h2}>現在取り組んでいること</h2>
          <p className="mb-4">
            <strong className={strong}>
              日本の製造業向けLLM文書チェックシステム（受託開発）
            </strong>{" "}
            長大な産業用マニュアルをチェックするパイプラインです。PDFからのテキストおよびベクター図形（警告シンボル）の抽出、顧客自身が保守できるルールエンジン、LangGraphによるエージェントのオーケストレーションを組み合わせています。要件は顧客と直接、日本語で整理・調整しました。
          </p>
          <p className="mb-4">
            <strong className={strong}>
              複数拠点の福祉事業者向け、AIによる記録文書作成システム
            </strong>{" "}
            複数拠点にまたがるスプレッドシート運用を置き換える本番システムです。LLMが法令に基づく活動記録を下書きし、「コードによる決定的チェック」「LLMによる自己評価」「人による必須の最終確認」という三層の仕組みで、人が確認していないものは一切発行されない設計にしています。
          </p>
          <p className="mb-4">
            <strong className={strong}>
              LLMによるセキュリティトリアージの評価（QUT修了研究）
            </strong>{" "}
            Wazuh SIEM上で、14手法・146件のラベル付き攻撃に対する評価基盤を構築しました。最も有益だった発見はモデルそのものではなく、検知漏れの多くがログ設計に起因すること、そして甘い採点ルールが精度を20ポイント以上過大評価していたことでした。
          </p>
          <p className="mb-4">
            <strong className={strong}>LingoBun（自作のAIプロダクト）</strong>{" "}
            本番品質を前提に開発・強化した語彙学習アプリです。AI・音声合成呼び出しのレート制限とコスト上限、設定値の検証、180件の自動テストを備え、ユーザーテストを重ねて改善しています。
          </p>

          <h2 className={h2}>これまでの経歴</h2>
          <p className="mb-4">
            <strong className={strong}>
              株式会社DEN — 社会福祉、8年間。
            </strong>{" "}
            紙ベースの運用だった従業員20名の施設が、AIを活用したデジタルワークフローのもと、従業員約100名規模の複数施設事業へと成長するのを支援しました。従業員の生産性と利益はともに向上し、月間数千ドル規模の売上が人の手を介さずに生まれ続けています。社会福祉は日本で最もデジタル化が遅れている業界のひとつであり、これは自然に得られた結果ではありません。
          </p>
          <p className="mb-4">
            <strong className={strong}>
              株式会社マネーフォワード — HR Cloud、フロントエンドリード。
            </strong>{" "}
            エンタープライズ向けHR SaaSのフロントエンド開発をリードし、「コードの変更はユーザー体験の向上によって正当化されるべきであり、その逆ではない」というルールをチームで徹底しました。
          </p>
          <p className="mb-4">
            <strong className={strong}>
              WAmazing株式会社 — スキー場リフト券予約、デザインと開発。
            </strong>{" "}
            レガシーコードと、ダウンタイムが許されない繁忙期。あらゆる変更をまずエンジニアリングリスクとして見積もる役割を担い、予約フローの再設計によって繁忙期の問い合わせを週200件超から週4件程度まで削減しました。
          </p>
          <p className="mb-4">
            <strong className={strong}>
              Zerospec株式会社 — エネルギー、チーム初のデザイナー。
            </strong>{" "}
            プロトタイプ駆動・実装連携型のプロセスと、それを支えるデザインシステムを導入し、デザインを誰も重視していなかった会社を、デザインを前提に計画する会社へと変えていきました。
          </p>

          <h2 className={h2}>今後について</h2>
          <p className="mb-4">
            アプライドAIエンジニア、Forward Deployed Engineer、AIプロダクトエンジニアなど、「AIを実際の業務で機能させること」が仕事の中心となるポジションを、2027年初頭から東京またはオーストラリアで探しています。日本の企業にAIを導入しようとしているチームとの意見交換も歓迎です。
          </p>
          <p>
            ご連絡は
            <Link
              className={extLink}
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <span>LinkedIn</span>
            </Link>
            <span>または</span>
            <Link
              className={extLink}
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <span>GitHub</span>
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
