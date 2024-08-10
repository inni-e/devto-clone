import { useRouter } from "next/router";
import { api } from '~/utils/api';
import { useEffect } from "react";

import Head from "next/head";
import NavBar from "~/components/NavBar";
import LoadingPostCard from "~/components/post/LoadingPostCard";
import SearchPostCard from "~/components/search/SearchPostCard";
import SearchSideBar from "~/components/search/SearchSideBar"

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;

  const { data: posts, refetch, isPending: isLoading } = api.post.searchPosts.useQuery(
    { query: query ? query as string : "" },
    { enabled: !!query }
  );

  useEffect(() => {
    if (query) {
      refetch().catch((error) => {
        console.error("Error refetching data:", error);
      });
    }
  }, [query, refetch]);

  if (!query) {
    return <p>Please enter a search term.</p>;
  }

  console.log("Here are the posts: ")
  console.log(posts);

  return (
    <>
      <Head>
        <title>Search results for: {query}</title>
        <meta name="description" content="Dev.to clone by Eoin" />
        <link rel="icon" href="/dev.png" />
      </Head>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-0 sm:px-4">
        <div className="w-3/4site min-h-screen flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold hidden sm:block">Search results for {query}</h1>
            <div className="flex justify justify-between">
            <button className="h-10 px-4 py-2 font-bold text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
              Most Relevant
            </button>
            <button className="h-10 px-4 py-2 text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
              Newest
            </button>
            <button className="h-10 px-4 py-2 text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
              Oldest
            </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <SearchSideBar />
            <div className="grow flex flex-col gap-2">
            {isLoading ?
              <>
                <LoadingPostCard />
                <LoadingPostCard />
              </>
              :
              posts?.map((post) => <SearchPostCard {...post} key={post.id} />)
            }
            {!isLoading && posts?.length === 0 && <p>No posts found!</p>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SearchPage;