import React, { useState, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import {
  addComment,
  CommentData,
  getComment,
  updateComment,
} from "utils/comments";

const DEFAULT_COMMENT_DATA: CommentData = {
  author: "",
  comment: "",
};

const NewComment: React.FunctionComponent = (props) => {
  const { userData } = useContext(UserContext);
  const [commentData, setCommentData] = useState<CommentData>(
    DEFAULT_COMMENT_DATA
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

    // TODO: Connect CourseId and PostId via Course Context? or Props
    const comment = await addComment("4", "Eovg3jgXBbwyJdKB7HCD", commentBody);
    console.log("Add Comment Success:", comment);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField
            name="comment"
            label="Comment"
            id="Comment"
            multiline
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <br></br>
      <Button type="submit" variant="contained" color="primary">
        New Comment
      </Button>
    </form>
  );
};

export default NewComment;
