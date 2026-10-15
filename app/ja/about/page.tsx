import { AboutView, aboutMetadata } from "@/components/views/about-view"

export const metadata = aboutMetadata("ja")

export default function Page() {
  return <AboutView lang="ja" />
}
