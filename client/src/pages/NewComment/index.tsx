import React, { useState, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import { CommentData } from "utils/comments";
import axios from "axios";

const DEFAULT_COMMENT_DATA: CommentData = {
  author: "",
  comment: "",
};

interface NewCommentProps {
  courseId: string;
  postId: string;
  exit: Function;
  refresh: Function;
  comment?: CommentData;
}
const NewComment: React.FunctionComponent<NewCommentProps> = ({
  courseId,
  postId,
  exit,
  refresh,
  comment,
}) => {
  const { user, userData } = useContext(UserContext);
  const [commentData, setCommentData] = useState<CommentData>(
    comment || DEFAULT_COMMENT_DATA
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentBody = {
      ...commentData,
      author: userData!.firstName + " " + userData!.lastName,
    };

    if (courseId && postId) {
      if (comment?.id) {
        await axios.put(
          `api/comments/${courseId}/posts/${postId}/comments/${comment?.id}`,
          {
            params: {
              courseId: courseId,
              postId: postId,
              commentId: comment?.id,
              uid: user!.uid,
            },
            data: {
              commentBody,
            },
          }
        );
      } else {
        await axios.post(`api/comments/${courseId}/posts/${postId}/comments`, {
          params: {
            courseId: courseId,
            postId: postId,
            uid: user!.uid,
          },
          data: {
            commentBody,
          },
        });
      }
      refresh(); // refresh comments in Course Page
    }
    exit(false); // exit New Comment form
  };

  const cancel = () => {
    exit(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{marginTop:'10px'}}>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField
            name="comment"
            label="Comment"
            id="Comment"
            defaultValue={commentData.comment}
            multiline
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <br></br>
      <div style={{textAlign:'center'}}>
      <Button variant="contained" color="primary" onClick={cancel} style={{margin:'20px', marginTop:0}}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" color="primary" style={{margin:'20px', marginTop:0}}>
        {comment ? "Update" : "Create Comment"}
      </Button>
      </div>
    </form>
  );
};

export default NewComment;
