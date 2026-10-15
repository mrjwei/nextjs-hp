import {
  CollectionPostView,
  collectionPostMetadata,
  collectionPostStaticParams,
} from "@/components/views/post-views"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return collectionPostStaticParams("ja")
}

export function generateMetadata({ params }) {
  return collectionPostMetadata("ja", params)
}

export default function Page({ params }) {
  return <CollectionPostView lang="ja" params={params} />
}
