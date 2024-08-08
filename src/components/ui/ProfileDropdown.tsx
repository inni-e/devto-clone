import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfileDropDown() {
  const { data: sessionData } = useSession();

  return (
    <div className="absolute right-0 bg-white text-gray-800 mt-2 p-2 rounded shadow-lg">
      <Link href={"/user/" + sessionData?.user.id}>
        <div className="flex flex-col px-4 py-2 hover:text-blue-900 hover:bg-blue-100 cursor-pointer rounded-md">
          <h1 className="font-bold">{sessionData?.user.name}</h1>
          <p className="text-sm">{"@" + sessionData?.user.id}</p>
        </div>
      </Link>
      <div className="h-0.5 my-2 bg-gray-300" />
      <Link href="/new">
        <div className="px-4 py-2 hover:text-blue-900 hover:bg-blue-100 cursor-pointer rounded-md">Create Post</div>
      </Link>
      <Link href="/settings">
        <div className="px-4 py-2 hover:text-blue-900 hover:bg-blue-100 cursor-pointer rounded-md">Settings</div>
      </Link>
      <div className="h-0.5 my-2 bg-gray-300" />
      <button
        className="flex justify-start w-full px-4 py-2 hover:text-blue-900 hover:bg-blue-100 cursor-pointer rounded-md"
        onClick={() => void signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}