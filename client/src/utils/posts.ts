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

/* May not need... */
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

// TODO: Reduce calls from three -> one
export const addPostToPosts = async (
  uid: string,
  courseId: string,
  postData: PostData
) => {
  // Check if course exists
  if (courseExists(courseId)) {
    try {
      const postsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts");

      console.log("got postsref");
      // Add a new document with a generated id.
      const res = await postsRef.add(postData);
      console.log("got res");

      // Sanity Check
      // console.log('Added document with ID: ', res.id);
    } catch (error) {
      console.log("Error, could not add post :O");
    }
  }
};
