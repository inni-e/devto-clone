import React from "react";
import ProfileImage from "../ProfileImage";
import { RouterOutputs } from "~/utils/api";

type Post = RouterOutputs["post"]["getAll"][number];

const PostCard = (props: Post) => {
  if (!props) return null;
  const { name, content, createdAt, createdBy } = props;
  return (
    <div className="rounded-md bg-white overflow-x-hidden flex flex-col border border-gray-200">
      <img src="canyon.jpg" alt="blog image" className="w-full h-72 object-cover" />
      <div className="w-full p-6 flex justify-start items-center gap-2">
        <ProfileImage image={createdBy.image ? createdBy.image : "beach.jpg"} />
        <div className="text-gray-700">
          <h1 className="font-bold text-sm">{createdBy.name}</h1>
          <p className="text-xs">{createdAt.toDateString()}</p>
        </div>
      </div>
      <div className="pl-6 sm:pl-16 pr-6 pb-6 font-bold text-xl sm:text-3xl">
        {name}
      </div>
      <div className="pl-6 sm:pl-16 pr-6 pb-6">
        {content}
      </div>
    </div>
  );
}

export default PostCard;