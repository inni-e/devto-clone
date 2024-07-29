import PostCard from "../post/PostCard";

export default function PostView() {
  return (
    <div className="w-1/2 flex-auto flex flex-col gap-4">
      <div className="flex justify-start">
        <button className="h-10 px-4 py-2 font-bold text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
          Relevant
        </button>
        <button className="h-10 px-4 py-2 text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
          Latest
        </button>
        <button className="h-10 px-4 py-2 text-gray-700 rounded-md hover:bg-white hover:text-blue-800">
          Top
        </button>
      </div>
      <PostCard
        image="canyon.jpg"
        author="Brad Cooper"
        profileImage="beach.jpg"
        title="Wow check out this canyon it looks super cool wow yay awesome i need to implement posts"
      />
      <PostCard
        image="ruins.jpg"
        author="Shane Sterney"
        profileImage="sunset.jpg"
        title="Archaeological diggin..."
      />

    </div>
  );
}