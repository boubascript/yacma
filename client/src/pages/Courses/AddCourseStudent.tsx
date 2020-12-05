import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import { addCourseStudent } from "utils/courses";

const AddCourseStudent: React.FunctionComponent = () => {
  const { user, userData, addCourseContext } = useContext(UserContext);
  const [courseId, setCourseId] = useState<string>("");
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Make sure user is not already enrolled
    if (!userData!.courses.includes(courseId)) {
      const addedCourse = await addCourseStudent(courseId, user!.uid);
      if (addedCourse) {
        addCourseContext(courseId);
      } else {
        console.log("");
      }
    } else {
      console.log("Already enrolled. Please enter another course id.");
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
              name="id"
              label="Course ID"
              id="id"
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
