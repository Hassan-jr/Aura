import { getPosts } from "@/actions/fetch.actions";
import { MakePostDialog } from "@/components/posts/make-post-dialog";
import PostsCardsComponent from './postCard'


export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="p-2">
      <div className="w-full flex flex-row justify-between align-middle mb-5">
        <h1 className="text-2xl font-bold mb-4">Posts Management</h1>
        <MakePostDialog />
      </div>

      {/* <div className="w-80 flex flex-row gap-1">
        {posts.map((post, index) => (
          <PostCard
            key={index}
            id={post.id}
            title={post.title}
            description={post.description}
            hashtags={post.hashtags}
            images={post?.images}
          />
        ))}
      </div> */}

      <PostsCardsComponent posts={posts} />
    </main>
  );
}
