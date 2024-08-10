export default function TagLeftBar() {
  return (
    <div className='hidden sm:block w-60'>
      <button className='mt-0.5 text-md text-white font-normal px-3 py-1 flex items-center bg-blue-700 hover:bg-blue-800 rounded-md'>
        Create Post
      </button>
      <div className="my-4 h-0.5 bg-gray-300 w-full"></div>
      This is the description of this tag. There will be filler information in here:
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore fuga modi, sapiente eum facere cupiditate? Ad eius ducimus libero, praesentium, accusantium ullam commodi maiores culpa, voluptatem excepturi suscipit vero at.
    </div>
  );
}