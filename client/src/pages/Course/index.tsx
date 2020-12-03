import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { getCourse, CourseData } from "utils/courses";
import Navbar from "components/Navbar";
import { Typography } from "@material-ui/core";

const Course: React.FunctionComponent<RouteComponentProps> = ({
  location: { search },
}) => {
  const [course, setCourse] = useState<CourseData>();

  const getCourseInfo = async () => {
    const courseId = search.substring(1);
    // TODO: Add error handling
    const course = (await getCourse(courseId)) as CourseData;
    setCourse(course);
  };

  useEffect(() => {
    getCourseInfo();
  }, []);

  return (
    <div>
      <Navbar />
      <Typography variant="h2">
        Course: {course?.name} #{course?.id}
      </Typography>
      <Typography variant="h3">{course?.educator}</Typography>
      <Typography variant="h4">{course?.description}</Typography>
    </div>
  );
};

export default Course;
