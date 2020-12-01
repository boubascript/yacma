import {
  auth,
  IUser,
  db,
  UserCredential,
  AuthError,
  FieldValue,
} from "config/firebase";
import { UserContext, UserData } from "utils/auth";
// some course context import { CourseContext, CourseData } from "utils/courses";

export interface PostData {
  title: string;
  author: string;
  description: string;
  links: string;
}

/**
 * @desc Get post data
 * @return
 * @param uid user id
 * @param courseId course id which posts belong to
 */

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

export const getPosts = async (uid: string, courseId: string) => {
  if (courseExists(courseId)) {
    try {
      const postsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts");
      const postsSnap = await postsRef.get();

      if (postsSnap.size > 0) {
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

export const addPostToPosts = async (postData: PostData) => {
  //TODO
};
