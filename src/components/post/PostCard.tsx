import Link from "next/link";
import ProfileImage from "../ProfileImage";
import { type RouterOutputs } from "~/utils/api";

type Post = RouterOutputs["post"]["getAll"][number];

const PostCard = (props: Post) => {
  if (!props) return null;

  const { id, name, imageUrl, content, createdAt, createdBy } = props;

  return (
    <div className="rounded-md bg-white overflow-x-hidden flex flex-col border border-gray-200">
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
        <div className="pl-6 sm:pl-16 pr-6 pb-6 font-bold text-xl sm:text-3xl hover:text-purple-900 whitespace-pre">
          {name}
        </div>
      </Link>
      <div className="pl-6 sm:pl-16 pr-6 pb-6 whitespace-pre">
        {content}
      </div>
    </div>
  );
}

export default PostCard;