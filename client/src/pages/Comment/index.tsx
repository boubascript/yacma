import React from "react";
import Container from "@material-ui/core/Container";
import { CommentData } from "utils/comments";

interface CommentProps {
  postId: string;
  commentData: CommentData;
}
const Comment: React.FunctionComponent<CommentProps> = ({
  commentData,
  postId,
}: CommentProps) => {
  const { author, comment, id } = commentData; // id => commentId

  /* TODO: Update + delete functions */
  return (
    <Container>
      <p>{author}</p>
      <p>{comment}</p>
    </Container>
  );
};

export default Comment;
