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
import { useHistory } from "react-router-dom";

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

interface ClassProps {
  name: string;
  id?: string;
  code: string;
  description: string;
  educator: string;
}

const ClassCard: React.FC<ClassProps> = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const loadCourse = (id: string) => {
    history.push({
      pathname: "/coursepage",
      search: id,
    });
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4">
          {" "}
          <b>{props.name} </b>
        </Typography>
        <Typography variant="h5"> Code: {props.code} </Typography>
        <Typography variant="h5">Professor: {props.educator}</Typography>
        <Typography variant="h5">{props.description}</Typography>
        <Button
                      name={props.code}
                      onClick={() => {
                        loadCourse(props.id!);
                      }}>
                      Go To Course
            </Button>
      </CardContent>
    </Card>
  );
};

const Courses: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  

  useEffect(() => {
   //TO DO: set timeout
   const getAsyncCourses = async () => {
    if (user) {
      const { data } = await axios.get('/courses/getCourses', {params: {"courseIds": userData!.courses}});
      if (data) {
        // @ts-ignore
        setCoursesData(data.courses.map(doc => doc as CourseData));
      }
      setLoadingCourses(false);
    }
  };

    getAsyncCourses();
  }, []);

  const handleClick = () => {
    setChecked((prev) => !prev);
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
          {userData?.isAdmin ? <AddCourseProf /> : <AddCourseStudent />}
        </Card>
      </Collapse>

      <div className={classes.root}>
        {!loadingCourses &&
          coursesData.map(({ name, id, code, description, educator }, index) => (
            <div>
            <ClassCard
              name={name}
              id = {id}
              code={code}
              description={description}
              educator={educator}
              key={`courseData${index}`}
            />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Courses;
