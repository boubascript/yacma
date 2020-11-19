import { auth, IUser, db, UserCredential, AuthError } from "config/firebase";
import "firebase/firestore";
import { UserContext, UserData } from "utils/auth";


export interface CourseData {
    id: string;
    name: string;
    description: string;
    educator: string;
}

interface getDataResult {
    data?: UserData | CourseData[] | CourseData;
    error?: any; //add type
}

/**
 * @desc Get user data
 * @return
 * @param {*} 
 */
export const getUserData = async (uid: string): Promise<getDataResult> => {
    console.log(uid);
    return db.collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      return {data: doc.data() as UserData};
    }).catch((err) => {
        return err;
    });
}

export const getCourses = async (firstName: string, lastName: string): Promise<getDataResult> => {
    let docs: CourseData[] = [];
      return db.collection("courses")
        .where("educator", "==", firstName + " " + lastName)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.docs.map(function (doc) {
            docs.push(doc.data() as CourseData);
          });
          return {data: docs};
        })
        .catch(function (error) {
          console.log("Error getting courses: ", error);
          return {error}
        });
    };

    export const getCourseData = async (id: string): Promise<getDataResult> => {
        return db.collection("courses")
        .doc(id)
        .get()
        .then((querySnapshot) => {
          return {data: querySnapshot.data()! as UserData};
        }).catch((err) => {
            return err;
        });
    }

    // TODO: add stronger typing
    export const addCourseToUser = async (courseData: CourseData, uid: string) => {
       // add to user
       const userRef = db.collection("users").doc(uid);
       return userRef
       .get()
       .then((docSnapshot) => {
           // courses exist so push to array
         if (docSnapshot.data()!.courses) {
           userRef
             .update({
               courses: [...docSnapshot.data()!.courses, courseData.id],
             })
             .catch((err) => {
               console.log("Error adding course id to user", err);
             });
         } 
         // otherwise create course id array with first element
         else {
           userRef
             .update({
               courses: [courseData.id],
             })
             .catch((err) => {
               console.log("Error adding course id to user", err);
             });
         }
       });
    }

// TODO add type
export const addCourse = async (courseData: CourseData, uid: string) => {
    const courseRef = db.collection("courses").doc(courseData.id);

    // check that course id is not taken
    const { data } = await getCourseData(courseData.id);
    console.log("data: ");
    console.log(data);
    
    // it does not exist 
    if (!data) {
        // add to courses
        courseRef.onSnapshot(() => {
            courseRef.set({ ...courseData });
        });
        addCourseToUser(courseData, uid);
        console.log("SUCCESS! Course Added.");
        return true;
    }
    // it exists 
    console.log("Pls, use another id");
    return false;
}
