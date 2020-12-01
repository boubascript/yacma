import React, { useState, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import { addPost, PostData } from "utils/posts";

// TODO: Update links to media object type
const DEFAULT_POST_DATA: PostData = {
  title: "",
  author: "",
  description: "",
  links: "",
};

const NewPost: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const [postData, setPostData] = useState<PostData>(DEFAULT_POST_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const postBody = {
      ...postData,
      author: userData!.firstName + " " + userData!.lastName,
    };

    // TODO: Connect to CourseId
    const post = await addPost("4", postBody);
    console.log("After Posted ;)", post);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Title"
            id="Title"
            multiline
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            id="Description"
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*, video/*, .pdf,.doc"
            id="inputFiles"
            multiple
            type="file"
          />
        </Grid>
      </Grid>

      <br></br>
      <Button type="submit" variant="contained" color="primary">
        New Post
      </Button>
    </form>
  );
};

export default NewPost;
