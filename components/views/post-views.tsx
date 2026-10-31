import { notFound, permanentRedirect } from "next/navigation"
import { PostArticle, type Crumb } from "@/components/posts/post-article"
import { SeriesView } from "@/components/posts/series-view"
import { NotTranslatedView } from "@/components/views/not-translated-view"
import {
  getAllSortedWritings,
  getAllSortedWritingCollections,
  getAllSortedWritingSeries,
  getWritingBySlug,
  getWritingHref,
} from "@/lib/content"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { localeHref, type Lang } from "@/lib/i18n/config"
import { buildStandardMetadata } from "@/lib/seo/metadata"

// /posts/[slugOrCollection] — a standalone post, a "Part N of M" sequence
// (posts sharing `partOf`) or a folder series — and
// /posts/[slugOrCollection]/[slug], a post inside a folder series.
//
// JA only: a URL whose post or series exists in EN but isn't translated yet
// shows a "not translated yet" page linking to the English version instead
// of a 404. EN is always the original, so it has no such fallback.

// ---------------------------------------------------------------------------
// /posts/[slugOrCollection]

export function slugOrCollectionStaticParams(lang: Lang) {
  const writings = getAllSortedWritings(lang)
  const standaloneSlugs = writings.filter((w) => !w.metadata.series).map((w) => w.slug)
  const sequenceSlugs = getAllSortedWritingSeries(lang).map((s) => s.slug)
  const folderSlugs = writings.map((w) => w.metadata.series).filter(Boolean) as string[]

  return Array.from(new Set([...standaloneSlugs, ...sequenceSlugs, ...folderSlugs])).map(
    (slugOrCollection) => ({ slugOrCollection })
  )
}

export function slugOrCollectionMetadata(lang: Lang, slugOrCollection: string) {
  const t = dictionaries[lang].post
  const pathname = localeHref(lang, `/posts/${slugOrCollection}`)

  const candidate = getWritingBySlug(slugOrCollection, lang)
  const writing = candidate && !candidate.metadata.series ? candidate : undefined
  if (writing) {
    const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata
    return buildStandardMetadata({
      title,
      description,
      pathname: localeHref(lang, `/posts/${writing.slug}`),
      type: "article",
      publishedTime,
      image,
      // "Coming soon" placeholders are thin pages: keep them out of search results.
      noIndex: writing.metadata.placeholder,
    })
  }

  // A folder wins over a `partOf` sequence of the same slug (see the view below).
  const collection = getAllSortedWritingCollections(lang).find((s) => s.slug === slugOrCollection)
  if (collection) {
    return buildStandardMetadata({
      title: t.collectionTitle(collection.title),
      description: t.collectionDescription(collection.title, collection.items.length),
      pathname,
    })
  }

  const series = getAllSortedWritingSeries(lang).find((s) => s.slug === slugOrCollection)
  if (series) {
    return buildStandardMetadata({
      title: t.collectionTitle(series.title),
      description: t.seriesDescription(series.title, series.items.length),
      pathname,
    })
  }

  return buildStandardMetadata({
    title: t.notFoundTitle,
    description: t.notFoundDescription,
    pathname,
  })
}

