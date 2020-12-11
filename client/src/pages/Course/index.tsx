import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { functions } from "config/firebase";
import { CourseData, PostData } from "utils/types";
import { Button, Typography } from "@material-ui/core";
import Navbar from "components/Navbar";
import Post from "pages/Post";
import NewPost from "pages/NewPost";

import { UserContext } from "utils/auth";
import { getCourse, getPosts } from "utils/services";

const deleteCourse = functions.httpsCallable("deleteCourse");
const deletePost = functions.httpsCallable("deletePost");

const Course: React.FunctionComponent<RouteComponentProps> = ({
  location: { search },
}) => {
  const history = useHistory();
  const { userData, deleteCourseContext } = useContext(UserContext);
  const [course, setCourse] = useState<CourseData>();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [addingPost, setAddingPost] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const courseId = search.substring(1);

  const getCourseInfo = async () => {
    if (courseId) {
      const courseData = await getCourse(courseId);
      setCourse(courseData as CourseData);
      const postsData = await getPosts(courseId);
      setPosts(postsData);
    }
  };

  const removeCourse = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCourse({
        path: `courses/${courseId}`,
      });
      // Read result of the Cloud Function.
      console.log(result);
      if (result.data.path) {
        await deleteCourseContext(courseId);
        history.push("/courses");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removePost = async (id: string) => {
    try {
      const result = await deletePost({
        path: `courses/${courseId}/posts/${id}`,
      });
      // Read result of the Cloud Function.
      console.log(result);
      if (result.data.path) {
        setPosts(posts.filter(({ id: pid }) => pid !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // TODO: Add loadin script check
  useEffect(() => {
    if (courseId) {
      getCourseInfo();
    }
  }, [courseId]);

  const toggleNewPost = (exit: boolean) => {
    setAddingPost(exit);
  };

  const refreshPosts = async () => {
    const postsData = await getPosts(courseId);
    setPosts(postsData);
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
            onDelete={() => {
              removePost(doc.id!);
            }}
          />
        ))}
      </div>
      {userData?.isAdmin && (
        <Button variant="contained" color="secondary" onClick={removeCourse}>
          {isDeleting ? "Deleting Course..." : "Delete Course"}
        </Button>
      )}
    </div>
  );
};

export default Course;
