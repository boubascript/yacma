import axios from "axios";
import { CommentData, PostData } from "./types";

export const getHomeMessage = async () => {
  try {
    const res = await axios.get(`/api`);
    return res.data;
  } catch (e) {
    console.log("Couldn't get message. Check the server.");
  }
};

export const getCourses = async (courseIds: string[]) => {
  try {
    const { data } = await axios.get("api/courses/getCourses", {
      params: { courseIds: courseIds },
    });
    return data;
  } catch (e) {
    console.log(`Couldn't get courses :(`);
    return [];
  }
};

export const getCourse = async (courseId: string) => {
  try {
    const { data } = await axios.get("api/courses/getCourse", {
      params: {
        courseId: courseId,
      },
    });
    return data;
  } catch (e) {
    console.log(`Couldn't get course :(`);
    return [];
  }
};

export const addCourseStudent = async (courseCode: string, uid: string) => {
  try {
    const { data } = await axios.post("api/courses/addCourseStudent", {
      data: {
        courseCode: courseCode,
        uid: uid,
      },
    });
    return data;
  } catch (e) {
    console.log(`Already enrolled in course ${courseCode} :(`);
  }
};

export const unenroll = async (courseId: string, uid: string) => {
  try {
    const { status } = await axios.post("api/courses/unenroll", {
      data: {
        courseId: courseId,
        uid: uid,
      },
    });
    return status === 204;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getPosts = async (courseId: string) => {
  try {
    const { data } = await axios.get("/api/posts/getPosts", {
      params: {
        courseId: courseId,
      },
    });
    return data;
  } catch (e) {
    console.log(`Couldn't get posts :(`);
    return [];
  }
};

export const addPost = async (courseId: string, formData: FormData) => {
  try {
    await axios.post("/api/posts/addPost", formData);
    return true;
  } catch (e) {
    console.log(`Can't add post :(`);
    return false;
  }
};

export const updatePost = async (
  courseId: string,
  postId: string,
  uid: string,
  postBody: PostData
) => {
  try {
    console.log(`Update post`, postBody);
    await axios.put("/api/posts/updatePost", {
      params: {
        courseId: courseId,
        postId: postId,
        uid: uid,
      },
      data: {
        postBody,
      },
    });
    return true;
  } catch (e) {
    console.log(`Can't update post :(`);
    return false;
  }
};

export const getComments = async (courseId: string, postId: string) => {
  try {
    const { data } = await axios.get("/api/comments/getComments", {
      params: {
        courseId: courseId,
        postId: postId,
      },
    });
    return data;
  } catch (e) {
    console.log(`Can't get comments :(`);
    return [];
  }
};

export const addComment = async (
  courseId: string,
  postId: string,
  uid: string,
  commentBody: CommentData
) => {
  try {
    await axios.post("/api/comments/addComment", {
      params: {
        courseId: courseId,
        postId: postId,
        uid: uid,
      },
      data: {
        commentBody,
      },
    });
    return true;
  } catch (e) {
    console.log(`Can't update comment :(`);
    return false;
  }
};

export const updateComment = async (
  courseId: string,
  postId: string,
  commentId: string,
  uid: string,
  commentBody: CommentData
) => {
  try {
    await axios.put("/api/comments/updateComment", {
      params: {
        courseId: courseId,
        postId: postId,
        commentId: commentId,
        uid: uid,
      },
      data: {
        commentBody,
      },
    });

    console.log(` Update comment :(`);
    return true;
  } catch (e) {
    console.log(`Can't update comment :(`);
    return false;
  }
};

export const deleteComment = async (
  courseId: string,
  postId: string,
  commentId: string,
  uid: string
) => {
  try {
    await axios.delete("/api/comments/deleteComment", {
      params: {
        courseId: courseId,
        postId: postId,
        commentId: commentId,
        uid: uid,
      },
    });
    return true;
  } catch (e) {
    console.log(`Can't delete comment :(`);
    return false;
  }
};
