import {
  ProjectPostPageView,
  projectPostMetadata,
  projectPostStaticParams,
} from "@/components/views/project-views"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return projectPostStaticParams("ja")
}

export function generateMetadata({ params }) {
  return projectPostMetadata("ja", params)
}

export default function Page({ params }) {
  return <ProjectPostPageView lang="ja" params={params} />
}
