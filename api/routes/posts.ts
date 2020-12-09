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
  try {
    // const { userId } = req.body; TODO
    console.log(req.query.courseId);
    const courseId = req.query.courseId as string;
    const postsRef = db.collection("courses").doc(courseId).collection("posts");
    const postsSnap = await postsRef.get();

    // Check if posts collection exists
    if (postsSnap.size > 0) {
      let postData: Array<Object> = [];
      postsSnap.forEach((doc) => {
        const data = { ...doc.data(), id: doc.id };
        postData.push(data);
      });
      return res.status(200).json(postData); // return empty array if no posts
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
    const { courseId } = req.body.params;
    const { postBody } = req.body.data;
    console.log("NIRVANA", courseId, req.body.data);
    const postRef = db.collection("courses").doc(courseId).collection("posts");

    // TODO: Clean up check stuff
    await postRef.add(postBody);
    return res.status(200).json({ mesage: "Added :)" });
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

// TODO: Two calls, need to check author owns post to update
// Update Post
router.put("/:courseId/posts/:postId", async (req: Request, res: Response) => {
  try {
    const { courseId, postId } = req.body.params;
    const { postBody } = req.body.data;
    const postRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId);

    await postRef.update(postBody);
    return res.status(200).json({ mesage: "Updated :)" });
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

export default router;
