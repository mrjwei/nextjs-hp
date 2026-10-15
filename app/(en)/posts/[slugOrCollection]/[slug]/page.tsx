import {
  CollectionPostView,
  collectionPostMetadata,
  collectionPostStaticParams,
} from "@/components/views/post-views"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return collectionPostStaticParams("en")
}

export function generateMetadata({ params }) {
  return collectionPostMetadata("en", params)
}

export default function Page({ params }) {
  return <CollectionPostView lang="en" params={params} />
}
