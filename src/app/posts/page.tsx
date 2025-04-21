import Navheader from '@/customui/navheader'
import { MakePostDialog } from "@/components/posts/make-post-dialog";
import PostCard from "@/components/posts/post-card";
import { connect } from '@/db'
import { Post } from "@/modals/post.modal";
import { getProducts } from "@/actions/fetch.actions";

async function getPosts() {
    await connect()
    const posts = await Post.find().sort({ createdAt: -1 })
    return posts
  }

export default async function Home() {
    const posts = await getPosts()
    const products = await getProducts();
    // console.log(posts);

    const images = [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob2VzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNob2VzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1570464197285-9949814674a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNob2VzfGVufDB8fDB8fHww",
    ];

  return (
    <Navheader>
    <main className="p-2">
      <div className="w-full flex flex-row justify-between align-middle mb-5">
        <h1 className="text-2xl font-bold mb-4">Posts</h1>
        <MakePostDialog />
      </div>
     
      <div className="w-80 flex flex-row gap-1">
        {posts.map((post, index) => (
          <PostCard key={index} id={post.productId} title={post.title} description={post.description} hashtags={post.hashtags} images={post?.images} bid={post.userId} products={products} />
        ))}
      </div>
    </main>
    </Navheader>
  );
}
