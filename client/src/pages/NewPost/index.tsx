import React, { useState, useContext } from "react";
import { UserContext } from "utils/auth";
import { PostData } from "utils/posts";
import { Grid, TextField, Button } from "@material-ui/core";
import axios from "axios";

// TODO: Update links to media object type
const DEFAULT_POST_DATA: PostData = {
  title: "",
  author: "",
  description: "",
  links: "", // TODO: links might be any array of URLS
};

interface NewPostProps {
  courseId: string;
  exit: Function;
  refresh: Function;
  postId?: string;
  post?: PostData;
}
const NewPost: React.FunctionComponent<NewPostProps> = ({
  courseId,
  exit,
  refresh,
  post,
  postId,
}) => {
  const { user, userData } = useContext(UserContext);
  const [postData, setPostData] = useState<PostData>(post || DEFAULT_POST_DATA);

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var files = e.target.files || [];
    setSelectedFile(files[0]);
    console.log(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const postBody = {
      ...postData,
      author: userData!.firstName + " " + userData!.lastName,
    };

    if (courseId) {
      if (postId) {
        await axios.put(`api/posts/${courseId}/posts/${postId}`, {
          params: {
            courseId: courseId,
            postId: postId,
            uid: user!.uid,
          },
          data: {
            postBody,
          },
        });
      } else {
        const formData = new FormData();
        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        for (var key in postBody) {
          // @ts-ignore
          formData.append(key, postBody[key]);
        }
        formData.append("courseId", courseId);
        formData.append("uid", user!.uid);
        await axios.post(`api/posts/${courseId}/posts/`, formData);
      }
      refresh(); // refresh comments in Course Page
    }
    exit(false); // exit New Post form
  };

  const cancel = () => {
    exit(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Title"
            id="Title"
            defaultValue={postData.title}
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
            defaultValue={postData.description}
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        {!postId && (
          <Grid item xs={12}>
            <input
              accept="image/*, video/*, .pdf,.doc"
              defaultValue={postData?.links}
              id="inputFiles"
              type="file"
              onChange={handleFileChange}
            />
          </Grid>
        )}
      </Grid>

      <br></br>
      <Button type="submit" variant="contained" color="primary">
        {post ? "Update" : "New Post"}
      </Button>
      <Button variant="contained" color="primary" onClick={cancel}>
        Cancel
      </Button>
    </form>
  );
};

export default NewPost;
