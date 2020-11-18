import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";
import { db } from "config/firebase";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import Navbar from "components/Navbar";

const AddCourse: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
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

  const addCourse = async (courseData: CourseData) => {
    const courseRef = db.collection("courses").doc(courseData.id);

    courseRef
      .get()
      .then((docSnapshot) => {
        // check that course id is not taken
        if (!docSnapshot.exists) {
          courseRef.onSnapshot((doc) => {
            courseRef.set({ ...courseData });
          });

          // add to user
          const userRef = db.collection("users").doc(user!.uid);
          userRef.get().then((docSnapshot) => {
            if (docSnapshot.data()!.courses) {
              userRef
                .update({
                  courses: [...docSnapshot.data()!.courses, courseData.id],
                })
                .catch((err) => {
                  console.log("Error adding course id to user", err);
                });
            } else {
              userRef
                .update({
                  courses: [courseData.id],
                })
                .catch((err) => {
                  console.log("Error adding course id to user", err);
                });
            }
            return true;
          });
        }
        //TO DO update userData in context by fetching data on /me
        else {
          //doc id exists
          console.log("Use another ID pls.");
        }
      })
      .catch((err) => {
        console.log("Error adding course to courses", err);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({
      ...courseData,
      // convert to boolean only for loginData.isAdmin
      [e.target.name!]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addedCourse = await addCourse(courseData);
    if (courseData) {
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

export default AddCourse;
