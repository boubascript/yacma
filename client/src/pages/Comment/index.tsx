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

  // TODO: Find a better way to do this
  // const refreshComments = async () => {
  //   const commentsData = (id &&
  //     (await getComments(courseId, id))) as CommentData[];
  //   setComments(commentsData);
  // };

  /* TODO: Update + delete functions */
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
          comment={comment}
          id={id}
        />
      )}
    </>
  );
};

export default Comment;
