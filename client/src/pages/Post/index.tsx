import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import { PostData } from "utils/posts";
import { getComments, CommentData } from "utils/comments";

type PostProps = { courseId: string; /*postId: string,*/ post: PostData };
const Post: React.FunctionComponent<PostProps> = ({
  courseId,
  /*postId,*/ post,
}: PostProps) => {
  const { author, title, description, links } = post;
  // const [comments, setComments] = useState<CommentData[]>([]);

  // TODO: ADD RETURN EMPTY FOR NO COMMENTS CASE
  // const getComments = async() => {
  //   const commentsData = await getComments(courseId, postId);
  // }

  return (
    <React.Fragment>
      <Container>
        <h2>{title}</h2>
        <p>{author}</p>
        <p>{description}</p>
        <div>{links}</div>
        {/* Show Comments conditional Rendering */}
      </Container>
    </React.Fragment>
  );
};

export default Post;