export function SlugOrCollectionView({ lang, slugOrCollection }: { lang: Lang; slugOrCollection: string }) {
  const t = dictionaries[lang]
  const writings = getAllSortedWritings(lang)
  const writing = getWritingBySlug(slugOrCollection, lang)

  // Posts inside a collection live at /posts/<collection>/<slug>; send the
  // short /posts/<slug> form (and old /work/<slug> links) there.
  if (writing?.metadata.series) {
    permanentRedirect(getWritingHref(writing, lang))
  }

  if (writing) {
    const { partOf } = writing.metadata
    const postsHref = localeHref(lang, "/posts")
    const crumbs: Crumb[] = [{ label: t.nav.posts, href: postsHref }]
    if (partOf) {
      crumbs.push({
        label: writing.metadata.partOfTitle ?? partOf,
        href: localeHref(lang, `/posts/${partOf}`),
      })
    }

    return (
      <PostArticle
        writing={writing}
        lang={lang}
        crumbs={crumbs}
        backHref={partOf ? localeHref(lang, `/posts/${partOf}`) : postsHref}
        backLabel={partOf ? t.nav.backToSeriesTop : t.nav.backToAllPosts}
        canonicalPath={localeHref(lang, `/posts/${writing.slug}`)}
        prevNext={{
          items: writings.filter((w) => !w.metadata.series),
          linkFor: (item) => localeHref(lang, `/posts/${item.slug}`),
        }}
        partHref={(item) => getWritingHref(item, lang)}
        headerSpacing="mb-6"
      />
    )
  }

  // The sidebar always shows folder-based collections (the canonical
  // series, per the directory structure under app/writings/posts), regardless
  // of which kind of collection page is being rendered below.
  const collections = getAllSortedWritingCollections(lang)
  const sidebarSeries = collections.map((s) => ({
    slug: s.slug,
    title: s.title,
    count: s.items.length,
  }))

  // A folder-based collection (posts sharing `series`). Checked before
  // `partOf` sequences because a sequence can share its folder's slug (e.g.
  // "design-in-git") while the folder also holds posts outside the sequence,
  // like its hub post; the folder is what the sidebar counts.
  const collection = collections.find((s) => s.slug === slugOrCollection)
  if (collection) {
    return (
      <SeriesView
        seriesSlug={collection.slug}
        seriesTitle={collection.title}
        items={collection.items}
        allSeries={sidebarSeries}
        lang={lang}
      />
    )
  }

  // A reading series (posts sharing `partOf`) with no folder of its own.
  const activeSeries = getAllSortedWritingSeries(lang).find((s) => s.slug === slugOrCollection)
  if (activeSeries) {
    return (
      <SeriesView
        seriesSlug={activeSeries.slug}
        seriesTitle={activeSeries.title}
        items={activeSeries.items}
        allSeries={sidebarSeries}
        lang={lang}
      />
    )
  }

  if (lang === "ja") {
    const englishWriting = getWritingBySlug(slugOrCollection, "en")
    if (englishWriting) {
      return <NotTranslatedView englishHref={getWritingHref(englishWriting, "en")} />
    }
    const hasEnglishSeries =
      getAllSortedWritingSeries("en").some((s) => s.slug === slugOrCollection) ||
      getAllSortedWritings("en").some((w) => w.metadata.series === slugOrCollection)
    if (hasEnglishSeries) {
      return <NotTranslatedView englishHref={`/posts/${slugOrCollection}`} />
    }
  }

  notFound()
}

// ---------------------------------------------------------------------------
// /posts/[slugOrCollection]/[slug]

type CollectionPostParams = { slugOrCollection: string; slug: string }

export function collectionPostStaticParams(lang: Lang): CollectionPostParams[] {
  return getAllSortedWritings(lang)
    .filter((w) => w.metadata.series)
    .map((w) => ({ slugOrCollection: w.metadata.series as string, slug: w.slug }))
}

export function collectionPostMetadata(lang: Lang, params: CollectionPostParams) {
  const writing = getWritingBySlug(params.slug, lang)
  if (!writing || writing.metadata.series !== params.slugOrCollection) return

  const { title, publishedAt: publishedTime, summary: description, image } = writing.metadata
  return buildStandardMetadata({
    title,
    description,
    pathname: localeHref(lang, `/posts/${params.slugOrCollection}/${writing.slug}`),
    type: "article",
    publishedTime,
    image,
    // "Coming soon" placeholders are thin pages: keep them out of search results.
    noIndex: writing.metadata.placeholder,
  })
}

export function CollectionPostView({ lang, params }: { lang: Lang; params: CollectionPostParams }) {
  const t = dictionaries[lang]
  const collection = params.slugOrCollection
  const writing = getWritingBySlug(params.slug, lang)

  if (!writing || writing.metadata.series !== collection) {
    if (lang === "ja") {
      const englishWriting = getWritingBySlug(params.slug, "en")
      if (englishWriting && englishWriting.metadata.series === collection) {
        return <NotTranslatedView englishHref={getWritingHref(englishWriting, "en")} />
      }
    }
    notFound()
  }

  const { partOf } = writing.metadata
  const crumbs: Crumb[] = [
    { label: t.nav.posts, href: localeHref(lang, "/posts") },
    {
      label: writing.metadata.seriesTitle ?? collection,
      href: localeHref(lang, `/posts/${collection}`),
    },
  ]
  if (partOf && partOf !== collection) {
    crumbs.push({
      label: writing.metadata.partOfTitle ?? partOf,
      href: localeHref(lang, `/posts/${partOf}`),
    })
  }

  // Back to the multi-part sequence if there is one, else the folder series.
  const seriesTop = partOf ?? collection

  return (
    <PostArticle
      writing={writing}
      lang={lang}
      crumbs={crumbs}
      backHref={localeHref(lang, `/posts/${seriesTop}`)}
      backLabel={t.nav.backToSeriesTop}
      canonicalPath={localeHref(lang, `/posts/${collection}/${writing.slug}`)}
      prevNext={{
        items: getAllSortedWritings(lang).filter((w) => w.metadata.series === collection),
        linkFor: (item) => localeHref(lang, `/posts/${collection}/${item.slug}`),
      }}
      partHref={(item) => getWritingHref(item, lang)}
    />
  )
}
