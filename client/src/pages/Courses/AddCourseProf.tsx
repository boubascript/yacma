import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import { addCourseAdmin } from "utils/courses";

interface CourseProps {
  id: string;
  name: string;
  description: string;
  educator: string;
}
const DEFAULT_COURSE_DATA: CourseProps = {
  id: "",
  name: "",
  description: "",
  educator: "",
};
const AddCourseProf: React.FunctionComponent = () => {
  const { user, userData, addCourseContext } = useContext(UserContext);

  const [courseData, setCourseData] = useState<CourseProps>(
    DEFAULT_COURSE_DATA
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({ ...courseData, [e.target.name!]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCourseData({
      ...courseData,
      educator: userData!.firstName + " " + userData!.lastName,
    });
    if (!userData?.courses || !userData.courses.includes(courseData.id)) {
      const addedCourse = await addCourseAdmin(courseData, user!.uid);
      if (addedCourse) {
        addCourseContext(courseData.id);
      } else {
        console.log("");
      }
    } else {
      console.log("This id is already in your courses.");
    }
  };

  return (
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
  );
};

export default AddCourseProf;
