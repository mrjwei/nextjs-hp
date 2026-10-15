import "../global.css"

import { RootLayoutView, rootMetadata } from "@/components/views/root-layout"

export const metadata = rootMetadata("en")

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutView lang="en">{children}</RootLayoutView>
}
