import React, { useState, useContext } from "react";
import { UserContext } from "utils/auth";
import { deleteComment } from "utils/services";
import { CommentData } from "utils/types";
import NewComment from "../NewComment";

import { Button, Container, Dialog, DialogActions, DialogTitle, Typography, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
  const { user, userData } = useContext(UserContext);
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
      await deleteComment(courseId, postId, id, user!.uid);
      refresh(); // refresh comments
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div style={{borderTop:'1px solid rgb(217, 217, 217)'}}>
      {!updatingComment ? (
        <Container>
          <div>
              <div style={{marginTop:'5px', marginLeft:'10px'}}>
                <Typography variant="h6">
                  <b>{author}</b>
                </Typography>
                <Typography variant="h6">
                  {comment}
                </Typography>
              </div>
              <IconButton aria-label="settings" onClick={() => toggleUpdateComment(true)}>
                <EditIcon />
              </IconButton>
              {!deletingComment ? (
                <IconButton aria-label="settings"  onClick={() => toggleDeleteDialog(true)}>
                  <DeleteIcon />
                </IconButton>
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
          </div>
          
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
      </div>
    </>
  );
};

export default Comment;
