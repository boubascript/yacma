import React from "react";
import Container from "@material-ui/core/Container";

const Comment: React.FunctionComponent = (props) => {
  return (
    <React.Fragment>
      <Container>
        <p>{/*props.comment*/}</p>
        <p>{/*props.author*/}</p>
      </Container>
    </React.Fragment>
  );
};

export default Comment;
