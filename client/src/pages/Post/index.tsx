import React from "react";
import Container from "@material-ui/core/Container";

const Post: React.FunctionComponent = (props) => {
  return (
    <React.Fragment>
      <Container>
        <h2>{/*props.title*/}</h2>
        <p>{/*props.desc*/}</p>
        <div>{/*props.files*/}</div>
      </Container>
    </React.Fragment>
  );
};

export default Post;
