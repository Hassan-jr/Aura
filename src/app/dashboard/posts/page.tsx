"use client";
import { MakePostDialog } from "@/components/posts/make-post-dialog";
import PostsCardsComponent from "./postCard";
import { useAppSelector } from "@/redux/hooks";
import { selectposts } from "@/redux/slices/post";
import ImageVideoPlayer from "@/components/video/image-video-player";

export default function Home() {
  const posts = useAppSelector(selectposts);
  const images = [
    "https://picsum.photos/800/450?random=1",
    "https://picsum.photos/800/450?random=2",
    "https://picsum.photos/800/450?random=3",
    "https://picsum.photos/800/450?random=4",
    "https://picsum.photos/800/450?random=5",
    "https://picsum.photos/800/450?random=6",
    "https://picsum.photos/800/450?random=7",
    "https://picsum.photos/800/450?random=8",
    "https://picsum.photos/800/450?random=9",
    "https://picsum.photos/800/450?random=10",
    "https://picsum.photos/800/450?random=11",
    "https://picsum.photos/800/450?random=12",
    "https://picsum.photos/800/450?random=13",
    "https://picsum.photos/800/450?random=14",
    "https://picsum.photos/800/450?random=15",
    "https://picsum.photos/800/450?random=16",
    "https://picsum.photos/800/450?random=17",
    "https://picsum.photos/800/450?random=18",
    "https://picsum.photos/800/450?random=19",
    "https://picsum.photos/800/450?random=20",
  ];

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
