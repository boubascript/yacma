import  { db, FieldValue, FieldPath } from '../config/firebase';
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
    let courseIds: string[] = req.query.courseIds as unknown as string[];

    // to do: find a workaround
    if (courseIds.length > 0) {
        if (courseIds.length > 10) {
          courseIds = courseIds.slice(1, 10);
        }
        //@ts-ignore
        const query = courses.where(FieldPath.documentId(), 'in', courseIds)
    
      try {
        const courses = await query.get();
        let ret: CourseData[] = []
        console.log("courses: ");
        console.log(courses);
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
  const courseId = req.query.courseId as unknown as string;
  if (courseId != "") {
    const courseRef = courses.doc(courseId);
    try {
      const course = await courseRef.get();
      if (course.exists){
        res.send(course.data);
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
          userRef.update({
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

router.post('/addCourseAdmin', async (req: Request, res:Response) => {
    const courseData: CourseData = req.body.data.courseData;
    console.log("coursedata: ");
    console.log(courseData);
    const uid: string = req.body.data.uid as string;
    try {
        const newId = await addCourseToCourses(courseData);
        if (newId != "") {
          try {
            const addedToUser = await addCourseForUser(newId!, uid);
            return res.send(newId);
          } catch {
            console.log("Error adding to user");
          }
        }
      }
      catch {
        console.log("Error adding to courses");
      }
});

router.post('/addCourseStudent', async (req: Request, res:Response) => {
  console.log(req.body);  
  const courseCode = req.body.data.courseCode as string;
  const uid: string = req.body.data.uid as string;
  console.log(courseCode);
  console.log(uid);
    try {
        const courseId = await getIdByCourseCode(courseCode);
        if (courseId && courseId != "") {
          console.log("pushing id " + courseId + "for user");
          const addedToUser = await addCourseForUser(courseId!, uid);
          console.log(addedToUser)
          if (addedToUser) {
            res.send(courseId);
          }
          else {
            res.send("");
          }
        }
        else {
          console.log("couldn't get doc id");
        }
    } catch (e) {
        console.log(e);
        console.log("Error adding to user");
    }
});


module.exports = router;