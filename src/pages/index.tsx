import Head from "next/head";

import NavBar from "~/components/NavBar";
import SideBar from "~/components/home/SideBar";
import PostView from "~/components/home/PostView"

import { api } from "~/utils/api";
import RightBar from "../components/home/RightBar";

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
          <RightBar />
        </div>
      </main>
    </>
  );
}