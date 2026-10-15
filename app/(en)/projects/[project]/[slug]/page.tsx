import {
  ProjectPostPageView,
  projectPostMetadata,
  projectPostStaticParams,
} from "@/components/views/project-views"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return projectPostStaticParams("en")
}

export function generateMetadata({ params }) {
  return projectPostMetadata("en", params)
}

export default function Page({ params }) {
  return <ProjectPostPageView lang="en" params={params} />
}
