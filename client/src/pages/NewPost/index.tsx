import React, { useState, useEffect, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";

interface PostData {
  title: string;
  author: string;
  description: string;
  links: string;
}
const DEFAULT_POST_DATA: PostData = {
  title: "",
  author: "",
  description: "",
  links: "",
};

const NewPost: React.FunctionComponent = () => {
  const [postData, setPostData] = useState<PostData>(DEFAULT_POST_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({ ...postData, [e.target.name!]: e.target.value });
  };

  return (
    <form action="/posts" id="NewPostForm" noValidate autoComplete="off">
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField
            id="Title"
            label="Title"
            multiline
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Description"
            label="Description"
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
