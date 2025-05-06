"use client";
import React, { useEffect, useState } from "react";
import PostCard from "@/components/posts/post-card";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";
import { Card } from "@/components/ui/card";

function PostsCardsComponent({ posts }) {
  const productId = useAppSelector(selectProductId);
  const [productPosts, setProductPosts] = useState([]);

  useEffect(() => {
    const filteredPosts = posts?.filter((post) => post.productId == productId);
    setProductPosts(filteredPosts)
  }, [productId]);
  return (
    <div className="w-80 flex flex-row gap-1">
      {productPosts?.map((post, index) => (
        <PostCard
          key={index}
          id={post.productId}
          title={post.title}
          description={post.description}
          hashtags={post.hashtags}
          images={post?.images}
          bid="" // test
          products={productPosts} //test
          genId={post?.generationId ? post?.generationId : null}

        />
      ))}

      {/* no posts */}
      {productPosts.length == 0 && (<Card className="p-5">
        no posts available for this product
      </Card>)}
    </div>
  );
}

export default PostsCardsComponent;
