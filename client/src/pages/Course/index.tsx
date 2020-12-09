import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { CourseData } from "utils/courses";
import { PostData } from "utils/posts";
import { Button, Typography } from "@material-ui/core";
import Navbar from "components/Navbar";
import Post from "pages/Post";
import NewPost from "pages/NewPost";
import axios from "axios";

const Course: React.FunctionComponent<RouteComponentProps> = ({
  location: { search },
}) => {
  const [course, setCourse] = useState<CourseData>();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [addingPost, setAddingPost] = useState(false);
  const courseId = search.substring(1);

  const getCoursePosts = async () => {
    if (courseId) {
      const { data: postsData } = await axios.get(`/posts/${courseId}/posts`, {
        params: {
          courseId: courseId,
        },
      });
      setPosts(postsData);
    }
  };

  const getCourseInfo = async () => {
    if (courseId) {
      const { data } = await axios.get("/courses/getCourse", {
        params: {
          courseId: courseId,
        },
      });

      const courseData = data as CourseData;
      setCourse(courseData);
      await getCoursePosts();
    }
  };

  // TODO: Add loading script check
  useEffect(() => {
    if (courseId) {
      getCourseInfo();
    }
  }, []);

  const toggleNewPost = (exit: boolean) => {
    setAddingPost(exit);
  };

  // TODO: Find a better way to do this
  const refreshPosts = async () => {
    getCoursePosts();
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h2">
        Course: {course?.name} #{course?.code}
      </Typography>
      <Typography variant="h3">{course?.educator}</Typography>
      <Typography variant="h4">{course?.description}</Typography>
      {!addingPost ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            toggleNewPost(true);
          }}
        >
          Add Post
        </Button>
      ) : (
        <NewPost
          courseId={courseId}
          exit={toggleNewPost}
          refresh={refreshPosts}
        />
      )}
      <div className="posts">
        {posts?.map((doc, index) => (
          <Post
            key={index}
            courseId={courseId}
            post={doc}
            refresh={refreshPosts}
          />
        ))}
      </div>
    </div>
  );
};

export default Course;
