import Navheader from '@/customui/navheader'
import { MakePostDialog } from "@/components/posts/make-post-dialog";
import PostCard from "@/components/posts/post-card";
import { connect } from '@/db'
import { Post } from "@/modals/post.modal";

async function getPosts() {
    await connect()
    const posts = await Post.find().sort({ createdAt: -1 })
    return posts
  }

export default async function Home() {
    const posts = await getPosts()
    console.log(posts);

  return (
    <Navheader>
    <main className="p-2">
      <div className="w-full flex flex-row justify-between align-middle mb-5">
        <h1 className="text-2xl font-bold mb-4">Post Management</h1>
        <MakePostDialog />
      </div>
     
      <div className="w-80 flex flex-row gap-1">
        {posts.map((post, index) => (
          <PostCard key={index} id={post.id} title={post.title} description={post.description} hashtags={post.hashtags} images={post.images} />
        ))}
      </div>
    </main>
    </Navheader>
  );
}
