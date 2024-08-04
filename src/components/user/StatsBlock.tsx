export default function StatsBlock() {
  return (
    <>
      <div className='w-full py-2 flex justify-start items-center gap-4'>
        <svg
          width="24"
          height="24">
          <title id="ais9b6f3um5dh6bl0ibczq7766mhz6yb">Post</title>
          <path d="M19 22H5a3 3 0 01-3-3V3a1 1 0 011-1h14a1 1 0 011 1v12h4v4a3 3 0 01-3 3zm-1-5v2a1 1 0 002 0v-2h-2zm-2 3V4H4v15a1 1 0 001 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z"></path>
        </svg>
        # posts published
      </div>
      <div className='w-full py-2 flex justify-start items-center gap-4'>
        <svg
          width="24"
          height="24" >
          <title id="anl097zysccjkvqfbovwhyb9l4j81hcg">Comment</title>
          <path d="M10 3h4a8 8 0 010 16v3.5c-5-2-12-5-12-11.5a8 8 0 018-8zm2 14h2a6 6 0 000-12h-4a6 6 0 00-6 6c0 3.61 2.462 5.966 8 8.48V17z"></path>
        </svg>
        # comments written
      </div>
      <div className='w-full py-2 flex justify-start items-center gap-4'>
        <svg
          width="24"
          height="24">
          <title id="a5omr630jcnoigahzijjk78purxg5vcs">Tag</title>
          <path d="M7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2h3.784zm2.011 0h3.99l.42-4h-3.99l-.42 4z"></path>
        </svg>
        # tags followed
      </div>
    </>
  );
}