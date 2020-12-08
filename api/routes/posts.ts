import { db } from "../config/firebase";
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
// TODO: sort return by timestamp
// Get Posts
router.get("/:courseId/posts", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { courseId } = req.params;
  try {
    const postsRef = db.collection("courses").doc(courseId).collection("posts");
    const postsSnap = await postsRef.get();

    // Check if posts collection exists
    if (postsSnap.size > 0) {
      let postData: Array<Object> = [];
      postsSnap.forEach((doc) => {
        const data = { ...doc.data(), id: doc.id };
        postData.push(data);
      });
      return postData; // return empty array if no posts
    } else {
      return [];
    }
  } catch (e) {
    console.log("Could not get posts. There's an error afoot...", e);
  }
});

// TODO: Add timestamp field
// Add Post
router.post("/:courseId/posts", async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { postData } = req.body;
    const postRef = db.collection("courses").doc(courseId).collection("posts");

    // TODO: Clean up check stuff
    await postRef.add(postData);
    return true;
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

// Get Post
router.get("/:courseId/posts/:postId", async (req: Request, res: Response) => {
  try {
    const { courseId, postId } = req.params;
    const postRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId);

    const post = await postRef.get();
    if (post.exists) {
      return { ...post.data(), id: post.id };
    } else {
      console.log("No such post exists. *raises eyebrow*");
    }
  } catch (e) {
    console.log("Could not add post.");
  }
});

// TODO: Two calls, need to check author owns post to update
// Update Post
router.put("/:courseId/posts/:postId", async (req: Request, res: Response) => {
  try {
    const { courseId, postId } = req.params;
    const { postData } = req.body;
    const postRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId);

    await postRef.update(postData);
    return true;
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

export default router;
