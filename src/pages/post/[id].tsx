import { GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import superjson from 'superjson';
import { api, RouterOutputs } from '~/utils/api';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";

import NavBar from "~/components/NavBar";
import RightBar from '~/components/home/RightBar';
import ProfileImage from "~/components/ProfileImage";
import { PostViewSideBar } from '../../components/post/PostViewSideBar';


type PostProps = {
  post: Omit<RouterOutputs["post"]["getPostById"], "createdAt" | "updatedAt"> & {
    createdAt: string, updatedAt: string
  };
};

const PostPage = ({ post }: PostProps) => {
  if (!post) {
    return <div>Post not found</div>;
  }
  const { name, content, createdAt: serializedCreatedAt, createdBy } = post;
  const createdAt = new Date(serializedCreatedAt);

  const { data: sessionData } = useSession();

  // Delete functionality
  const deletePost = api.post.deletePost.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost.mutateAsync({ id: post.id });
      window.location.href = '/';
      alert('Post deleted successfully!');
    } catch (error) {
      alert('Failed to delete post: ' + error);
    } finally {
      setIsDeleting(false);
    }
  };

  // FIXME: fix image src path

  return (
    <>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-site flex gap-4">
          <PostViewSideBar />
          <div className="w-1/2 flex-auto">
            <div className="rounded-md bg-white overflow-x-hidden flex flex-col border border-gray-200">
              <img src="../canyon.jpg" alt="blog image" className="w-full h-72 object-cover" />

              <div className="w-full p-6 flex justify-between items-center">
                <div className="flex justify-start gap-2">
                  <ProfileImage image={createdBy.image ? createdBy.image : "beach.jpg"} />
                  <div className="text-gray-700">
                    <h1 className="font-bold text-sm">{createdBy.name}</h1>
                    <p className="text-xs">{createdAt.toDateString()}</p>
                  </div>
                </div>
                {isDeleting &&
                  <div className="text-white font-bold w-24 h-10 bg-red-700 hover:bg-red-800 rounded-md flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                }
                {!isDeleting && sessionData && sessionData.user.id === createdBy.id &&
                  <button
                    className="text-red-700 hover:text-white w-24 h-10 hover:bg-red-700 rounded border-2 border-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                }

              </div>
              <div className="pl-6 sm:pl-16 pr-6 pb-6 font-bold text-xl sm:text-3xl hover:text-purple-900">
                {name}
              </div>
              <div className="pl-6 sm:pl-16 pr-6 pb-6">
                {content}
              </div>
            </div>
          </div>
          <RightBar />
        </div>
      </main>
    </>
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">{post.name}</h1>
    //   <p>{post.content}</p>
    //   <p>{new Date(post.createdAt).toDateString()}</p>
    // </div>
  );
};

// TODO: Implement loading state
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (!params || !params.id) {
    return {
      notFound: true,
    };
  }

  const postId = parseInt(params.id as string, 10);

  if (isNaN(postId)) {
    return {
      notFound: true,
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: null },
    transformer: superjson,
  });

  const post = await helpers.post.getPostById.fetch({ id: postId });

  if (!post) {
    return {
      notFound: true,
    };
  }

  // Convert Date objects to strings
  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return {
    props: {
      post: serializedPost,
    },
  };
};

export default PostPage;