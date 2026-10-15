import { PostsIndexView, postsIndexMetadata } from "@/components/views/index-views"

export const metadata = postsIndexMetadata("ja")

export const dynamic = "force-static"

export default function Page() {
  return <PostsIndexView lang="ja" />
}
