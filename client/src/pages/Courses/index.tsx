import React, { useState, useEffect, useContext } from "react";
import {
  Collapse,
  Card,
  CardContent,
  Typography,
  Button,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "utils/auth";
import { CourseData } from "utils/courses";
import Navbar from "components/Navbar";
import AddCourseStudent from "./AddCourseStudent";
import AddCourseProf from "./AddCourseProf";
import axios from "axios";
import ClassCard from "./ClassCard";

const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#eceef8",
  },
  button: {
    margin: "20px",
  },
  icon: {
    margin: "5px",
    marginLeft: "8px",
    marginRight: "2px",
  },
  search: {
    marginTop: "20px",
  },
  addCard: {
    minWidth: 300,
    maxWidth: 300,
    margin: "20px",
    marginTop: 0,
    padding: "20px",
    display: "inline-block",
  },
  card: {
    minWidth: 300,
    maxWidth: 300,
    margin: "20px",
    display: "inline-block",
  },
  title: {
    marginTop: "20px",
  },
});

const Courses: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);

  const forceRefresh = async () => {
    await getAsyncCourses();
    setChecked(false);
  };

  const getAsyncCourses = async () => {
    if (user) {
      const { data } = await axios.get("api/courses/getCourses", {
        params: { courseIds: userData?.courses },
      });
      if (data) {
        // @ts-ignore
        setCoursesData(data.courses?.map((doc) => doc as CourseData));
      }
    }
  };

  useEffect(() => {
    getAsyncCourses();
  }, [userData]);

  const handleClick = () => {
    setChecked(!checked);
  };

  return (
    <div className={classes.root}>
      <Navbar />
      <Typography variant="h2" className={classes.title}>
        <b>My Courses</b>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleClick}
      >
        {" "}
        Add Course <AddCircleIcon className={classes.icon} />
      </Button>
      <Collapse in={checked}>
        <Card className={classes.addCard}>
          {userData?.isAdmin ? (
            <AddCourseProf refresh={forceRefresh} />
          ) : (
            <AddCourseStudent refresh={forceRefresh} />
          )}
        </Card>
      </Collapse>

      <div className={classes.root}>
        {coursesData?.map(({ name, id, code, description, educator }) => (
          <div>
            <ClassCard
              key={id}
              name={name}
              id={id}
              code={code}
              description={description}
              educator={educator}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
