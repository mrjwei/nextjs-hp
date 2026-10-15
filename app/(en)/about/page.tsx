import { AboutView, aboutMetadata } from "@/components/views/about-view"

export const metadata = aboutMetadata("en")

export default function Page() {
  return <AboutView lang="en" />
}
