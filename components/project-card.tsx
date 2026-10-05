import { WorkCard } from "@/components/work-card"
import { getProjectHref, hasProjectPage, type TProject } from "app/utils"
import type { Lang } from "app/i18n/config"

// One card per project (see groupProjects): the lead post's card, linking to
// the project page with an article count when the project spans several
// posts (in either language), or straight to the post when it's the only one.
export function ProjectCard({
  project,
  lang = "en",
}: {
  project: TProject
  lang?: Lang
}) {
  const count = project.items.length
  return (
    <WorkCard
      work={project.lead}
      lang={lang}
      href={hasProjectPage(project) ? getProjectHref(project.id, lang) : undefined}
      articleCount={count}
      wrapperProps={{ "data-work-track": project.track }}
    />
  )
}
