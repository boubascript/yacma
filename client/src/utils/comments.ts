import { db } from "../config/firebase";
import { courseExists } from "./posts";

export interface CommentData {
  author: string;
  comment: string;
}

export interface CommentDataId {
  data: {
    author: string;
    comment: string;
  };
  id: string;
}
/**
 * @desc Determines if course exists
 * @return true if course exists
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * Cost = One call to DB
 */
export const postExists = async (courseId: string, postId: string) => {
  try {
    const postRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) {
      console.log("Post does not exist :/");
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log("Something went wrong, can't find the post :/");
  }
};

/**
 * @desc Get all comments
 * @return Array of all posts
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * Cost = Three calls to DB
 */
export const getComments = async (courseId: string, postId: string) => {
  // Check if course and post exists
  if (courseExists(courseId) && postExists(courseId, postId)) {
    try {
      const commentsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments");
      const commentsSnap = await commentsRef.get();

      // Check if comments collection exists
      if (commentsSnap.size > 0) {
        let commentData: Array<Object> = [];
        commentsSnap.forEach((doc) => {
          const data = { data: doc.data(), id: doc.id };
          commentData.push(data);
        });

        return commentData;
      } else {
        console.log("No comment for this course");
      }
    } catch (e) {
      console.log("Error, could not get Comment Data");
    }
  } else {
    console.log("Course does not exist...");
  }
};

/**
 * @desc Get post
 * @return Post
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentId Comment id which comments belong to
 * Cost = Three calls to DB
 */
export const getComment = async (
  courseId: string,
  postId: string,
  commentId: string
) => {
  // Check if course and post exists
  if (courseExists(courseId) && postExists(courseId, postId)) {
    try {
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      const comment = await commentRef.get();

      if (!comment.exists) {
        console.log("No such comment exists. *raises eyebrow*");
      } else {
        return comment.data();
      }
    } catch (e) {
      console.log("Could not add comment");
    }
  } else {
    console.log("Comment does not exist...");
  }
};

/**
 * @desc Add Post to Course
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentData Comment object data
 * Cost = Two calls to DB
 */
// TODO: Reduce calls from three -> one
export const addComment = async (
  courseId: string,
  postId: string,
  commentData: CommentData
) => {
  // Check if course and post exists
  if (courseExists(courseId) && postExists(courseId, postId)) {
    try {
      const commentsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments");

      // Add new post with a generated id.
      await commentsRef.add(commentData);
      return true;
    } catch (e) {
      console.log("Error, could not add comment :O");
    }
  } else {
    console.log("Course does not exist...");
  }
};

/**
 * @desc Update comment
 * @return true if update is successful
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentId Comment id which comments belong to
 * @param commentData Comment object data
 * Cost = Three calls to DB
 */
export const updateComment = async (
  courseId: string,
  postId: string,
  commentId: string,
  commentData: CommentData
) => {
  // Check if course and post exists
  if (courseExists(courseId) && postExists(courseId, postId)) {
    try {
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      await commentRef.update(commentData);
      return true;
    } catch (e) {
      console.log("Could not edit comment.");
    }
  } else {
    console.log("Course does not exist...");
  }
};

/**
 * @desc Delete comment
 * @return true if delete is successful
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentId Comment id which comments belong to
 * Cost = Three calls to DB
 */
export const deleteComment = async (
  courseId: string,
  postId: string,
  commentId: string
) => {
  // Check if course and post exists
  if (courseExists(courseId) && postExists(courseId, postId)) {
    try {
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      await commentRef.delete();
      return true;
    } catch (e) {
      console.log("Could not edit comment.");
    }
  } else {
    console.log("Course does not exist...");
  }
};
