import {
  auth,
  IUser,
  db,
  UserCredential,
  AuthError,
  FieldValue,
} from "config/firebase";
import { UserContext, UserData } from "utils/auth";
import { courseExists } from "./posts";

export interface CourseData {
  id: string;
  name: string;
  description: string;
  educator: string;
}

/**
 * @desc Get user data
 * @return
 * @param {*}
 */

//TODO: move out of courses
export const getUserData = async (uid: string) => {
  const userRef = db.collection("users").doc(uid);
  try {
    const doc = await userRef.get();
    if (doc.exists) {
      return doc.data() as UserData;
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.log("error getting document in getUserData");
  }
};

export const getCourses = async (courseIds: string[]) => {
  if (courseIds?.length > 0) {
    const courseRef = db.collection("courses").where("id", "in", courseIds);
    try {
      const courses = await courseRef.get();
      if (!courses.empty) {
        return courses.docs;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error getting document in getUserData");
    }
  } else {
    return [];
  }
};

export const addCourseToCourses = async (courseData: CourseData) => {
  // First check if course exits
  try {
    const courseRef = db.collection("courses").doc(courseData.id);
    const course = await courseRef.get();
    // It doesn't exit, so add it!
    if (!course.exists) {
      courseRef.set({
        ...courseData,
      });
      return true;
    } else {
      console.log("Course Exists. Please use another id.");
    }
  } catch {
    console.log("Error adding course id to user");
  }
};

export const addCourseForUser = async (newCourse: string, uid: string) => {
  // add to user
  const userRef = db.collection("users").doc(uid);
  try {
    const user = await userRef.get();
    console.log(user.exists);
    if (user.exists) {
      userRef.update({
        courses: FieldValue.arrayUnion(newCourse),
      });
      return true;
      console.log("updated");
    }
    return true;
  } catch {
    console.log("error updating courses");
  }
};

export const addCourseAdmin = async (courseData: CourseData, uid: string) => {
  try {
    const addedToCourses = await addCourseToCourses(courseData);
    if (addedToCourses) {
      try {
        const addedToUser = await addCourseForUser(courseData.id, uid);
        return addedToUser;
      } catch {
        console.log("Error adding to user");
      }
    }
  } catch {
    console.log("Error adding to courses");
  }
};

export const addCourseStudent = async (courseId: string, uid: string) => {
  const courseRef = db.collection("courses").doc(courseId);
  try {
    const course = await courseRef.get();
    if (course.exists) {
      try {
        const addedToUser = await addCourseForUser(courseId, uid);
        return addedToUser;
      } catch {
        console.log("Error adding to user");
      }
    } else {
      console.log("Course don't exist");
    }
  } catch {
    console.log("Error checking if course exists");
  }
};

export const getCourse = async (courseId: string) => {
  const courseRef = db.collection("courses").doc(courseId);
  try {
    const course = await courseRef.get();
    if (course.exists) {
      return course.data();
    } else {
      console.log("Course does not exist.");
    }
  } catch (error) {
    console.log("Something went wrong, couldn't retrieve course :/");
  }
};
