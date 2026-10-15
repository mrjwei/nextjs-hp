import { SeriesIndexPageView, seriesIndexMetadata } from "@/components/views/index-views"

export const metadata = seriesIndexMetadata("en")

export const dynamic = "force-static"

export default function Page() {
  return <SeriesIndexPageView lang="en" />
}
