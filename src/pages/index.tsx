import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import NavBar from "~/components/NavBar";
import SideBar from "~/components/home/SideBar";
import PostView from "~/components/home/PostView"

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Dev Community</title>
        <meta name="description" content="Dev.to clone by Eoin" />
        <link rel="icon" href="/dev.png" />
      </Head>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-site flex gap-4">
          <SideBar />
          <PostView />
          <div className="w-1/5 flex-auto bg-blue-500">

          </div>
        </div>
      </main>
    </>
  );
}