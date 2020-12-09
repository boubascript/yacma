import React, { useState, useEffect, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { UserContext } from "utils/auth";
import axios from "axios";
import { useHistory } from "react-router-dom";

interface IChildProps {
  refresh: () => void;
}

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
const AddCourseProf: React.FC<IChildProps> = (props) => {
  //@ts-ignore
  const {refresh} = props;

  const { user, userData, addCourseContext } = useContext(UserContext);

  const [courseData, setCourseData] = useState<CourseProps>(
    DEFAULT_COURSE_DATA
  );

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({ ...courseData, [e.target.name!]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCourseData({
      ...courseData,
      educator: userData!.firstName + " " + userData!.lastName,
    });

    // Make sure user is not already enrolled
    const addedCourse = await axios.post("/courses/addCourseAdmin", {
      data: {
        courseData: {
          ...courseData,
          educator: userData!.firstName + " " + userData!.lastName,
        },
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
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="code"
            label="Course Code"
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
