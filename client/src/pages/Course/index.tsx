import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { getCourse, CourseData } from "utils/courses";
import { getPosts, PostDataId } from "utils/posts";
import { Button, Typography } from "@material-ui/core";
import Navbar from "components/Navbar";
import Post from "pages/Post";
import NewPost from "pages/NewPost";

const Course: React.FunctionComponent<RouteComponentProps> = ({
  location: { search },
}) => {
  const [course, setCourse] = useState<CourseData>();
  const [posts, setPosts] = useState<PostDataId[]>([]);
  const [addingPost, setAddingPost] = useState(false);
  const courseId = search.substring(1);

  useEffect(() => {
    (async () => {
      // TODO: Add error handling
      const courseData = (await getCourse(courseId)) as CourseData;
      setCourse(courseData);

      const postsData = (await getPosts(courseId)) as PostDataId[];
      setPosts(postsData);
    })();
  }, [courseId]);

  const handleNewPost = () => {
    setAddingPost(true);
  };

  const toggleNewPost = (exit: boolean) => {
    setAddingPost(exit);
  };

  // TODO: Find a better way to do this
  const refreshPosts = async () => {
    const postsData = (await getPosts(courseId)) as PostDataId[];
    setPosts(postsData);
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h2">
        Course: {course?.name} #{course?.id}
      </Typography>
      <Typography variant="h3">{course?.educator}</Typography>
      <Typography variant="h4">{course?.description}</Typography>
      {!addingPost ? (
        <Button variant="contained" color="primary" onClick={handleNewPost}>
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
        {posts &&
          posts.map((doc, index) => (
            <Post key={index} courseId={courseId} post={doc} />
          ))}
      </div>
    </div>
  );
};

export default Course;
