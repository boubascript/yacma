import  { db, FieldValue } from '../config/firebase';
import { Router, Request, Response } from 'express';

export interface CourseData {
    code: string;
    name: string;
    description: string;
    educator: string;
  }

const router = Router();
const courses = db.collection('courses'); 
const users = db.collection('users');

router.get('/getCourses', async (req: Request, res:Response) => {
    const courseCodes: string[] = req.query.courseCodes as unknown as string[];

    if (courseCodes.length > 0) {
        const courseRef = courses.where("code", "in", courseCodes);
      try {
        const courses = await courseRef.get();
        let ret: CourseData[] = []
        if (!courses.empty) {
            courses.docs.map(doc => ret.push(doc.data() as unknown as CourseData));
           } 
        res.json({ courses: ret });
        } catch (error) {
            console.log(error);
            console.log("error getting document in getUserData");
        }
    } else {
        console.log("No course codes...");
        return;
    }
});

router.get('/getCourse', async (req: Request, res:Response) => {
  const courseId = req.query.courseCode as unknown as string;
  if (courseId != "") {
    const courseRef = courses.where("id", "==", courseId);
    try {
      const course = await courseRef.get();
      if (!course.empty){
        console.log(course);
      }
    } catch { }
  }
});

export const addCourseToCourses = async (courseData: CourseData) => {
    // First check if course exits
    try {
      const courseRef = courses.where("code", "==", courseData.code);
      const course = await courseRef.get();

      // It doesn't exit, so add it!
      if (course.empty) {
          try {
            const {id: newId } = await courses.add({...courseData});
            courses.doc(newId).set({
              id: newId
            })
          } catch {
            console.log("Couldn't add id to course")
          }
        return true;
      } else {
        console.log("Course Exists. Please use another id.");
      }
    } catch (e) {
        console.log(e);
        console.log("Error adding course to courses");
    }
  };

export const addCourseForUser = async (
    newCourse: string,
    uid: string
  ) => {
    // add to user
    const userRef = users.doc(uid);
    try {
      const user = await userRef.get();

      if (user.exists) {
        userRef.update({
          courses: FieldValue.arrayUnion(newCourse),
        });
        return true;
      }
      return true;
    } catch {
      console.log("error updating courses");
    }
};

router.get('/addCourseAdmin', async (req: Request, res:Response) => {
    const courseData: CourseData = JSON.parse(req.query['courseData'] as string) as unknown as CourseData;
    const uid: string = req.query['uid'] as string;
    try {
        const addedToCourses = await addCourseToCourses(courseData);
        if (addedToCourses) {
          try {
            const addedToUser = await addCourseForUser(courseData.code, uid);
            return res.send(addedToUser);
          } catch {
            console.log("Error adding to user");
          }
        }
      }
      catch {
        console.log("Error adding to courses");
      }
});

router.get('/addCourseStudent', async (req: Request, res:Response) => {
    const courseCode = req.query['courseCode'] as string;
    const uid: string = req.query['uid'] as string;

    try {
        const addedToUser = await addCourseForUser(courseCode, uid);
        return res.send(addedToUser);
    } catch (e) {
        console.log(e);
        console.log("Error adding to user");
    }
});


module.exports = router;