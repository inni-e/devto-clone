import { api } from "~/utils/api";
import PostCard from "../post/PostCard";
import LoadingPostCard from "../post/LoadingPostCard";

export default function PostsView() {
  const { data: posts, isLoading, error } = api.post.getAll.useQuery();

  if (error) return <div>Error occured {error.message}</div>

  return (

    <>
      <div className="flex justify-start">
        <button className="h-10 px-4 py-2 font-bold text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
          Relevant
        </button>
        <button className="h-10 px-4 py-2 text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
          Latest
        </button>
        <button className="h-10 px-4 py-2 text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
          Top
        </button>
      </div>
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