import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { functions } from "config/firebase";
import { CourseData, PostData } from "utils/types";
import { Button, Card, Collapse, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CourseHeader from './CourseHeader';
import Navbar from "components/Navbar";
import Post from "pages/Post";
import NewPost from "pages/NewPost";

import { UserContext } from "utils/auth";
import { getCourse, getPosts } from "utils/services";

const deleteCourse = functions.httpsCallable("deleteCourse");
const deletePost = functions.httpsCallable("deletePost");

const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#eceef8",
  },
  newPostCard: {
    width:'80%',
    minWidth: 350,
    margin:'auto',
    marginTop: '25px',
    padding:'30px'
  },
})

const Course: React.FunctionComponent<RouteComponentProps> = ({
  location: { search },
}) => {
  const history = useHistory();
  const classes = useStyles();

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

  const toggleNewPost = () => {
    setAddingPost(!addingPost);
  };

  const refreshPosts = async () => {
    const postsData = await getPosts(courseId);
    setPosts(postsData);
  };

  return (
    <div className={classes.root}>
      <Navbar />
      {userData?.isAdmin && (
        <div style={{marginTop:'10px'}}>
          <Button variant="contained" color="secondary" onClick={removeCourse}>
            {isDeleting ? "Deleting Course..." : "Delete Course"}
          </Button>
        </div>
      )}
      <CourseHeader
          name={(course && course?.name) || ""}
          code={(course && course?.code) || ""}
          educator={(course && course?.educator) || ""}
          description={(course && course?.description) || ""}
      />
      <div>
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
              toggleNewPost();
            }}
          >
            Add Post
        </Button>
      </div>
      <Collapse in={addingPost}>
          <NewPost
            courseId={courseId}
            exit={toggleNewPost}
            refresh={refreshPosts}
          />
      </Collapse>
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
    </div>
  );
};

export default Course;
