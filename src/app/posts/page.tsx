"use client"
import Navheader from "@/customui/navheader";
import { MakePostDialog } from "@/components/posts/make-post-dialog";
import PostCard from "@/components/posts/post-card";
import { useAppSelector } from "@/redux/hooks";
import { selectProducts } from "@/redux/slices/product";
import { selectposts } from "@/redux/slices/post";

export default function Home() {

 const products = useAppSelector(selectProducts);
 const posts = useAppSelector(selectposts);

  return (
    <Navheader>
      <main className="p-2">
        <div className="w-full flex flex-row justify-between align-middle mb-5">
          <h1 className="text-2xl font-bold mb-4">Posts</h1>
          <MakePostDialog />
        </div>

        <div className="w-full flex flex-row flex-wrap gap-10">
          {posts.map((post, index) => (
            <div key={index} className="w-80 flex flex-row gap-1">
              <PostCard
                id={post.productId}
                title={post.title}
                description={post.description}
                hashtags={post.hashtags}
                images={post?.images}
                bid={post.userId}
                products={products}
                genId={post?.generationId ? post?.generationId : null}
              />
            </div>
          ))}
        </div>
      </main>
    </Navheader>
  );
}
