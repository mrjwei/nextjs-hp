import { ProjectsIndexView, projectsIndexMetadata } from "@/components/views/index-views"

export const metadata = projectsIndexMetadata("en")

export const dynamic = "force-static"

export default function Page() {
  return <ProjectsIndexView lang="en" />
}
