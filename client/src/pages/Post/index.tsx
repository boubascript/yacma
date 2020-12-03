import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import { PostData, PostDataId } from "utils/posts";
import { getComments, CommentData, CommentDataId } from "utils/comments";
import Comment from "pages/Comment";
import { Button } from "@material-ui/core";
import NewComment from "pages/NewComment";

type PostProps = { courseId: string; post: PostDataId };
const Post: React.FunctionComponent<PostProps> = ({
  courseId,
  post,
}: PostProps) => {
  const {
    data: { author, title, description, links },
    id,
  } = post;
  const [comments, setComments] = useState<CommentDataId[]>([]);
  const [addingComment, setAddingComment] = useState(false);

  const handleNewComment = () => {
    setAddingComment(true);
  };

  const toggleNewComment = (exit: boolean) => {
    setAddingComment(exit);
  };

  // TODO: ADD RETURN EMPTY FOR NO COMMENTS CASE
  const getAllComments = async () => {
    const commentsData = (await getComments(courseId, id)) as CommentDataId[];
    setComments(commentsData);
  };

  // TODO: Find a better way to do this
  const refreshComments = async () => {
    // TODO: Add check for get course failure
    const commentsData = (await getComments(courseId, id)) as CommentDataId[];
    setComments(commentsData);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <React.Fragment>
      <Container>
        <h2>{title}</h2>
        <p>{author}</p>
        <p>{description}</p>
        <div>{links}</div>
        {!addingComment ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewComment}
          >
            Add Comment
          </Button>
        ) : (
          <NewComment
            courseId={courseId}
            postId={id}
            exit={toggleNewComment}
            refresh={refreshComments}
          />
        )}
        <div className="comments">
          {comments &&
            comments.map((doc, index) => (
              <Comment key={index} postId={id} commentData={doc} />
            ))}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Post;
