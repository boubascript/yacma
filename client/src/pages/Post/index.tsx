import React, { useState, useEffect } from "react";
import { PostData } from "utils/posts";
import { getComments, CommentData } from "utils/comments";
import { Button, Container } from "@material-ui/core";
import Comment from "pages/Comment";
import NewComment from "pages/NewComment";
import NewPost from "pages/NewPost";
import axios from "axios";

interface PostProps {
  courseId: string;
  post: PostData;
  refresh: Function;
}
const Post: React.FunctionComponent<PostProps> = ({
  courseId,
  post,
  refresh,
}) => {
  const { author, title, description, links, id } = post;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [addingComment, setAddingComment] = useState(false);
  const [updatingPost, setUpdatingPost] = useState(false);

  const getAllComments = async () => {
    if (id) {
      const { data: commentsData } = await axios.get(
        `comments/${courseId}/posts/${id}/comments`,
        {
          params: {
            courseId: courseId,
            postId: id,
          },
        }
      );
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

  const toggleUpdatePost = (exit: boolean) => {
    setUpdatingPost(exit);
  };

  const toggleNewComment = (exit: boolean) => {
    setAddingComment(exit);
  };

  // TODO: Find a better way to do this
  const refreshComments = async () => {
    getAllComments();
  };

  return (
    <>
      <Container>
        {!updatingPost ? (
          <>
            <h2>{title}</h2>
            <p>{author}</p>
            <p>{description}</p>
            <div>{links}</div>
          </>
        ) : (
          <NewPost
            courseId={courseId}
            exit={toggleUpdatePost}
            refresh={refresh}
            postId={id}
            post={post}
          />
        )}
        <Button color="primary" onClick={() => toggleUpdatePost(true)}>
          Edit
        </Button>
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
    </>
  );
};

export default Post;
