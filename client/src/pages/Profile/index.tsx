import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";
import { getCourses, CourseData } from "utils/courses";
import Navbar from "components/Navbar";
import { Typography, Button } from "@material-ui/core";
import axios from 'axios';

const Profile: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin, courses } = userData || {};
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const history = useHistory();
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
            {!loadingCourses &&
              coursesData.map(({ name, id, description, educator }, index) => (
                <div key={`courseData${index}`}>
                  <Typography variant="h3">
                    <p key="courseName">
                      <b>{name}</b>
                    </p>
                  </Typography>
                  <p key="courseId"> {id} </p>
                  <p key="courseDescription"> {description} </p>
                  {!isAdmin && <p key="educator"> Professor {educator} </p>}
                  <hr></hr>
                  <Button
                    name={id}
                    onClick={() => {
                      loadCourse(id);
                    }}
                  >
                    Go To Course
                  </Button>
                </div>
              ))}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Profile;
