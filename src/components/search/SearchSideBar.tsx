import SideBarButton from "../home/SideBarButton";

export default function SideBar() {
  return (
    <aside className="px-2 sm:px-0 w-screen sm:w-60 flex flex-row sm:flex-col text-gray-700 overflow-x-auto overflow-y-hidden">
      <SideBarButton icon={null} label="Posts" />
      <SideBarButton icon={null} label="People" />
      <SideBarButton icon={null} label="Organisations" />
      <SideBarButton icon={null} label="Tags" />
      <SideBarButton icon={null} label="Comments" />
      <SideBarButton icon={null} label="My posts only" />
    </aside>
  );
}