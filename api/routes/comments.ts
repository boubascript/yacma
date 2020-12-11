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

/* Comment Collection Path Parameter Interface */
interface CommentPathParams {
  courseId: string;
  postId: string;
  commentId?: string;
  uid?: string;
}

/**
 * @desc Get all comments
 * @return Array of all comments
 * @cost One DB call
 */
router.get("/getComments", async (req: Request, res: Response) => {
  try {
    const { courseId, postId } = (req.query as unknown) as CommentPathParams;

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
});

/**
 * @desc Get a comment
 * @return CommentData object
 * @cost One DB call
 */
router.get("/getComment", async (req: Request, res: Response) => {
  try {
    const {
      courseId,
      postId,
      commentId,
    } = (req.query as unknown) as CommentPathParams;
    if (commentId) {
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
        return res.status(200).json({ ...comment.data(), id: comment.id });
      }
    }
  } catch (e) {
    console.log("Could not add comment.");
  }
});

/**
 * @desc Add Comment
 * @cost One DB call
 */
router.post("/addComment", async (req: Request, res: Response) => {
  try {
    const { courseId, postId, uid } = req.body.params;
    const { commentBody } = req.body.data;

    const commentRef = db
      .collection("courses")
      .doc(courseId)
      .collection("posts")
      .doc(postId)
      .collection("comments");

    await commentRef.add({
      ...commentBody,
      createdAt: FieldValue.serverTimestamp(),
      uid: uid,
    });
    return res.json({ mesage: "Added :)" });
  } catch (e) {
    console.log("There's an error afoot...", e);
    return res.json({ message: e });
  }
});

/**
 * @desc Update Comment
 * @cost Two DB calls
 */
router.put("/updateComment", async (req: Request, res: Response) => {
  try {
    const { courseId, postId, commentId, uid } = req.body.params;
    const { commentBody } = req.body.data;
    console.log("c REQ ", req.body.params);
    console.log("courseId", courseId);
    console.log("postId", postId);

    if (commentId) {
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      const getComment = await commentRef.get();
      if (uid === getComment.data()?.uid) {
        await commentRef.update({
          ...commentBody,
          createdAt: getComment.data()?.createdAt,
          uid: uid,
        });
        return res.status(204).send("Updated :)");
      } else {
        return res
          .status(304)
          .send("Nice Try. Can't update other peeps comments *shakes head*");
      }
    }
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

/**
 * @desc Delete Comment
 * @cost Two DB calls
 */
router.delete("/deleteComment", async (req: Request, res: Response) => {
  console.log("IMHERERER");
  try {
    const {
      courseId,
      postId,
      commentId,
      uid,
    } = (req.query as unknown) as CommentPathParams;
    if (commentId) {
      const commentRef = db
        .collection("courses")
        .doc(courseId)
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(commentId);

      console.log(
        "courseId, postId, commentId, uid",
        courseId,
        postId,
        commentId,
        uid
      );
      const getComment = await commentRef.get();
      console.log("comment's user Id", getComment.id);

      if (uid === getComment.data()?.uid) {
        await commentRef.delete();
        return res.status(204).send("Deleted :(");
      } else {
        return res
          .status(304)
          .send("Nice Try. Can't delete other peeps comments *shakes head*");
      }
    }
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

export default router;
