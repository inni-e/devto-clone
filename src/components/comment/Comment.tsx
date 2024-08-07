import { useState } from 'react';
import { api } from '~/utils/api';
import { User } from '@prisma/client';

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
  const replyMutation = api.comment.replyToComment.useMutation();
  const handleReply = () => {
    replyMutation.mutate({ commentId: comment.id, content: reply });
    setReply('');
  };

  // We must also fetch this comments replies here
  const { data: replies, isLoading } = api.comment.getRepliesByComment.useQuery({ commentId: comment.id });

  return (
    <div className="border p-2">
      <p>{comment.user.name}: {comment.content}</p>
      <div className="ml-4">
        {replies?.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply to this comment"
          className="border p-1"
        />
        <button onClick={handleReply} className="ml-2 bg-blue-500 text-white p-1">Reply</button>
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
  const createCommentMutation = api.comment.createComment.useMutation();

  const handleComment = () => {
    createCommentMutation.mutate({ postId, content: newComment });
    setNewComment('');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
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
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
        className="border p-1"
      />
      <button onClick={handleComment} className="ml-2 bg-blue-500 text-white p-1">Comment</button>
    </div>
  );
};