import Link from "next/link";
import SearchBar from "./ui/SearchBar";
import SignInButton from "./ui/SignInButton";

export default function NavBar() {
  return (
    <nav className="fixed w-full bg-white text-gray-900 px-4 py-2 flex justify-center border border-gray-300">
      <div className="flex justify-between w-site">
        <div className="flex shrink gap-4 w-halfsite">
          <div className="flex flex-none justify-center w-12 bg-black rounded">
            <Link href={"/"} passHref>
              {/* <div className="flex items-center gap-2"> */}
              {/* <DiscIcon className="w-8 h-8" /> */}
              <img src="/dev.png" className="w-10 h-10" />
              {/* </div> */}
            </Link>
          </div>
          <SearchBar />
        </div>
        <SignInButton />
      </div>
    </nav>
  );
}