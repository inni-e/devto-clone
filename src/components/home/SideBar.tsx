import SideBarItems from "~/components/ui/SideBarItems"

/**
 * Idk if this is illegal but the SVGs are from the dev.to website itself
 * Aplogies if it is, was just lazy to import icons
 */

export default function SideBar() {
  return (
    <aside className="hidden w-60 flex-none md:flex flex-col text-gray-700">
      <SideBarItems />
    </aside>
  );
}