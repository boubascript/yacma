import { db, FieldValue, FieldPath } from "../config/firebase";
import { Router, Request, Response } from "express";
const router = Router();

export interface CommentData {
  author: string;
  comment: string;
  id?: string;
  uid?: string; // TODO: Add user ID field
  createdAt: FirebaseFirestore.Timestamp;
}

/**
 * @desc Get all comments
 * @return Array of all comments
 * @cost One DB call
 */
// TODO: sort return by timestamp
// Get Comments
router.get(
  "/:courseId/posts/:postId/comments",
  async (req: Request, res: Response) => {
    try {
      // const { userId } = req.body;
      const { courseId, postId } = req.params;
      const commentsRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("createdAt", "asc");

      const commentsSnap = await commentsRef.get();
      if (commentsSnap.size > 0) {
        // Check if comments collection exists
        let commentsData: CommentData[] = [];
        commentsSnap.forEach((doc) => {
          commentsData.push({
            ...((doc.data() as unknown) as CommentData),
            id: doc.id,
          });
        });

        return res.status(200).json(commentsData);
      } else {
        console.log("There are no comments for this post");
      }
    } catch (e) {
      console.log("Could not get comments. There's an error afoot...", e);
    }
  }
);

// Get Comment
router.get(
  "/:courseId/posts/:postId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const { courseId, postId, commentId } = req.params;
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      const comment = await commentRef.get();
      if (!comment.exists) {
        console.log("No such comment exists. *raises eyebrow*");
      } else {
        return res.status(200).json(comment.data());
      }
    } catch (e) {
      console.log("Could not add comment.");
    }
  }
);

// TODO: Add timestamp field
// Add Comment
router.post(
  "/:courseId/posts/:postId/comments",
  async (req: Request, res: Response) => {
    try {
      const { courseId, postId } = req.body.params;
      const { commentBody } = req.body.data;

      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments");

      const timestamp = FieldValue.serverTimestamp();
      console.log("I've been timestamped", timestamp, {
        ...commentBody,
        createdAt: timestamp,
      });

      await commentRef.add({ ...commentBody, createdAt: timestamp });
      return res.json({ mesage: "Added :)" });
    } catch (e) {
      console.log("There's an error afoot...", e);
    }
  }
);

// Update Comment
// TODO: Add check to ensure only author can edit their post
router.put(
  "/:courseId/posts/:postId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const { courseId, postId, commentId } = req.body.params;
      const { commentBody } = req.body.data;
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      await commentRef.update(commentBody);
      return res.json({ mesage: "Updated :)" });
    } catch (e) {
      console.log("There's an error afoot...", e);
    }
  }
);

// Delete Comment
// TODO: Add check to ensure only author can edit their post
router.delete(
  "/:courseId/posts/:postId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const { courseId, postId, commentId } = req.params;
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      await commentRef.delete();
      return res.json({ mesage: "Deleted :(" });
    } catch (e) {
      console.log("There's an error afoot...", e);
    }
  }
);

export default router;
