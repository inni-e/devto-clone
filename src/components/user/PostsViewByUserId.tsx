import { api } from "~/utils/api";
import PostCard from "../post/PostCard";
import LoadingPostCard from "../post/LoadingPostCard";

export default function PostsView({ userId: userId }: { userId: string }) {
  const { data: posts, isLoading, error } = api.post.getPostsByUserId.useQuery({ id: userId });

  if (error) return <div>Error occured {error.message}</div>

  return (
    <>
      {isLoading ?
        <>
          <LoadingPostCard />
          <LoadingPostCard />
        </>
        :
        posts?.map(post => <PostCard {...post} key={post.id} />)
      }
    </>
  );
}