import { db, FieldPath } from "../config/firebase";
import e, { Router, Request, Response } from "express";
import CourseData from "../types/courseData";
import {
  addCourseToCourses,
  addCourseForUser,
  getIdByCourseCode,
  removeCourseForUser,
} from "../utils/courses";
import redisClient from "../config/redis";

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
      const cachedCourses: any = await new Promise((resolve, reject) => {
        const cacheCalls = redisClient.batch();
        courseIds.map((cid) => cacheCalls.hgetall(`courses/${cid}`));

        cacheCalls.exec((err, results) => {
          resolve(results.filter((c: any) => c !== null));
        });
      });

      if (cachedCourses.length === courseIds.length) {
        console.log("Courses from cache");
        return res.json(cachedCourses);
      }

      console.log("Courses from db");
      // @ts-ignore
      const query = courses.where(FieldPath.documentId(), "in", courseIds);

      const coursesRes = await query.get();
      const coursesData: CourseData[] = coursesRes.empty
        ? []
        : coursesRes.docs.map((doc) => doc.data() as CourseData);

      res.json(coursesData);
    } catch (error) {
      console.log(error);
      console.log("error getting document in getCourses");
    }
  } else {
    console.log("No course codes...");
    return res.json([]);
  }
});

router.get("/getCourse", async (req: Request, res: Response) => {
  const courseId = (req.query.courseId as unknown) as string;
  if (courseId) {
    try {
      const cachedCourse = await redisClient.hgetall(`courses/${courseId}`);
      if (cachedCourse) {
        console.log("Course from cache");
        return res.json(cachedCourse);
      } else {
        console.log("Course from db");
        const course = await courses.doc(courseId).get();
        if (course.exists) {
          const courseData = course.data();
          await redisClient.hset(
            `courses/${courseId}`,
            Object.entries(courseData!).flatMap((e) => e)
          );
          return res.send(courseData);
        }
      }
    } catch (err) {
      console.log(err);
      console.log("Course donut exist.");
      res.send({});
    }
  }
});

router.post("/addCourseAdmin", async (req: Request, res: Response) => {
  const courseData: CourseData = req.body.data.courseData;
  const uid: string = req.body.data.uid as string;
  try {
    const newId = await addCourseToCourses(courseData);
    if (newId) {
      try {
        await addCourseForUser(newId!, uid);
        await redisClient.hset(
          `courses/${newId}`,
          Object.entries({ ...courseData, id: newId }).flatMap((e) => e)
        );
        console.log(`courses/${newId}`);
        res.send(newId);
      } catch (err) {
        console.log(err);
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
    const courseId = await getIdByCourseCode(courseCode);
    if (courseId) {
      console.log("pushing id " + courseId + "for user");
      const addedToUser = await addCourseForUser(courseId!, uid);
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
  const removedCourse = await removeCourseForUser(courseId, uid);
  if (removedCourse) {
    console.log("should be sending 204");
    return res.status(204).json();
  } else {
    return res.status(400);
  }
});

export default router;
