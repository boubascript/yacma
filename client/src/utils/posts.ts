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

/* Might not need... */
const courseExists = async (courseId: string) => {
  const courseRef = db.collection("courses").doc(courseId);

  try {
    const courseSnap = await courseRef.get();

    if (!courseSnap.exists) {
      console.log("Course does not exist :/");
      return false;
    } else {
      console.log(courseSnap.data());
      return true;
    }
  } catch (error) {
    console.log("Something went wrong");
  }
};

/**
 * @desc Get post data
 * @return Array of all posts
 * @param uid Current user id
 * @param courseId course id which posts belong to
 */

// TODO: Reduce calls from two -> one
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
        //TODO: update to array return
        postsSnap.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
        });
      } else {
        console.log("No posts for this course");
      }
    } catch (error) {
      console.log("Error, could not get Course/Post Data");
    }
  }
};

/**
 * @desc Add Post to Course
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postData Post object data
 */

// TODO: Reduce calls from three -> one
export const addPostToPosts = async (courseId: string, postData: PostData) => {
  // Check if course exists
  if (courseExists(courseId)) {
    try {
      const postsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts");

      // Add new post with a generated id.
      postsRef.add(postData);
      return true;
    } catch (error) {
      console.log("Error, could not add post :O");
    }
  }
};

/**
 * @desc Update post
 * @return true if add is successful
 * @param postId  Post Id
 * @param postData Post object data
 */

// TODO: Edit Post
export const updatePost = async (postId: string, postData: PostData) => {};

/**
 * @desc Delete post
 * @return true if add is successful
 * @param postId  Post Id
 */
// TODO: Delete Post
export const deletePost = async (postId: string) => {};

/**
 * @desc Get post
 * @return Post
 * @param postId  Post Id
 */

// TODO: Get Post
export const getPost = async (postId: string) => {};
