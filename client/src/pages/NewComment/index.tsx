import React, { useState, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import { addComment, CommentData } from "utils/comments";

const DEFAULT_COMMENT_DATA: CommentData = {
  author: "",
  comment: "",
};

type NewCommentProps = {
  courseId: string;
  postId: string;
  exit: Function;
  refresh: Function;
};
const NewComment: React.FunctionComponent<NewCommentProps> = ({
  courseId,
  postId,
  exit,
  refresh,
}) => {
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

    if (courseId && postId) {
      const comment = await addComment(courseId, postId, commentBody);
      refresh(); // refresh comments in Course Page
    }
    exit(false); // exit New Comment form
  };

  const cancel = () => {
    exit(false);
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
      <Button variant="contained" color="primary" onClick={cancel}>
        Cancel
      </Button>
    </form>
  );
};

export default NewComment;
