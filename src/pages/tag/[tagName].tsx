import { useRouter } from 'next/router';
import NavBar from '~/components/NavBar';
import SearchPostCard from '~/components/search/SearchPostCard';
import LoadingPostCard from "~/components/post/LoadingPostCard";
import { api } from "~/utils/api";
import TagLeftBar from '../../components/tag/TagLeftBar';
import TagRightBar from '../../components/tag/TagRightBar';

const TagPage = () => {
  const router = useRouter();
  const { tagName } = router.query;

  const { data: posts, isLoading, isError } = api.post.getPostsByTag.useQuery(
    { tagName: tagName as string },
    {
      enabled: !!tagName,
    }
  );

  console.log(posts);

  if (isError) return <p>Error loading posts.</p>;

  return (
    <>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-0 md:px-4">
        <div className="w-site flex flex-col gap-10">
          {/* Tag Header */}
          <div className='w-full flex flex-col bg-white rounded-md overflow-hidden'>
            <div className="w-full h-4 bg-green-700" />
            <div className='p-6'>
              <div className='text-3xl font-bold pb-4 flex justify-between items-center'>
                <h1>{tagName}</h1>
                <div className='text-lg flex justify-end gap-2'>
                  <button className='text-white font-normal w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md'>
                    Follow
                  </button>
                  <button className="text-gray-700 font-normal w-20 h-10 hover:bg-blue-800/10 rounded-md">
                    Hide
                  </button>
                </div>
              </div>
              A tag that has the most generic description - Chinese Proverb
            </div>
          </div>
          <div className='flex justify-between gap-4'>
            <TagLeftBar />
            <div className='grow flex flex-col gap-2'>
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
              {!isLoading && posts && posts.length > 0 ?
                posts.map((post, index) => <SearchPostCard {...post} key={index} />)
              :
                <>
                  <LoadingPostCard />
                  <LoadingPostCard />
                </>
              }
            </div>
            <TagRightBar />
          </div>
        </div>  
      </main>
    </>
  );
};

export default TagPage;