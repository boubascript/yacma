import { db, FieldValue } from "../config/firebase";
import { Router, Request, Response } from "express";
const router = Router();

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);

export interface PostData {
  title: string;
  description: string;
  links: string;
  author: string;
  id?: string;
  uid: string; // TODO: Add user ID field
  createdAt: FirebaseFirestore.Timestamp;
}

/* Post Collection Path Parameter Interface */
interface PostPathParams {
  courseId: string;
  postId?: string;
  uid?: string;
}

/**
 * @desc Get all posts
 * @return Array of all posts (PostData[])
 * @cost One DB call
 */
router.get("/getPosts", async (req: Request, res: Response) => {
  try {
    const { courseId } = (req.query as unknown) as PostPathParams;
    const postsRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .orderBy("createdAt", "asc");
    const postsSnap = await postsRef.get();

    // Check if posts collection exists
    if (!postsSnap.empty) {
      let postData: PostData[] = [];
      postsSnap.forEach((doc) => {
        postData.push({ ...((doc.data() as unknown) as PostData), id: doc.id });
      });
      return res.status(200).json(postData); // return empty array if no posts
    } else {
      return res.json([]);
    }
  } catch (e) {
    console.log("Could not get posts. There's an error afoot...", e);
  }
});

/**
 * @desc Update Post
 * @return PostData object
 * @cost Costly ~
 */
router.post("/addPost", async (req: Request, res: Response) => {
  try {
    const { title, author, description, courseId, uid } = req.body;
    const postRef = db.collection("courses").doc(courseId).collection("posts");
    const postBody = {
      title: title,
      author: author,
      description: description,
      links: "",
    };

    const file = (req as any).file;
    if (file) {
      let newName = file.originalname.split(".");
      newName[newName.length - 2] += "_" + Date.now();
      newName = newName.join(".");
      const blob = bucket.file(newName);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err: any) => {
        console.log("There was error");
      });

      blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        postBody["links"] = publicUrl;
        console.log("Make POST", postBody);
        await postRef.add({
          ...postBody,
          createdAt: FieldValue.serverTimestamp(),
          uid: uid,
        });
        return res.status(204).send("Added :)");
      });

      blobStream.end(file.buffer);
    } else {
      console.log("Make POST", postBody);
      await postRef.add({
        ...postBody,
        createdAt: FieldValue.serverTimestamp(),
        uid: uid,
      });
      return res.status(204).send("Added :)");
    }
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

/**
 * @desc Update Post
 * @return PostData object
 * @cost One DB calls
 */
router.get("/getPost", async (req: Request, res: Response) => {
  try {
    const { courseId, postId } = (req.query as unknown) as PostPathParams;
    if (postId) {
      const postRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId);

      const post = await postRef.get();

      if (post.exists) {
        return res.status(200).json({ ...post.data(), id: post.id });
      } else {
        console.log("No such post exists. *raises eyebrow*");
      }
    }
  } catch (e) {
    console.log("Could not add post.");
  }
});

/**
 * @desc Update Post
 * @cost Two DB calls
 */
router.put("/updatePost", async (req: Request, res: Response) => {
  try {
    const { courseId, postId, uid } = req.body.params;
    const { postBody } = req.body.data;
    console.log(`Update post`, postBody);
    console.log(`PostId`, postId);
    console.log(`CourseId`, courseId);

    if (postId) {
      const postRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId);

      const getPost = await postRef.get();

      if (uid === getPost.data()?.uid) {
        await postRef.update({
          ...postBody,
          createdAt: getPost.data()?.createdAt,
        });
        return res.status(204).send("Updated :)");
      } else {
        return res
          .status(304)
          .send("Nice Try. Can't update other peeps posts *shakes head*");
      }
    }
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

export default router;
