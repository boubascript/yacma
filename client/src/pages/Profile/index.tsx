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

  const [courses, updateCourses] = useState<CourseData[]>([]);

  const getCourses = async () => {
    let docs: CourseData[] = [];
    if (user) {
      db.collection("courses")
        .where("educator", "==", firstName + " " + lastName)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.docs.map(function (doc) {
            updateCourses([...courses, doc.data() as CourseData]);
            docs.push(doc.data() as CourseData);
          });
        })
        .catch(function (error) {
          console.log("Error getting courses: ", error);
        });
    }
    // TODO: Query for user profile information and update state
    console.log(courses);
  };

  useEffect(() => {
    (async () => {
      await getCourses();
    })();
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
            {courses.map(({ name, id, description, educator }) => (
              <div>
                <p>
                  {" "}
                  <b> {id} </b>{" "}
                </p>
                <p> {name} </p>
                <p> {description} </p>
              </div>
            ))}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Profile;
