import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";
import { getCourses, CourseData } from "utils/courses";

const Profile: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin } = userData || {};
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    //TO DO: set timeout
    const getAsyncCourses = async () => {
      if (user) {
        const data = await getCourses(userData!.courses!);
        if (data) {
          const courseData: CourseData[] = [];
          data.map((doc) => {
            courseData.push(doc.data() as CourseData);
          });
          // set hook to retrieved course objects array
          setCourses(courseData);
        }
        setLoadingCourses(false);
      }
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
              ? courses.map(({ name, id, description, educator }, index) => (
                  <div key={id}>
                    <Typography variant="h3">
                      <p key="courseName">
                        {" "}
                        <b>{name}</b>{" "}
                      </p>
                    </Typography>
                    <p key="courseId"> {id} </p>
                    <p key="courseDescription"> {description} </p>
                    <hr></hr>
                  </div>
                ))
              : " "}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Profile;
