import Link from "next/link";
import React from "react";

interface SideBarButtonProps {
  icon: React.ReactNode;
  label: string;
}

const SideBarButton: React.FC<SideBarButtonProps> = ({ icon, label }) => {
  return (
    <>
      <Link href="#" >
        <button className="w-full h-10 px-2 flex items-center gap-2 hover:bg-blue-700/5 hover:underline rounded-md">
          {icon}
          {label}
        </button>
      </Link>
    </>
  );
}

export default SideBarButton;