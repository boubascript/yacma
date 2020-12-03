import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import { PostDataId } from "utils/posts";
import { getComments, CommentDataId } from "utils/comments";
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

  useEffect(() => {
    (async () => {
      const commentsData = (await getComments(courseId, id)) as CommentDataId[];
      setComments(commentsData);
    })();
  }, [courseId, id]);

  const handleNewComment = () => {
    setAddingComment(true);
  };

  const toggleNewComment = (exit: boolean) => {
    setAddingComment(exit);
  };

  // TODO: Find a better way to do this
  const refreshComments = async () => {
    const commentsData = (await getComments(courseId, id)) as CommentDataId[];
    setComments(commentsData);
  };

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
