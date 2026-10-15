import { ProjectPageView, projectMetadata, projectStaticParams } from "@/components/views/project-views"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return projectStaticParams("en")
}

export function generateMetadata({ params }) {
  return projectMetadata("en", params.project)
}

export default function Page({ params }) {
  return <ProjectPageView lang="en" projectSlug={params.project} />
}
