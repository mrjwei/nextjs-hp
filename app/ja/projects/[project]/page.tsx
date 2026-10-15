import { ProjectPageView, projectMetadata, projectStaticParams } from "@/components/views/project-views"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return projectStaticParams("ja")
}

export function generateMetadata({ params }) {
  return projectMetadata("ja", params.project)
}

export default function Page({ params }) {
  return <ProjectPageView lang="ja" projectSlug={params.project} />
}
