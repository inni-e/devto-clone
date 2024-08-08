import SideBarItems from "~/components/ui/SideBarItems"

/**
 * Idk if this is illegal but the SVGs are from the dev.to website itself
 * Aplogies if it is, was just lazy to import icons
 */

type SideBarDropdownProps = {
  onClick: () => void;
}

export default function SideBarDropdown({ onClick: toggleSidedown }: SideBarDropdownProps) {
  return (
    <aside className="flex p-2 h-screen w-2/3 flex-none md:hidden flex-col bg-white text-gray-700">
      <div className="w-full flex justify-between mb-4">
        <h1 className="font-bold text-md p-2">DEV Community</h1>
        <button
          className="flex w-10 justify-center items-center hover:bg-blue-700/10 rounded-md"
          onClick={toggleSidedown}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="img" aria-labelledby="adfhhml3etntdq4o6hl7fz2oweclruwz" aria-hidden="true"><title id="adfhhml3etntdq4o6hl7fz2oweclruwz">Close</title><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z"></path></svg>
        </button>
      </div>
      <SideBarItems />
    </aside>
  );
}