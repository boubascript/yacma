import { auth, IUser, db, UserCredential, AuthError } from "config/firebase";
import "firebase/firestore";
import { UserContext, UserData } from "utils/auth";

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
  if (courseIds.length > 0) {
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
    if (course) {
      courseRef.set({
        ...courseData,
      });
      return true;
    } else {
      console.log("Please use another id.");
    }
  } catch {
    console.log("Error adding course id to user");
  }
};

export const updateCoursesForUser = async (
  newCourses: string[],
  uid: string
) => {
  // add to user
  const userRef = db.collection("users").doc(uid);

  try {
    const user = await userRef.get();
    console.log(user.exists);
    if (user.exists) {
      userRef.update({
        courses: newCourses,
      });
      console.log("updated");
    }
    return true;
  } catch {
    console.log("error updating courses");
  }
};

export const addCourse = async (
  courseData: CourseData,
  courses: string[],
  uid: string
) => {
  try {
    const addToCourse = await addCourseToCourses(courseData);
    const addToUser = await updateCoursesForUser(courses, uid);
    return addToCourse && addToUser;
  } catch {
    console.log("error in addCourse");
  }
};
