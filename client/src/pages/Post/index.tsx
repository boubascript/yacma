import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { PostData, CommentData } from "utils/types";
import { Button, Container } from "@material-ui/core";
import Comment from "pages/Comment";
import NewComment from "pages/NewComment";
import NewPost from "pages/NewPost";
// import "App.css";
import { getComments } from "utils/services";

interface PostProps {
  courseId: string;
  post: PostData;
  refresh: Function;
  onDelete: () => void;
}

const Post: React.FunctionComponent<PostProps> = ({
  courseId,
  post,
  refresh,
  onDelete,
}) => {
  const { user, userData } = useContext(UserContext);
  const { author, title, description, links, id } = post;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [addingComment, setAddingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingPost, setUpdatingPost] = useState(false);

  const getAllComments = async () => {
    if (id) {
      const commentsData = await getComments(courseId, id);
      setComments(commentsData);
    }
  };

  const remove = async () => {
    setIsDeleting(true);
    onDelete();
  };

  useEffect(() => {
    // if (id) {
    getAllComments();
    // }
  }, []);

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

  if (links) {
    console.log(links);
  }
  return (
    <>
      <Container>
        {!updatingPost ? (
          <>
            <h2>{title}</h2>
            <p>{author}</p>
            <p>{description}</p>
            {links && /(jpg|gif|png|jpeg)$/i.test(links) ? (
              <img src={links} alt="" title={`image${links}`} />
            ) : (
              <a href={links}>{links.split("/").pop()}</a>
            )}
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

        {userData?.firstName + " " + userData?.lastName === author && (
          <>
            <Button color="primary" onClick={() => toggleUpdatePost(true)}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={remove}>
              {isDeleting ? "Deleting Post..." : "Delete Dis"}
            </Button>
          </>
        )}
        {!addingComment ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewComment}
          >
            Add Comment
          </Button>
        ) : (
          id && (
            <NewComment
              courseId={courseId}
              postId={id}
              exit={toggleNewComment}
              refresh={refreshComments}
            />
          )
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
