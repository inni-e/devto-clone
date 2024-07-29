import React from "react";
import ProfileImage from "../ProfileImage";

interface PostCardProps {
  image: string;
  author: string;
  profileImage: string;
  title: string;
}

// TODO: implement dating posts

const PostCard: React.FC<PostCardProps> = ({ image, author, profileImage, title }) => {
  return (
    <div className="rounded-md bg-white overflow-x-hidden flex flex-col border border-gray-200">
      <img src={image} alt="blog image" className="w-full h-72 object-cover" />
      <div className="w-full p-6 flex justify-start items-center gap-2">
        <ProfileImage image={profileImage} />
        <div className="text-gray-700">
          <h1 className="font-bold text-sm">{author}</h1>
          <p className="text-xs">Not long ago...</p>
        </div>
      </div>
      <div className="pl-16 pr-6 pb-6 font-bold text-3xl">
        {title}
      </div>
      <div className="pl-16 pr-6 pb-6">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Leo auctor orci primis, sollicitudin quisque consectetur. Nec facilisi dolor netus tempus sodales aliquam sodales? Ante tristique et integer suspendisse aliquet interdum lobortis. Aenean primis per lobortis cursus at hendrerit sed fermentum pretium.
      </div>
    </div>
  );
}

export default PostCard;