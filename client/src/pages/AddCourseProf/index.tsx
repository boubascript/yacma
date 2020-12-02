import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";
import axios from 'axios';

import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import Navbar from "components/Navbar";

interface CourseData {
  code: string;
  name: string;
  description: string;
  educator: string;
}
const DEFAULT_COURSE_DATA: CourseData = {
  code: "",
  name: "",
  description: "",
  educator: "",
};
const AddCourseProf: React.FunctionComponent = () => {
  const { user, userData, addCourseContext } = useContext(UserContext);
  const history = useHistory();


  const [courseData, setCourseData] = useState<CourseData>(DEFAULT_COURSE_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({
      ...courseData,
      [e.target.name!]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCourseData({
      ...courseData,
      educator: userData!.firstName + " " + userData!.lastName
    })
    if (!userData!.courses.includes(courseData.code)) {

      const addedCourse = await axios.get("/courses/addCourseAdmin", {
        params: {
          "courseData": {...courseData, educator: userData!.firstName + " " + userData!.lastName},
          "uid": user!.uid
      }});

      if (addedCourse) {
        addCourseContext(courseData.code);
        history.push("/me");
      } else {
        console.log("");
      }
    }
    else {
      console.log("This course code is already in your courses.");
    }
  }
  

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
                name="code"
                label="Course Code"
                id="code"
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
