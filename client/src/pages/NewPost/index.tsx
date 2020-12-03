import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const NewPost: React.FunctionComponent = () => {
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value);
  };

  return (
    <form action="/posts" id="NewPostForm" noValidate autoComplete="off">
      <div>
        <TextField
          id="Title"
          label="Title"
          multiline
          fullWidth
          variant="outlined"
          onChange={handleTitle}
        />
      </div>
      <br />
      <div>
        <TextField
          id="Description"
          label="Description"
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          onChange={handleDesc}
        />
        <input
          accept="image/*, video/*, .pdf,.doc"
          id="inputFiles"
          multiple
          type="file"
        />
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            alert(title + desc);
          }}
        >
          {" "}
          Post{" "}
        </Button>
      </div>
    </form>
  );
};

export default NewPost;
