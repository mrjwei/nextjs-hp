import { readContentIndex } from "@/lib/content"

// Static: answers with the day this deployment was built. The scheduled-publish
// workflow and the Vercel ignore step compare it with post dates to tell whether
// a post that's due is live yet (scripts/due-posts.mjs).
export const dynamic = "force-static"

export function GET() {
  const index = readContentIndex()
  return Response.json({
    siteDate: index?.siteDate ?? null,
    generatedAt: index?.generatedAt ?? null,
  })
}
