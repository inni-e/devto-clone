import { type GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import superjson from 'superjson';
import { api, type RouterOutputs } from '~/utils/api';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from "react";

import Link from "next/link";
import NavBar from "~/components/NavBar";
import RightBar from '~/components/home/RightBar';
import ProfileImage from "~/components/ProfileImage";
import { PostViewSideBar } from '../../components/post/PostViewSideBar';
import { CommentsSection } from "~/components/comment/Comment";
import LoadingSpinner from '~/components/LoadingSpinner';
import PostTag from "~/components/tag/PostTag";

type PostProps = {
  post: Omit<RouterOutputs["post"]["getPostById"], "createdAt" | "updatedAt"> & {
    createdAt: string, updatedAt: string
  };
};

const PostPage = ({ post }: PostProps) => {
  const { data: sessionData } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = api.post.deletePost.useMutation();

  const { id: postId, name, imageKey, imageUrl, content, tags, createdAt: serializedCreatedAt, hidden, createdBy } = post;
  const createdAt = new Date(serializedCreatedAt);

  const [isHidden, setHidden] = useState(hidden);
  const { mutate: togglePostHidden, isPending: isHiding } = api.post.togglePostHidden.useMutation();


  // Delete functionality
  const { mutateAsync: getPresignedURLDelete } = api.aws.getPresignedURLDelete.useMutation({
    onSuccess: async ({ url }) => {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('File deleted successfully!');
        } else {
          console.log('Deletion failed');
        }
      } catch (error) {
        console.error('Deletion failed:', error);
        console.log('Deletion failed');
      }
    },
    onError: (error) => {
      console.error('Error fetching presigned URL:', error);
      console.log('Error fetching presigned URL');
    },
  });
  // TODO: Clean up this code bro
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (imageKey) {
        await getPresignedURLDelete({
          fileKey: imageKey
        });
      }
      await deletePost.mutateAsync({ id: post.id });
      window.location.href = '/';
      alert('Post deleted successfully!');
    } catch (error) {
      alert('Failed to delete post: ');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleHiding = async () => {
    console.log("1:", isHidden);
    togglePostHidden({
      id: postId,
      hiddenState: !isHidden,
      createdById: createdBy.id
    });
    setHidden(!isHidden);
    console.log("2:", isHidden);
  }



  return (
    <>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-0 md:px-4">
        <div className="w-site flex gap-4">
          <PostViewSideBar />
          <div className="w-1/2 flex-auto">
            <div className="rounded-md bg-white overflow-x-hidden flex flex-col border border-gray-200">
              {imageUrl &&
                <img src={imageUrl} alt="blog image" className="w-full h-72 object-cover" />
              }

              <div className="w-full p-6 flex justify-between items-center">
                <div className="flex justify-start gap-2">
                  <Link href={"/user/" + createdBy.id}>
                    <ProfileImage
                      className="w-8 h-8"
                      user={{
                        ...createdBy,
                        name: createdBy.name ?? null,
                        image: createdBy.image ?? null,
                        email: createdBy.email ?? null,
                      }}
                    />
                  </Link>
                  <div className="text-gray-700">
                    <h1 className="font-bold text-sm">{createdBy.name}</h1>
                    <p className="text-xs">{createdAt.toDateString()}</p>
                  </div>
                </div>
                {sessionData?.user.id === createdBy.id &&
                  // TODO: Turn this into a component
                  <>
                    {(!isDeleting && !isHiding) ?
                      <div className='flex justify-between p-1 items-center rounded bg-orange-50 border border-orange-100'>
                        <Link href={"/edit/" + postId}>
                          <button
                            className='text-sm px-2 py-1 bg-orange-50 hover:bg-orange-100 rounded-md'
                          >
                            Edit
                          </button>
                        </Link>
                        <button
                          className='text-sm px-2 py-1 bg-orange-50 hover:bg-orange-100 rounded-md'
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                        <button
                          className='text-sm px-2 py-1 bg-orange-50 hover:bg-orange-100 rounded-md'
                          onClick={handleHiding}
                          disabled={isHiding}
                        >
                          {isHidden ? "Unhide" : "Hide"}
                        </button>
                      </div>
                      :
                      <div className='flex justify-between p-1 items-center rounded bg-orange-50 border border-orange-100'>
                        <LoadingSpinner />
                      </div>
                    }
                  </>
                }
              </div>
              <div className="pl-6 sm:pl-16 pr-6 pb-2 font-bold text-xl sm:text-3xl hover:text-purple-900">
                {name}
              </div>
              <div className="flex flex-wrap pl-6 sm:pl-16 mb-8 pr-6 gap-2">
                {tags?.map((tag, index) => <PostTag key={index} tagName={tag.name} />)}
              </div>
              <div className="pl-6 sm:pl-16 pr-6 pb-6 whitespace-pre text-pretty">
                {content}
              </div>
              {/* // Chuck comments here */}
              <CommentsSection postId={post.id} />
            </div>
          </div>
          <RightBar />
        </div>
      </main>
    </>
  );
};

// TODO: Implement loading state
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  const postId = parseInt(params?.id as string, 10);

  if (!postId || isNaN(postId)) {
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