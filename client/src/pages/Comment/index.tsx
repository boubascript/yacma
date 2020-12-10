import React, { useState } from "react";
import { deleteComment } from "utils/services";
import { CommentData } from "utils/types";
import NewComment from "../NewComment";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Container,
} from "@material-ui/core";

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
  const { author, comment, id } = commentData;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleUpdateComment = (exit: boolean) => {
    setIsUpdating(exit);
  };

  const toggleDeleteDialog = (exit: boolean) => {
    setIsDeleting(exit);
  };
  const handleDelete = async (del: boolean) => {
    if (del && id) {
      await deleteComment(courseId, postId, id);
      refresh(); // refresh comments
    }
    setIsDeleting(false);
  };

  return (
    <>
      {!isUpdating ? (
        <Container>
          <h5>{author}</h5>
          <p>{comment}</p>
          <Button color="primary" onClick={() => toggleUpdateComment(true)}>
            Edit
          </Button>
          {!isDeleting ? (
            <Button color="primary" onClick={() => toggleDeleteDialog(true)}>
              Delete
            </Button>
          ) : (
            <Dialog
              open={isDeleting}
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
