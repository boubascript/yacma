import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";
import { getCourses, CourseData } from "utils/courses";
import axios from 'axios';
import { any } from "prop-types";

const Profile: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin, courses } = userData || {};
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  console.log("courses");
  console.log(courses);
  console.log(coursesData);

  useEffect(() => {
    //TO DO: set timeout
    const getAsyncCourses = async () => {
      if (user) {
        const data = await axios.get('/courses/getCourses', {params: {"courseIds": courses}});
        console.log(data.data);
        if (data.data) {
          // @ts-ignore
          setCoursesData(data.data.courses.map(doc => doc as CourseData));
        }
        setLoadingCourses(false);
      };
    };

    getAsyncCourses();
  }, []);

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
              && coursesData.map(({ name, id, description, educator }, index) => (
                  <div key="courseData">
                    <Typography variant="h3">
                      <p key="courseName">
                        <b>{name}</b>
                      </p>
                    </Typography>
                    <p key="courseId"> {id} </p>
                    <p key="courseDescription"> {description} </p>
                    {!isAdmin &&  <p key="educator"> Professor {educator} </p>}
                    <hr></hr>
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
