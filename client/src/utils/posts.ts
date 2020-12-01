import { db } from "config/firebase";

export interface PostData {
  title: string;
  author: string;
  description: string;
  links: string;
}

/**
 * @desc Determines if course exists
 * @return true if course exists
 * @param courseId Course id which posts belong to
 */
const courseExists = async (courseId: string) => {
  const courseRef = db.collection("courses").doc(courseId);
  try {
    const courseSnap = await courseRef.get();
    if (!courseSnap.exists) {
      console.log("Course does not exist :/");
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log("Something went wrong :/");
  }
};

/**
 * @desc Get post data
 * @return Array of all posts
 * @param uid Current user id
 * @param courseId course id which posts belong to
 * Cost = Two calls to DB
 */
export const getPosts = async (uid: string, courseId: string) => {
  // Check if course exists
  if (courseExists(courseId)) {
    try {
      const postsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts");
      const postsSnap = await postsRef.get();

      // Check if posts collection exists
      if (postsSnap.size > 0) {
        let postData: Array<Object> = [];

        postsSnap.forEach((doc) => {
          postData.push(doc.data());
        });

        return postData;
      } else {
        console.log("No posts for this course");
      }
    } catch (e) {
      console.log("Error, could not get Course/Post Data");
    }
  } else {
    console.log("Course does not exist...");
  }
};

/**
 * @desc Get post
 * @return Post
 * @param courseId Course id which posts belong to
 * @param postId  Post Id
 * Cost = Two calls to DB
 */
export const getPost = async (courseId: string, postId: string) => {
  // Check if course exists
  if (courseExists(courseId)) {
    try {
      const postRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId);
      const post = await postRef.get();

      if (!post.exists) {
        console.log("No such post exists. *raises eyebrow*");
      } else {
        return post.data();
      }
    } catch (e) {
      console.log("Could not add post");
    }
  } else {
    console.log("Course does not exist...");
  }
};

/**
 * @desc Add Post to Course
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postData Post object data
 * Cost = Two calls to DB
 */
// TODO: Reduce calls from three -> one
export const addPost = async (courseId: string, postData: PostData) => {
  // Check if course exists
  if (courseExists(courseId)) {
    try {
      const postsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts");

      // Add new post with a generated id.
      await postsRef.add(postData);
      return true;
    } catch (e) {
      console.log("Error, could not add post :O");
    }
  } else {
    console.log("Course does not exist...");
  }
};

/**
 * @desc Update post
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postId  Post Id
 * @param postData Post object data
 * Cost = Two calls to DB
 */
export const updatePost = async (
  courseId: string,
  postId: string,
  postData: PostData
) => {
  // Check if course exists
  if (courseExists(courseId)) {
    try {
      const postRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId);
      await postRef.update(postData);
      return true;
    } catch (e) {
      console.log("Could not edit post.", e);
    }
  } else {
    console.log("Course does not exist...");
  }
};

// TODO: Delete Post => Cloud Function to delete associated comments
