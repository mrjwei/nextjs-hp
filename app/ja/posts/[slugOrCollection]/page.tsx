import {
  SlugOrCollectionView,
  slugOrCollectionMetadata,
  slugOrCollectionStaticParams,
} from "@/components/views/post-views"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return slugOrCollectionStaticParams("ja")
}

export function generateMetadata({ params }) {
  return slugOrCollectionMetadata("ja", params.slugOrCollection)
}

export default function Page({ params }) {
  return <SlugOrCollectionView lang="ja" slugOrCollection={params.slugOrCollection} />
}
