import { db, FieldValue } from "../config/firebase";
import { Router, Request, Response } from "express";
const router = Router();

export interface CommentData {
  author: string;
  comment: string;
  id?: string;
  uid: string; // TODO: Add user ID field
  createdAt: FirebaseFirestore.Timestamp;
}

/**
 * @desc Get all comments
 * @return Array of all comments
 * @cost One DB call
 */
// Get Comments
router.get(
  "/:courseId/posts/:postId/comments",
  async (req: Request, res: Response) => {
    try {
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
        return res.status(200).json({ ...comment.data(), id: commentId });
      }
    } catch (e) {
      console.log("Could not add comment.");
    }
  }
);

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
      const d = await commentRef.add({ ...commentBody, createdAt: timestamp });
      console.log("WHATS HAPPENING? ", d);
      return res.json({ mesage: "Added :)" });
    } catch (e) {
      console.log("There's an error afoot...", e);
      return res.json({ message: e });
    }
  }
);

// Update Comment
// Two calls to check if user owns post
router.put(
  "/:courseId/posts/:postId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const { courseId, postId, commentId, uid } = req.body.params;
      const { commentBody } = req.body.data;
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      const getComment = await commentRef.get();
      if (uid === getComment.data()?.uid) {
        await commentRef.update(commentBody);
        return res.send("Updated :)");
      } else {
        return res.send(
          "Nice Try. Can't update other peeps comments *shakes head*"
        );
      }
    } catch (e) {
      console.log("There's an error afoot...", e);
    }
  }
);

// Delete Comment
// Two calls to check if user owns post
router.delete(
  "/:courseId/posts/:postId/comments/:commentId",
  async (req: Request, res: Response) => {
    try {
      const { courseId, postId, commentId, uid } = req.params;
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      const getComment = await commentRef.get();
      if (uid === getComment.data()?.uid) {
        await commentRef.delete();
        return res.send("Deleted :(");
      } else {
        return res.send(
          "Nice Try. Can't delete other peeps comments *shakes head*"
        );
      }
    } catch (e) {
      console.log("There's an error afoot...", e);
    }
  }
);

export default router;
