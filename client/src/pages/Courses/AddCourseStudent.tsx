import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import axios from "axios";

interface IChildProps {
  refresh: () => void;
}

const AddCourseStudent: React.FC<IChildProps> = ({
  refresh
}) => {
  const { user, addCourseContext } = useContext(UserContext);
  const [courseCode, setCourseCode] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Make sure user is not already enrolled
    const addedCourse = await axios.post("/courses/addCourseStudent", {
      data: {
        courseCode: courseCode,
        uid: user!.uid,
      },
    });

      //Response is either empty, or passes the document id
      if (addedCourse.data) {
        //add id to user contenxt, this doesn't seem to be updating
        await addCourseContext(addedCourse.data);
        refresh();
      } else {
        console.log("Already enrolled.");
      }
    };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="courseCode"
              label="Course Code"
              id="code"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <br></br>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Add Course
        </Button>
      </form>
    </div>
  );
};

export default AddCourseStudent;
