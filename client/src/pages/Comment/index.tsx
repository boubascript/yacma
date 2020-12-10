import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import { CommentData } from "utils/comments";
import NewComment from "../NewComment";
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import axios from "axios";

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
  const [deletingComment, setDeletingComment] = useState(false);

  const toggleUpdateComment = (exit: boolean) => {
    setUpdatingComment(exit);
  };

  const toggleDeleteDialog = (exit: boolean) => {
    setDeletingComment(exit);
  };
  const handleDelete = async (del: boolean) => {
    if (del) {
      await axios.delete(
        `api/comments/${courseId}/posts/${postId}/comments/${id}`,
        {
          params: {
            courseId: courseId,
            postId: postId,
            commentId: id,
          },
        }
      );
      refresh(); // refresh comments
    }
    setDeletingComment(false);
  };

  return (
    <>
      {!updatingComment ? (
        <Container>
          <h5>{author}</h5>
          <p>{comment}</p>
          <Button color="primary" onClick={() => toggleUpdateComment(true)}>
            Edit
          </Button>
          {!deletingComment ? (
            <Button color="primary" onClick={() => toggleDeleteDialog(true)}>
              Delete
            </Button>
          ) : (
            <Dialog
              open={deletingComment}
              onClose={() => toggleDeleteDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete this comment? :("}
              </DialogTitle>
              <DialogActions>
                <Button onClick={() => handleDelete(false)} color="primary">
                  Disagree
                </Button>
                <Button
                  onClick={() => handleDelete(true)}
                  color="primary"
                  autoFocus
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Container>
      ) : (
        <NewComment
          courseId={courseId}
          exit={toggleUpdateComment}
          refresh={refresh}
          postId={postId}
          comment={commentData}
        />
      )}
    </>
  );
};

export default Comment;
