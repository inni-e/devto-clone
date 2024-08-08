import Link from "next/link";
import Image from "next/image";
import SearchBar from "./ui/SearchBar";
import SignInButton from "./ui/SignInButton";
import ProfileImage from "./ProfileImage";
import ProfileDropdown from "~/components/ui/ProfileDropdown"
import SidebarDropdown from "~/components/ui/SidebarDropdown";

import { useSession } from "next-auth/react";
import { useState } from "react";


export default function NavBar() {
  const { data: sessionData } = useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSidedownOpen, setIsSidedownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidedown = () => {
    setIsSidedownOpen(!isSidedownOpen);
  };


  return (
    <>
      {isSidedownOpen &&
        <div className="fixed w-screen h-screen bg-black/30 z-50">
          <SidebarDropdown onClick={toggleSidedown} />
        </div>
      }
      <nav className="fixed w-full bg-white text-gray-900 px-2 sm:px-4 py-2 flex justify-center border border-gray-200 z-40">
        <div className="flex justify-between gap-4 w-full lg:w-site">
          <div className="flex shrink gap-3 w-halfsite">
            <button
              className="flex justify-center items-center sm:hidden h-10 w-10 hover:bg-blue-100 rounded-md"
              onClick={toggleSidedown}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="img"><title id="acd3fo8x56kibnemhkj121bwo5c0ltil">Navigation menu</title>
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"></path>
              </svg>
            </button>
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
                <Link className="hidden sm:block" href="/new">
                  <button
                    className="text-purple-700 hover:text-white w-36 h-10 hover:bg-blue-700 rounded border-2 border-blue-700"
                  >
                    Create post
                  </button>
                </Link>
                <button className="flex justify-center items-center sm:hidden w-10 h-10 hover:bg-blue-100 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title id="a9971hmemyuyu6eh9vtnuyzttyi1f2b6">Search</title>
                    <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0111 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 01-1.969 5.617zm-2.006-.742A6.977 6.977 0 0018 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 004.875-1.975l.15-.15z"></path>
                  </svg>
                </button>
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
    </>
  );
}