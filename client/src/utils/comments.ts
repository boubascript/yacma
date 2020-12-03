import { db } from "../config/firebase";

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
 * @desc Get all comments
 * @return Array of all posts
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @cost One DB call
 */
export const getComments = async (courseId: string, postId: string) => {
  try {
    const commentsRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId)
      .collection("comments");

    const commentsSnap = await commentsRef.get();
    if (commentsSnap.size > 0) {
      // Check if comments collection exists
      let commentData: Array<Object> = [];
      commentsSnap.forEach((doc) => {
        const data = { data: doc.data(), id: doc.id };
        commentData.push(data);
      });
      return commentData;
    } else {
      console.log("There are no comments for this post");
    }
  } catch (e) {
    console.log("Error, could not get comment");
  }
};

/**
 * @desc Get post
 * @return Post
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentId Comment id which comments belong to
 * @cost One DB call
 */
export const getComment = async (
  courseId: string,
  postId: string,
  commentId: string
) => {
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
};

/**
 * @desc Add Post to Course
 * @return true if add is successful
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentData Comment object data
 * @cost One DB call
 */
// TODO: Reduce calls from three -> one
export const addComment = async (
  courseId: string,
  postId: string,
  commentData: CommentData
) => {
  try {
    const commentsRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId)
      .collection("comments");

    await commentsRef.add(commentData);
    return true;
  } catch (e) {
    console.log("Error, could not add comment :O");
  }
};

/**
 * @desc Update comment
 * @return true if update is successful
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentId Comment id which comments belong to
 * @param commentData Comment object data
 * @cost One DB call
 */
export const updateComment = async (
  courseId: string,
  postId: string,
  commentId: string,
  commentData: CommentData
) => {
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
};

/**
 * @desc Delete comment
 * @return true if delete is successful
 * @param courseId Course id which posts belong to
 * @param postId Post id which comments belong to
 * @param commentId Comment id which comments belong to
 * @cost One DB call
 */
export const deleteComment = async (
  courseId: string,
  postId: string,
  commentId: string
) => {
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
};
