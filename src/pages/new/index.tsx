import Head from "next/head";
import Link from "next/link";

import CreatePostView from "~/components/post_creation/CreatePostView";

import { useSession } from "next-auth/react";


export default function NewPost() {
  const { data: sessionData } = useSession();

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
            Create post
          </div>
          <Link href="/">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z"></path>
            </svg>
          </Link>
        </div>
      </nav>
      <main className="pt-14 flex justify-center h-screen bg-gray-100 px-4">
        {sessionData ?
          <CreatePostView />
          :
          "You must be logged in to post"
        }
      </main>
    </>
  );
}