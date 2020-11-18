import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";
import { db } from "config/firebase";

const Profile: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin } = userData || {};

  interface CourseData {
    id: string;
    name: string;
    description: string;
    educator: string;
  }

  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loadingCoursesState, setLoadingCoursesState] = useState(true);

  const getCourses = async () => {
    let docs: CourseData[] = [];
    if (user) {
      db.collection("courses")
        .where("educator", "==", firstName + " " + lastName)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.docs.map(function (doc) {
            docs.push(doc.data() as CourseData);
          });
          setCourses(courses.concat(docs));
          setLoadingCoursesState(false);
        })
        .catch(function (error) {
          console.log("Error getting courses: ", error);
        });
    }
  };

  useEffect(() => {
    (async () => {
      await getCourses();
    })();
  }, []);

  let courseContent: JSX.Element[] = [];

  if (!loadingCoursesState) {
    courses.map(({ name, id, description, educator }, index) =>
      courseContent.push(
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
      )
    );
  }

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
            {courseContent}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Profile;
