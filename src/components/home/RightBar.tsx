export default function RightBar() {
  return (
    <div className="hidden w-1/7 flex-auto lg:flex flex-col">
      <div className="flex flex-col overflow-hidden border-x border-t border-gray-200 rounded-md">
        <div className="font-bold text-lg p-4 bg-white border-b border-gray-200">
          Active discussions
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">Meme Monday</p>
          <p className="text-sm">22 comments</p>
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">Taco Tuesday</p>
          <p className="text-sm">22 comments</p>
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">Waddle Wednesday</p>
          <p className="text-sm">22 comments</p>
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">Thocky Thursday</p>
          <p className="text-sm">22 comments</p>
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">Fried Friday</p>
          <p className="text-sm">22 comments</p>
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">I do not like Saturday</p>
          <p className="text-sm">22 comments</p>
        </div>
        <div className="flex flex-col p-4 bg-white border-b border-gray-200">
          <p className="text-md">Sunny Sunday</p>
          <p className="text-sm">22 comments</p>
        </div>
      </div>
    </div>
  );
}