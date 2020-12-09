import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { CommentData, updateComment } from "utils/comments";
import NewComment from "../NewComment";
import { Button } from "@material-ui/core";

interface CommentProps {
  courseId: string;
  postId: string;
  commentData: CommentData;
  refresh: Function;
}
const Comment: React.FunctionComponent<CommentProps> = ({
  commentData,
  postId,
  courseId,
  refresh,
}: CommentProps) => {
  const { author, comment, id } = commentData; // id => commentId
  const [updatingComment, setUpdatingComment] = useState(false);

  const toggleUpdateComment = (exit: boolean) => {
    setUpdatingComment(exit);
  };

  /* TODO: Delete functions */
  return (
    <>
      {!updatingComment ? (
        <Container>
          <h5>{author}</h5>
          <p>{comment}</p>
          <Button color="primary" onClick={() => toggleUpdateComment(true)}>
            Edit
          </Button>
        </Container>
      ) : (
        <NewComment
          courseId={courseId}
          exit={toggleUpdateComment}
          refresh={refresh}
          postId={postId}
          comment={commentData}
          id={id}
        />
      )}
    </>
  );
};

export default Comment;
