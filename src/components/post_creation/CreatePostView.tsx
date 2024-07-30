export default function CreatePostView() {
  return (
    <div className="w-site h-full flex gap-4 bg-gray-100">
      <div className="w-full h-full flex flex-col">
        {/* Editor Area */}
        <div className="flex-none h-[90%] bg-white rounded-lg border border-gray-200">

        </div>
        <div className="flex items-center justify-start gap-4 py-6">
          <button className="text-white font-bold w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md">
            Publish
          </button>
          <button className="text-gray-700 w-24 h-10 hover:bg-blue-800/10 rounded-md">
            Save draft
          </button>
        </div>
      </div>

      {/* Instructions Area */}
      <div className="hidden sm:flex w-96">
        Write a post!
      </div>
    </div>
  );
}