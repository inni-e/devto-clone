import Head from "next/head";

import NavBar from "~/components/NavBar";
import SideBar from "~/components/home/SideBar";
import PostsView from "~/components/home/PostsView"

import RightBar from "../components/home/RightBar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dev Community</title>
        <meta name="description" content="Dev.to clone by Eoin" />
        <link rel="icon" href="/dev.png" />
      </Head>
      <NavBar />
      <main className="pt-20 flex justify-center min-h-screen bg-gray-100 px-0 sm:px-4">
        <div className="w-site flex gap-4">
          <SideBar />
          <div className="w-1/2 flex-auto flex flex-col gap-4">
            <PostsView />
          </div>
          <RightBar />
        </div>
      </main>
    </>
  );
}