import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";

import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import Navbar from "components/Navbar";
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
    if (!(userData!.courses.includes(courseId))) {
      const addedCourse = await addCourseStudent(courseId, user!.uid);
      if (addedCourse) {
        addCourseContext(courseId);
        history.push("/me");
      } else {
        console.log("");
      }
    }
    else {
      console.log("Already enrolled. Please enter another course id.")
    }
  }

  return (
    <div>
      <Navbar />
      <Typography variant="h5">Enter Course ID</Typography>
      <Container maxWidth="sm">
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
      </Container>
    </div>
  );
};

export default AddCourseStudent;
