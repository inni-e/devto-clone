import Link from "next/link";
import Image from "next/image";
import SearchBar from "./ui/SearchBar";
import SignInButton from "./ui/SignInButton";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ProfileImage from "./ProfileImage";
import ProfileDropdown from "~/components/ui/ProfileDropdown"

export default function NavBar() {
  const { data: sessionData } = useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <nav className="fixed w-full bg-white text-gray-900 px-4 py-2 flex justify-center border border-gray-200 z-40">
      <div className="flex justify-between gap-4 w-full lg:w-site">
        <div className="flex shrink gap-4 w-halfsite">
          <div className="flex flex-none justify-center w-12 bg-black rounded">
            <Link href={"/"} passHref>
              <Image alt="dev logo" src="/dev.png" width={40} height={40} />
            </Link>
          </div>
          <div className="hidden grow sm:flex">
            <SearchBar />
          </div>
        </div>
        <div className="flex-none flex gap-4 items-center">
          {sessionData?.user.image ?
            <>
              <Link href="/new">
                <button
                  className="text-purple-700 hover:text-white w-36 h-10 hover:bg-blue-700 rounded border-2 border-blue-700"
                >
                  Create post
                </button>
              </Link>
              <div className="relative h-10">
                <button
                  onClick={toggleDropdown}
                  className="text-white"
                >
                  <ProfileImage
                    className="w-10 h-10"
                    user={{
                      ...sessionData.user,
                      name: sessionData.user.name ?? null,
                      image: sessionData.user.image ?? null,
                      imageKey: sessionData.user.imageKey ?? null,
                      email: sessionData.user.email ?? null,
                    }}
                  />
                </button>
                {isDropdownOpen &&
                  <ProfileDropdown />
                }
              </div>
            </>
            :
            <SignInButton />
          }
        </div>

      </div>
    </nav>
  );
}