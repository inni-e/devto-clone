import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  // TODO: check if you can pass sessionData through components so you're not fetching it all the time
  const { data: sessionData } = useSession();

  return (
    <button
      className="flex-none text-gray-700 hover:text-white w-24 h-10 hover:bg-black rounded border-2 border-black"
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </button>
  );
}