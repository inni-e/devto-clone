export function PostViewSideBar() {
  return (
    // FIXME: Case for bugs, ghost sidebar takes up space for regular sidebar to be fixed
    <div className="hidden sm:block flex-none w-16" >
      <aside className="bg-gray-100 w-16 fixed text-white p-4 flex flex-col justify-center gap-10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
          <g clip-path="url(#clip0_988_3276)">
            <path d="M19 14V17H22V19H18.999L19 22H17L16.999 19H14V17H17V14H19ZM20.243 4.75698C22.505 7.02498 22.583 10.637 20.479 12.992L19.059 11.574C20.39 10.05 20.32 7.65998 18.827 6.16998C17.324 4.67098 14.907 4.60698 13.337 6.01698L12.002 7.21498L10.666 6.01798C9.09103 4.60598 6.67503 4.66798 5.17203 6.17198C3.68203 7.66198 3.60703 10.047 4.98003 11.623L13.412 20.069L12 21.485L3.52003 12.993C1.41603 10.637 1.49503 7.01898 3.75603 4.75698C6.02103 2.49298 9.64403 2.41698 12 4.52898C14.349 2.41998 17.979 2.48998 20.242 4.75698H20.243Z" fill="#525252"></path>
          </g>
          <defs>
            <clipPath id="clip0_988_3276">
              <rect width="24" height="24" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M10 3h4a8 8 0 010 16v3.5c-5-2-12-5-12-11.5a8 8 0 018-8zm2 14h2a6 6 0 000-12h-4a6 6 0 00-6 6c0 3.61 2.462 5.966 8 8.48V17z"></path>
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1zm13 2H6v15.432l6-3.761 6 3.761V4z"></path>
        </svg>
      </aside>
    </div >
    // End FIXME 
  );
}