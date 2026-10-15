import {
  SlugOrCollectionView,
  slugOrCollectionMetadata,
  slugOrCollectionStaticParams,
} from "@/components/views/post-views"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return slugOrCollectionStaticParams("en")
}

export function generateMetadata({ params }) {
  return slugOrCollectionMetadata("en", params.slugOrCollection)
}

export default function Page({ params }) {
  return <SlugOrCollectionView lang="en" slugOrCollection={params.slugOrCollection} />
}
