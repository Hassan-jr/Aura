"use client"
import { MakePostDialog } from "@/components/posts/make-post-dialog";
import PostsCardsComponent from './postCard'
import { useAppSelector } from "@/redux/hooks";
import { selectposts } from "@/redux/slices/post";


export default function Home() {
  const posts = useAppSelector(selectposts);

  return (
    <main className="p-2">
      <div className="w-full flex flex-row justify-between align-middle mb-5">
        <h1 className="text-2xl font-bold mb-4">Posts Management</h1>
        <MakePostDialog />
      </div>

      <PostsCardsComponent posts={posts} />
    </main>
  );
}
