import { db, FieldValue } from "../config/firebase";
import { Router, Request, Response } from "express";
import axios from "axios";
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

/**
 * @desc Get all posts
 * @return Array of all posts
 * @cost One DB call
 */
// Get Posts
router.get("/:courseId/posts", async (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId as string;
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

// Add Post
router.post("/:courseId/posts", async (req: Request, res: Response) => {
  try {
    console.log(req);
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
        const timestamp = FieldValue.serverTimestamp();
        postBody["links"] = publicUrl;
        console.log("Make POST", postBody);
        await postRef.add({ ...postBody, createdAt: timestamp, uid: uid });
        return res.status(204).send("Added :)");
      });

      blobStream.end(file.buffer);
    } else {
      console.log("Make POST", postBody);
      const timestamp = FieldValue.serverTimestamp();
      await postRef.add({ ...postBody, createdAt: timestamp, uid: uid });
      return res.status(204).send("Added :)");
    }
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

// Get Post
router.get("/:courseId/posts/:postId", async (req: Request, res: Response) => {
  try {
    const { courseId, postId } = req.body.params;
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
  } catch (e) {
    console.log("Could not add post.");
  }
});

// Update Post
// Two calls to check if user owns post
router.put("/:courseId/posts/:postId", async (req: Request, res: Response) => {
  try {
    const { courseId, postId, uid } = req.body.params;
    const { postBody } = req.body.data;
    const postRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId);

    const getPost = await postRef.get();
    if (uid === getPost.data()?.uid) {
      await postRef.update(postBody);
      return res.status(204).send("Updated :)");
    } else {
      return res
        .status(304)
        .send("Nice Try. Can't update other peeps posts *shakes head*");
    }
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

export default router;
