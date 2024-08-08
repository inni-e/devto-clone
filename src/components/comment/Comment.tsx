import { useState } from 'react';
import { api } from '~/utils/api';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

import Link from "next/link";
import ProfileImage from "~/components/ProfileImage";
import LoadingSpinner from '../LoadingSpinner';
import LoadingComment from "~/components/comment/LoadingComment";

interface CommentType {
  id: number;
  content: string;
  postId: number | null;
  parentId?: number | null;
  user: User;
  replies: CommentTypeWithoutReplies[];
}

interface CommentTypeWithoutReplies {
  id: number;
  content: string;
  postId: number | null;
  parentId?: number | null;
  user: User;
}

interface CommentProps {
  comment: CommentType;
}

export const Comment = ({ comment }: CommentProps) => {
  const [reply, setReply] = useState('');
  const [isReplying, setisReplying] = useState(false);
  const { mutate: replyToComment, isPending: isReplyingToComment } = api.comment.replyToComment.useMutation();
  const handleReply = () => {
    replyToComment({ commentId: comment.id, content: reply });
    setReply('');
  };

  // We must also fetch this comments replies here
  const { data: replies, isLoading } = api.comment.getRepliesByComment.useQuery({ commentId: comment.id });

  return (
    <div className="flex flex-col p-2 mt-2">
      <div className='flex flex-row justify-start gap-2'>
        <Link href={"/user/" + comment.user.id}>
          <ProfileImage
            className="w-8 h-8"
            user={{
              ...comment.user,
              name: comment.user.name ?? null,
              image: comment.user.image ?? null,
              email: comment.user.email ?? null,
            }}
          />
        </Link>
        <div className='grow flex flex-col gap-2'>
          <div className='p-4 grow border border-gray-200 rounded-md'>
            <span className='text-md font-bold'>{comment.user.name}</span>
            <span className='ml-2 text-sm text-gray-400'>Yesterday</span>
            <p className='mt-4'>
              {comment.content}
            </p>
          </div>
          <div className='flex justify-start gap-2'>
            <button className='flex justify-between items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-gray-100'>
              <svg width="24" height="24"><title id="a5t94onskymmyvtvo92b9mlqetvdk61p">Like comment: </title><path d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z"></path></svg>
              6 likes
            </button>
            <button
              className='flex justify-between items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-gray-100'
              onClick={() => setisReplying(!isReplying)}
            >
              Reply
            </button>
          </div>
          {isReplying &&
            <>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Reply to this comment"
                style={{
                  resize: 'none', // Prevent resizing
                }}
                className="border p-2 h-16 grow rounded-md focus:outline-blue-700 focus:h-[9rem]"
              />
              <button
                onClick={handleReply}
                className="bg-blue-700 flex justify-center items-center font-bold text-white p-1 w-16 h-9 rounded-md hover:bg-blue-800"
                disabled={isReplyingToComment}
              >
                {isReplyingToComment ?
                  <LoadingSpinner />
                  :
                  "Reply"
                }

              </button>
            </>
          }
        </div>
      </div>
      <div className="ml-4">

        {replies?.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}

      </div>
    </div>
  );
};

type PostIdProps = {
  postId: number;
}

export const CommentsSection = ({ postId }: PostIdProps) => {
  const { data: comments, isLoading } = api.comment.getCommentsByPost.useQuery({ postId });
  const [newComment, setNewComment] = useState('');
  const { mutate: createComment, isPending: isCommenting } = api.comment.createComment.useMutation();
  const { data: sessionData } = useSession();

  const handleComment = () => {
    createComment({ postId, content: newComment });
    setNewComment('');
  };

  return (
    <div className='border-t border-gray-200 w-full py-8 px-4 md:px-16'>
      <h1 className='font-bold text-3xl mb-8'>Comments</h1>
      {sessionData &&
        <div className='flex justify-start gap-2 mb-8'>
          <Link href={"/user/" + sessionData.user.id}>
            <ProfileImage
              className="w-8 h-8"
              user={{
                ...sessionData.user,
                name: sessionData.user.name ?? null,
                image: sessionData.user.image ?? null,
                email: sessionData.user.email ?? null,
              }}
            />
          </Link>
          <div className='flex flex-col grow gap-4'>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add to the discussion"
              style={{
                resize: 'none', // Prevent resizing
              }}
              className="border p-2 h-16 grow rounded-md focus:outline-blue-700 focus:h-[9rem]"
            />
            <button
              onClick={handleComment}
              className="bg-blue-700 flex justify-center items-center font-bold text-white p-1 w-20 h-9 rounded-md hover:bg-blue-800"
            >
              {isCommenting ?
                <LoadingSpinner />
                :
                "Submit"
              }
            </button>
          </div>
        </div>
      }
      {isLoading &&
        <div className='flex flex-col gap-6'>
          <LoadingComment />
          <LoadingComment />
        </div>
      }
      {comments?.map((comment) => (
        <Comment key={comment.id} comment={{
          id: comment.id,
          content: comment.content,
          postId: comment.postId,
          parentId: comment.parentId,
          user: comment.user,
          replies: comment.replies
        }} />
      ))}

    </div>
  );
};

export const PostCardComment = ({ comment }: CommentProps) => {
  return (
    <div className='flex flex-row justify-start gap-2'>
      <Link href={"/user/" + comment.user.id}>
        <ProfileImage
          className="w-8 h-8"
          user={{
            ...comment.user,
            name: comment.user.name ?? null,
            image: comment.user.image ?? null,
            email: comment.user.email ?? null,
          }}
        />
      </Link>
      <div className='grow p-4 flex flex-col gap-2 bg-gray-100 rounded-md hover:bg-gray-200'>
        <div className='flex flex-row justify-start items-center gap-2'>
          <span className='text-md font-bold'>{comment.user.name}</span>
          <span className='text-sm text-gray-400'>Yesterday</span>
        </div>

        <p>
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export const RecentCommentsSection = ({ postId }: PostIdProps) => {
  const { data: comments, isLoading } = api.comment.getRecentCommentsByPost.useQuery({ postId });

  return (
    <div className='flex flex-col p-8 gap-6'>
      {isLoading &&
        <div className='flex flex-col gap-6'>
          <LoadingComment />
        </div>
      }
      {comments?.map((comment) => (
        <PostCardComment key={comment.id} comment={{
          id: comment.id,
          content: comment.content,
          postId: comment.postId,
          parentId: comment.parentId,
          user: comment.user,
          replies: comment.replies
        }} />
      ))}
      <div className='pl-8'>
        <Link href={"/post/" + postId}>
          <button className='p-2 rounded-md hover:bg-gray-100' >
            See all 25 comments
          </button>
        </Link>
      </div>

    </div>
  );
}