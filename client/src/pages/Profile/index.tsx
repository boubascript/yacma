import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";
import { CourseData } from "utils/courses";
import axios from 'axios';


const Profile: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin, courses } = userData || {};
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const history = useHistory();

  useEffect(() => {
    //TO DO: set timeout
    const getAsyncCourses = async () => {
      if (user) {
        const data = await axios.get('/courses/getCourses', {params: {"courseCodes": courses}});
        if (data.data) {
          // @ts-ignore
          setCoursesData(data.data.courses.map(doc => doc as CourseData));
        }
        setLoadingCourses(false);
      }
    };

    getAsyncCourses();
  }, []);

  const loadCourse = (id: string) => {
    history.push({
      pathname: "/coursepage",
      search: id,
    });
  };

  return (
    <div>
      <Navbar />
      {userData && (
        <div>
          <Typography variant="h1">
            Welcome,{" "}
            {`${isAdmin ? "Professor" : ""} ${firstName} ${lastName} !`}
          </Typography>

          <Typography variant="h5">
            <b>Your Courses: </b>
            {!loadingCourses
              && coursesData.map(({ name, id, code, description, educator }, index) => (
                  <div key="courseData">
                    <Typography variant="h3">
                      <p key="courseName">
                        <b>{name}</b>
                      </p>
                    </Typography>
                    <p key="courseId"> {code} </p>
                    <p key="courseDescription"> {description} </p>
                    {!isAdmin &&  <p key="educator"> Professor {educator} </p>}
                    <hr></hr>
                    <Button
                      name={id}
                      onClick={() => {
                        loadCourse(id!);
                      }}>
                      Go To Course
                    </Button>
                  </div>
                ))
              }
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Profile;
