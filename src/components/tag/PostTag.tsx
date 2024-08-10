import Link from "next/link";

type PostTagProps = {
  tagName: string;
}

export default function PostTag(props: PostTagProps) {
  return (
    <Link href={"/tag/" + props.tagName}>
    <button className="text-sm rounded-md p-1 hover:bg-pink-100 hover:outline hover:outline-1 hover:outline-pink-300">
      # 
      <span>{props.tagName}</span>
    </button>
    </Link>
  );
} 