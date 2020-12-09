import React, { useState, useEffect, useContext } from "react";
import { PostData } from "utils/posts";
import { getComments, CommentData } from "utils/comments";
import { Button, Container } from "@material-ui/core";
import Comment from "pages/Comment";
import NewComment from "pages/NewComment";
import { UserContext } from "utils/auth";

interface PostProps extends PostData {
  courseId: string;
  onDelete: () => void;
}

const Post: React.FunctionComponent<PostProps> = ({
  courseId,
  author,
  title,
  description,
  links,
  id,
  onDelete,
}) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [addingComment, setAddingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getAllComments = async () => {
    if (id) {
      const commentsData = (id &&
        (await getComments(courseId, id))) as CommentData[];
      setComments(commentsData);
    }
  };

  const remove = async () => {
    setIsDeleting(true);
    onDelete();
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
      <Container>
        <h2>{title}</h2>
        <Button variant="contained" color="secondary" onClick={remove}>
          {isDeleting ? "Deleting Post..." : "Delete Dis"}
        </Button>
      </Container>
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
            <Comment key={index} postId={id} commentData={doc} />
          ))}
      </div>
    </Container>
  );
};

export default Post;
