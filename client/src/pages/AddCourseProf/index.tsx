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
import { addCourseAdmin } from "utils/courses";

const AddCourseProf: React.FunctionComponent = () => {
  const { user, userData, addCourseContext } = useContext(UserContext);
  const history = useHistory();

  interface CourseData {
    id: string;
    name: string;
    description: string;
    educator: string;
  }

  const DEFAULT_COURSE_DATA: CourseData = {
    id: "",
    name: "",
    description: "",
    educator: userData!.firstName + " " + userData!.lastName,
  };
  const [courseData, setCourseData] = useState<CourseData>(DEFAULT_COURSE_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({
      ...courseData,
      [e.target.name!]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addedCourse = await addCourseAdmin(courseData, user!.uid);
    if (addedCourse) {
        addCourseContext(courseData.id);
        history.push("/me");
    } else {
      console.log("");
    }
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h1">Course Info</Typography>
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="name"
                label="Course Name"
                id="name"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="description"
                label="Course Description"
                id="description"
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

export default AddCourseProf;
