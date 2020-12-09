import React, { useState, useEffect } from "react";
import { PostData } from "utils/posts";
import { getComments, CommentData } from "utils/comments";
import { Button, Container } from "@material-ui/core";
import Comment from "pages/Comment";
import NewComment from "pages/NewComment";

interface PostProps {
  courseId: string;
  post: PostData;
}
const Post: React.FunctionComponent<PostProps> = ({ courseId, post }) => {
  const { author, title, description, links, id } = post;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [addingComment, setAddingComment] = useState(false);

  const getAllComments = async () => {
    if (id) {
      const commentsData = (id &&
        (await getComments(courseId, id))) as CommentData[];
      setComments(commentsData);
    }
  };

  useEffect(() => {
    if (id) {
      getAllComments();
    }
  }, [id]);

  const handleNewComment = () => {
    setAddingComment(true);
  };

  const toggleNewComment = (exit: boolean) => {
    setAddingComment(exit);
  };

  // TODO: Find a better way to do this
  const refreshComments = async () => {
    const commentsData = (id &&
      (await getComments(courseId, id))) as CommentData[];
    setComments(commentsData);
  };

  return (
    <Container>
      <h2>{title}</h2>
      <p>{author}</p>
      <p>{description}</p>
      <div>{links}</div>
      {!addingComment ? (
        <Button variant="contained" color="primary" onClick={handleNewComment}>
          Add Comment
        </Button>
      ) : (
        <NewComment
          courseId={courseId}
          postId={id || ""}
          exit={toggleNewComment}
          refresh={refreshComments}
        />
      )}
      <div className="comments">
        {id &&
          comments &&
          comments.map((doc, index) => (
            <Comment
              key={index}
              courseId={courseId}
              postId={id}
              commentData={doc}
              refresh={refreshComments}
            />
          ))}
      </div>
    </Container>
  );
};

export default Post;
