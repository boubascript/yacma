import { db, FieldPath } from "../config/firebase";
import { Router, Request, Response } from "express";
import * as courseUtils from "../utils/courses";
import CourseData from "../types/courseData";

const router = Router();
const courses = db.collection("courses");

router.get("/getCourses", async (req: Request, res: Response) => {
  let courseIds = req.query.courseIds as string[];
  console.log("courseIds: ");
  console.log(courseIds);

  // TODO: find a workaround
  if (courseIds?.length > 0) {
    if (courseIds?.length > 10) {
      courseIds = courseIds.slice(1, 10);
    }
    
    try {
      // @ts-ignore
      const query = courses.where(FieldPath.documentId(), "in", courseIds);
      
      const coursesRes = await query.get();
      let ret: CourseData[] = [];
      if (!coursesRes.empty) {
        coursesRes.docs.map((doc) =>
          ret.push((doc.data() as unknown) as CourseData)
        );
      }
      res.json({ courses: ret });
    } catch (error) {
      console.log(error);
      console.log("error getting document in getCourses");
    }
  } else {
    console.log("No course codes...");
    return;
  }
});

router.get("/getCourse", async (req: Request, res: Response) => {
  const courseId = (req.query.courseId as unknown) as string;
  if (courseId) {
    try {
      const course = await courses.doc(courseId).get();
      if (course.exists) {
        console.log(course.data());
        res.send(course.data());
      }
    } catch {
      console.log("Course donut exist.");
      res.send([]);
    }
  }
});

router.post("/addCourseAdmin", async (req: Request, res: Response) => {
  const courseData: CourseData = req.body.data.courseData;
  const uid: string = req.body.data.uid as string;
  try {
    const newId = await courseUtils.addCourseToCourses(courseData);
    if (newId != "") {
      try {
        const addedToUser = await courseUtils.addCourseForUser(newId!, uid);
        return res.send(newId);
      } catch {
        console.log("Error adding to user");
      }
    }
  } catch {
    console.log("Error adding to courses");
  }
});

router.post("/addCourseStudent", async (req: Request, res: Response) => {
  const courseCode = req.body.data.courseCode as string;
  const uid: string = req.body.data.uid as string;

  try {
    const courseId = await courseUtils.getIdByCourseCode(courseCode);
    if (courseId) {
      console.log("pushing id " + courseId + "for user");
      const addedToUser = await courseUtils.addCourseForUser(courseId!, uid);
      console.log(addedToUser);
      if (addedToUser) {
        res.send(courseId);
      } else {
        res.send("");
      }
    } else {
      console.log("couldn't get doc id");
    }
  } catch (e) {
    console.log(e);
    console.log("Error adding to user");
  }
});

router.post("/unenroll", async (req: Request, res: Response) => {
  const courseId = req.body.data.courseId as string;
  const uid: string = req.body.data.uid as string;
  const removedCourse = await courseUtils.removeCourseForUser(courseId, uid);
  if (removedCourse) {
    console.log("should be sending 204");
    return res.status(204).json();
  } else {
    return res.status(400);
  }
});

export default router;
