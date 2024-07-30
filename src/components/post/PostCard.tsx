import React from "react";
import ProfileImage from "../ProfileImage";
import { RouterOutputs } from "~/utils/api";

// TODO: implement dating posts

type Post = RouterOutputs["post"]["getAll"][number];

const PostCard = (props: Post) => {
  if (!props) return null;
  const { name, createdAt, createdBy } = props;
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
        Lorem ipsum odor amet, consectetuer adipiscing elit. Leo auctor orci primis, sollicitudin quisque consectetur. Nec facilisi dolor netus tempus sodales aliquam sodales? Ante tristique et integer suspendisse aliquet interdum lobortis. Aenean primis per lobortis cursus at hendrerit sed fermentum pretium.
      </div>
    </div>
  );
}

export default PostCard;