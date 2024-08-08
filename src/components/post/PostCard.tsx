import Link from "next/link";
import ProfileImage from "../ProfileImage";
import { type RouterOutputs } from "~/utils/api";
import { RecentCommentsSection } from "~/components/comment/Comment";

type Post = RouterOutputs["post"]["getAll"][number];

const PostCard = (props: Post) => {
  if (!props) return null;

  const { id, name, imageUrl, createdAt, createdBy } = props;

  return (
    <div className="rounded-none sm:rounded-md bg-white overflow-x-hidden flex flex-col border border-gray-200">
      {imageUrl &&
        <img src={imageUrl ? imageUrl : "canyon.jpg"} alt="blog image" className="w-full h-72 object-cover" />
      }

      <div className="w-full p-6 flex justify-start items-center gap-2">
        <Link href={"/user/" + createdBy.id}>
          <ProfileImage
            className="w-8 h-8"
            user={{
              ...createdBy,
              name: createdBy.name ?? null,
              image: createdBy.image ?? null,
              email: createdBy.email ?? null,
            }}
          />
        </Link>
        <div className="text-gray-700">
          <h1 className="font-bold text-sm">{createdBy.name}</h1>
          <p className="text-xs">{createdAt.toDateString()}</p>
        </div>
      </div>
      <Link href={"post/" + id}>
        <div className="px-6 sm:pl-16 mb-2 font-bold text-xl sm:text-3xl hover:text-purple-900 text-pretty whitespace-pre">
          {name}
        </div>
      </Link>
      {/* Placeholder items */}
      <div className="flex flex-row pl-6 sm:pl-16 mb-4 pr-6 gap-1">
        <button className="rounded-md p-1 hover:bg-gray-100 hover:outline hover:outline-1 hover:outline-gray-300">
          #cringe
        </button>
        <button className="rounded-md p-1 hover:bg-gray-100 hover:outline hover:outline-1 hover:outline-gray-300">
          #thispostlame
        </button>
      </div>
      <div className="flex justify-between pl-4 sm:pl-14 pr-6">
        <div className="flex justify-start">
          <button className="flex justify-start items-center rounded-md px-3 py-1 hover:bg-gray-100">
            <svg width="24" height="24"><title id="a5t94onskymmyvtvo92b9mlqetvdk61p">Like comment: </title><path d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z"></path></svg>
            296 <span className="hidden pl-1 sm:inline">Likes</span>
          </button>
          <button className="flex justify-start items-center rounded-md px-3 py-1 hover:bg-gray-100">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z"></path></svg>
            25 <span className="hidden pl-1 sm:inline">Comments</span>
          </button>
        </div>
        <div className="flex justify-end items-center gap-2">
          21 min read
          <button className="p-2 rounded-md hover:bg-blue-50">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M6.75 4.5h10.5a.75.75 0 01.75.75v14.357a.375.375 0 01-.575.318L12 16.523l-5.426 3.401A.375.375 0 016 19.607V5.25a.75.75 0 01.75-.75zM16.5 6h-9v11.574l4.5-2.82 4.5 2.82V6z"></path></svg>
          </button>
        </div>
      </div>
      {/* End placeholder items */}
      <RecentCommentsSection postId={id} />
    </div>
  );
}

export default PostCard;