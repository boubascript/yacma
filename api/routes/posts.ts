import { db, FieldValue } from "../config/firebase";
import { Router, Request, Response } from "express";
const router = Router();

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
    if (postsSnap.size > 0) {
      let postData: PostData[] = [];
      postsSnap.forEach((doc) => {
        postData.push({ ...((doc.data() as unknown) as PostData), id: doc.id });
      });
      return res.status(200).send(postData); // return empty array if no posts
    } else {
      return [];
    }
  } catch (e) {
    console.log("Could not get posts. There's an error afoot...", e);
  }
});

// Add Post
router.post("/:courseId/posts", async (req: Request, res: Response) => {
  try {
    const { courseId, uid } = req.body.params;
    const { postBody } = req.body.data;
    const postRef = db.collection("courses").doc(courseId).collection("posts");

    const timestamp = FieldValue.serverTimestamp();
    console.log("GET POST", postBody);
    await postRef.add({ ...postBody, createdAt: timestamp, uid: uid });
    return res.status(204).send("Added :)");
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
