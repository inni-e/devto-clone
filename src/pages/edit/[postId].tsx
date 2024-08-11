import { type GetServerSideProps } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import superjson from 'superjson';
import { type RouterOutputs } from '~/utils/api';
import { useSession } from 'next-auth/react';

import Head from "next/head";
import Link from "next/link";
import EditPostView from '~/components/post_creation/EditPostView';

type PostProps = {
  post: Omit<RouterOutputs["post"]["getPostById"], "createdAt" | "updatedAt"> & {
    createdAt: string, updatedAt: string
  };
};

const PostPage = ({ post }: PostProps) => {
  const { data: sessionData } = useSession();

  if (!post) {
    return <div>No post found with this id.</div>
  }

  const { id, name, imageKey, content, createdBy, tags } = post;

  console.log("createdBy: ", createdBy.id);
  console.log("logged in with id: ", sessionData?.user?.id);

  return (
    <>
      <Head>
        <title>Create new post</title>
        <meta name="description" content="Dev.to clone by Eoin" />
        <link rel="icon" href="/dev.png" />
      </Head>
      <nav className="fixed w-full text-gray-900 px-4 py-2 flex justify-center">
        <div className="flex justify-between w-full lg:w-site items-center">
          <div className="flex justify-start items-center gap-4">
            <div className="flex flex-none justify-center w-12 bg-black rounded">
              <Link href={"/"}>
                <img src="/dev.png" className="w-10 h-10" />
              </Link>
            </div>
            Edit post
          </div>
          <Link href="/">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z"></path>
            </svg>
          </Link>
        </div>
      </nav>
      <main className="pt-14 flex justify-center h-screen bg-gray-100 px-4">
        {createdBy.id === sessionData?.user?.id ?
          <EditPostView
            post={{
              id: id,
              name: name,
              content: content,
              imageKey: imageKey,
              createdById: createdBy.id,
              tags: tags,
            }}
          />
          :
          "You don't have permission to edit this post"
        }
      </main>
    </>
  );
};

// TODO: Implement loading state
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  const postId = parseInt(params?.postId as string, 10);

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