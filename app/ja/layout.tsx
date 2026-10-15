import "../global.css"

import { RootLayoutView, rootMetadata } from "@/components/views/root-layout"

export const metadata = rootMetadata("ja")

export default function JaRootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutView lang="ja">{children}</RootLayoutView>
}
