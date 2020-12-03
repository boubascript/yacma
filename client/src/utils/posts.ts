import { db } from "config/firebase";

export interface PostData {
  title: string;
  author: string;
  description: string;
  links: string;
}

export interface PostDataId {
  data: {
    title: string;
    author: string;
    description: string;
    links: string;
  };
  id: string;
}

/**
 * @desc Get all posts
 * @return Array of all posts
 * @param uid Current user id
 * @param courseId course id which posts belong to
 * @cost One DB call
 */
export const getPosts = async (courseId: string) => {
  try {
    const postsRef = db.collection("courses").doc(courseId).collection("posts");

    const postsSnap = await postsRef.get();
    if (postsSnap.size > 0) {
      // Check if posts collection exists
      let postData: Array<Object> = [];
      postsSnap.forEach((doc) => {
        const data = { data: doc.data(), id: doc.id };
        postData.push(data);
      });
      return postData;
    } else {
      console.log("There are no posts for this course");
    }
  } catch (e) {
    console.log("Error, could not get posts data");
  }
};

/**
 * @desc Get post
 * @return Post
 * @param courseId Course id which posts belong to
 * @param postId  Post Id
 * @cost One DB call
 */
export const getPost = async (courseId: string, postId: string) => {
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
    console.log("Could not add post.");
  }
};

/**
 * @desc Add Post to Course
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postData Post object data
 * @cost One DB call
 */
export const addPost = async (courseId: string, postData: PostData) => {
  try {
    const postsRef = db.collection("courses").doc(courseId).collection("posts");

    await postsRef.add(postData);
    return true;
  } catch (e) {
    console.log("Error, could not add post :O");
  }
};

/**
 * @desc Update post
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postId  Post Id
 * @param postData Post object data
 * @cost One DB call
 */
export const updatePost = async (
  courseId: string,
  postId: string,
  postData: PostData
) => {
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
};

// TODO: Delete Post => Cloud Function to delete associated comments
