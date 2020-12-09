import  { db, FieldValue} from '../config/firebase';
import CourseData from '../types/courseData';

const users = db.collection('users');
const courses = db.collection('courses'); 

export const addCourseForUser = async (
    newCourse: string,
    uid: string
  ) => {
    // add to user
    const userRef = users.doc(uid);
    try {
      const user = await userRef.get();

      if (user.exists) {
        if (!user.data()!.courses.includes(newCourse)) {
           await userRef.update({
            courses: FieldValue.arrayUnion(newCourse),
          });
          return true;
        }
        else{
          console.log("already enrolled");
          return false;
        }
      }
      else {
        console.log("no such user")
      }
    } catch {
      console.log("error updating courses");
    }
  };

  export const getIdByCourseCode = async (
    courseCode: string
  ) => {
    const courseRef = courses.where("code", "==", courseCode);
    try {
      const course = await courseRef.get();
      if (!course.empty) {
        return course.docs[0].id;
      }
      return "";
    } catch (e) {
      console.log(e);
      console.log("Can't get id by course code");
    }
  }

  export const addCourseToCourses = async (courseData: CourseData) => {
    // First check if course exits
    try {
      const course = await courses.where("code", "==", courseData.code).get();

      // It doesn't exit, so add it!
      if (course.empty) {
          try {
            const {id: newId } = await courses.add({...courseData});
            courses.doc(newId).update({
                id: newId
            })
            return newId
          } catch {
            console.log("Couldn't add id to course")
          }
      } else {
        console.log("Course Exists. Please use another id.");
        return "";
      }
    } catch (e) {
        console.log(e);
        console.log("Error adding course to courses");
    }
  };
