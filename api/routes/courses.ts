import  { db } from '../config/firebase';
import { Router, Request, Response } from 'express';

export interface CourseData {
    id: string;
    name: string;
    description: string;
    educator: string;
  }

const router = Router();
const courses = db.collection('courses'); 

router.get('/getCourses', async (req: Request, res:Response) => {
    console.log("running route");
    console.log(req.query['courseIds']);
    const courseIds: string[] = req.query.courseIds as unknown as string[];
    console.log(courseIds);
    if (courseIds.length > 0) {
        const courseRef =  courses.where("id", "in", courseIds);
      try {
        console.log("running get");
        const courses = await courseRef.get();
        if (!courses.empty) {
            let ret: CourseData[] = []
            courses.docs.map(doc => ret.push(doc.data() as unknown as CourseData));
            console.log(courses.docs[0].data());
            res.json({
                courses: ret
            });
        } else {
            return [];
        }
        } catch (error) {
            console.log(error);
            console.log("error getting document in getUserData");
        }
    } else {
        return [];
    }
});

module.exports = router;