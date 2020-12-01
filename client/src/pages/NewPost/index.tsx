import React, { useState, useEffect, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";
import { getPosts, PostData } from "utils/posts";

const DEFAULT_POST_DATA: PostData = {
  title: "",
  author: "",
  description: "",
  links: "",
};

const NewPost: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const history = useHistory();

  const [postData, setPostData] = useState<PostData>(DEFAULT_POST_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({ ...postData, [e.target.name!]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostData({
      ...postData,
      author: userData!.firstName + " " + userData!.lastName,
    });

    /** if (eligible to post, in class or educator) */
    console.log("SUBMITTING...");
    const post = await getPosts(user!.uid, "4");
    // if (addedCourse) {
    //   addCourseContext(courseData.id);
    //   history.push("/me");
    // } else {
    //   console.log("");
    // }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
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
