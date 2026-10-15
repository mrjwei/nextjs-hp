import { ProjectsIndexView, projectsIndexMetadata } from "@/components/views/index-views"

export const metadata = projectsIndexMetadata("ja")

export const dynamic = "force-static"

export default function Page() {
  return <ProjectsIndexView lang="ja" />
}
