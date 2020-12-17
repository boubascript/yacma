import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Collapse,
  Card,
  Typography,
  Button,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "utils/auth";
import { CourseData } from "utils/types";
import Navbar from "components/Navbar";
import AddCourseStudent from "./AddCourseStudent";
import AddCourseProf from "./AddCourseProf";
import ClassCard from "./ClassCard";
import { getCourses } from "utils/services";

const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  classCards: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    display: "flex",
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
  const { userData, user, deleteCourseContext } = useContext(UserContext);
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);

  const forceRefresh = async () => {
    await getAsyncCourses();
    setChecked(false);
  };

  const getAsyncCourses = async () => {
    if (userData) {
      const data: CourseData[] = await getCourses(userData?.courses);
      setCoursesData(data);
    }
  };

  useEffect(() => {
    (async () => {
      await getAsyncCourses();
    })();
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

      <Grid container className={classes.classCards}>
        {coursesData?.map(({ name, id, code, description, educator }) => (
          <Grid item>
            <ClassCard
              key={id}
              name={name}
              id={id}
              code={code}
              description={description}
              educator={educator}
              uid={user!.uid}
              refresh={forceRefresh}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Courses;
