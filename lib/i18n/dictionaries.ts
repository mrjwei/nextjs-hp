import type { Lang } from "@/lib/i18n/config"

// UI strings for the page views in components/views/. Each page renders the
// same markup in both languages; only these strings (and the locale prefix
// on links) differ. Smaller components keep their own `copy` records.

type Dictionary = {
  nav: {
    home: string
    posts: string
    projects: string
    series: string
    backToAllPosts: string
    backToSeriesTop: string
  }
  home: {
    ctaProjects: string
    ctaAbout: string
    emailMe: string
    projectsEyebrow: string
    projectsHeading: string
    seeAll: string
    processEyebrow: string
    processHeading: string
    writingEyebrow: string
    writingHeading: string
    allPosts: string
  }
  about: {
    title: string
    eyebrow: string
    heading: string
    avatarAlt: string
    /** CV downloads, in this language's preferred order. */
    cvLinks: { href: string; label: string }[]
  }
  posts: {
    title: string
    description: string
    /** EN only: JA falls back to a link to the English posts instead. */
    noPosts?: string
    noPostsForTags: string
    viewAllPosts: string
    /** JA only: label of the link to the English posts when none are translated yet. */
    seeEnglishPosts?: string
  }
  seriesIndex: {
    title: string
    description: string
    count: (n: number) => string
  }
  projects: {
    title: string
    description: string
    intro: string
    /** JA only, as `seeEnglishPosts`. */
    seeEnglishProjects?: string
    /** `<title>` of a project page. */
    pageTitle: (id: string) => string
    backTo: (id: string) => string
  }
  post: {
    published: string
    updated: string
    similar: string
    /** `<title>` and description of a series or collection page. */
    collectionTitle: (title: string) => string
    seriesDescription: (title: string, n: number) => string
    collectionDescription: (title: string, n: number) => string
    notFoundTitle: string
    notFoundDescription: string
  }
  notFound: {
    heading: string
    body: string
    backHome: string
  }
}

export const dictionaries: Record<Lang, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      posts: "Posts",
      projects: "Projects",
      series: "Series",
      backToAllPosts: "Back to All Posts",
      backToSeriesTop: "Back to Series Top",
    },
    home: {
      ctaProjects: "See selected projects",
      ctaAbout: "About me",
      emailMe: "Email me",
      projectsEyebrow: "Projects",
      projectsHeading: "Selected projects",
      seeAll: "See all",
      processEyebrow: "Process",
      processHeading: "How I work",
      writingEyebrow: "Writing",
      writingHeading: "Selected writing",
      allPosts: "All posts",
    },
    about: {
      title: "About",
      eyebrow: "About",
      heading: "About me",
      avatarAlt: "Jesse Wei's avatar",
      cvLinks: [
        { href: "/cv/jesse-wei-cv-en.pdf", label: "Download CV (EN)" },
        { href: "/cv/jesse-wei-shokumukeirekisho-ja.pdf", label: "Download CV (JA)" },
      ],
    },
    posts: {
      title: "Posts",
      description:
        "Technical and design writing — cryptography, AI agents, design systems, and the reasoning behind them.",
      noPosts: "No posts found.",
      noPostsForTags: "No posts found for those tags.",
      viewAllPosts: "View all posts",
    },
    seriesIndex: {
      title: "Series",
      description: "Browse all post series.",
      count: (n) => `${n} series of related writings.`,
    },
    projects: {
      title: "Projects",
      description:
        "Selected projects — product design, engineering and AI work for real businesses.",
      intro:
        "Product design, engineering and AI work for real businesses. Each one is written up in full under Posts.",
      pageTitle: (id) => `${id} — Projects`,
      backTo: (id) => `Back to ${id}`,
    },
    post: {
      published: "Published:",
      updated: "Updated:",
      similar: "You May Also Like",
      collectionTitle: (title) => `Posts — ${title}`,
      seriesDescription: (title, n) => `${n} posts in the "${title}" series.`,
      collectionDescription: (title, n) => `${n} posts in the "${title}" collection.`,
      notFoundTitle: "Not Found",
      notFoundDescription: "This page could not be found.",
    },
    notFound: {
      heading: "404 - Page Not Found",
      body: "The page you are looking for does not exist.",
      backHome: "Back to home",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      posts: "記事",
      projects: "プロジェクト",
      series: "シリーズ",
      backToAllPosts: "記事一覧に戻る",
      backToSeriesTop: "シリーズトップに戻る",
    },
    home: {
      ctaProjects: "代表的なプロジェクトを見る",
      ctaAbout: "プロフィール",
      emailMe: "メールで連絡する",
      projectsEyebrow: "プロジェクト",
      projectsHeading: "代表的なプロジェクト",
      seeAll: "すべて見る",
      processEyebrow: "Process",
      processHeading: "仕事の進め方",
      writingEyebrow: "記事",
      writingHeading: "主な記事",
      allPosts: "すべて見る",
    },
    about: {
      title: "プロフィール",
      eyebrow: "プロフィール",
      heading: "私について",
      avatarAlt: "Jesse Weiのアバター画像",
      cvLinks: [
        { href: "/cv/jesse-wei-shokumukeirekisho-ja.pdf", label: "職務経歴書をダウンロード（日本語）" },
        { href: "/cv/jesse-wei-cv-en.pdf", label: "CV（英語）をダウンロード" },
      ],
    },
    posts: {
      title: "記事",
      description:
        "デザイン・技術に関する記事——暗号技術、AIエージェント、デザインシステム、そしてその背後にある考え方について。",
      noPostsForTags: "該当するタグの記事が見つかりませんでした。",
      viewAllPosts: "すべての記事を見る",
      seeEnglishPosts: "英語版の記事を見る",
    },
    seriesIndex: {
      title: "シリーズ",
      description: "すべてのシリーズを見る。",
      count: (n) => `関連記事のシリーズ ${n}件。`,
    },
    projects: {
      title: "プロジェクト",
      description:
        "選定したプロジェクト——実際の事業のために手がけた、プロダクトデザイン・開発・生成AIの仕事",
      intro:
        "選定したプロジェクト——実際の事業のために手がけた、プロダクトデザイン・開発・生成AIの仕事",
      seeEnglishProjects: "英語版のプロジェクトを見る",
      pageTitle: (id) => `${id} — プロジェクト`,
      backTo: (id) => `${id}に戻る`,
    },
    post: {
      published: "公開日:",
      updated: "更新日:",
      similar: "あわせて読みたい",
      collectionTitle: (title) => `記事 — ${title}`,
      seriesDescription: (title, n) => `「${title}」シリーズの記事 ${n}件。`,
      collectionDescription: (title, n) => `「${title}」の記事 ${n}件。`,
      notFoundTitle: "見つかりません",
      notFoundDescription: "このページは見つかりませんでした。",
    },
    notFound: {
      heading: "404 - ページが見つかりません",
      body: "お探しのページはまだ日本語版が用意されていないか、存在しません。",
      backHome: "ホームに戻る",
    },
  },
}
