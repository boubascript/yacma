import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

interface ClassProps {
  name: string;
  id?: string;
  code: string;
  description: string;
  educator: string;
}

const useStyles = makeStyles({
  card: {
    width: "60%",
    minWidth: 300,
    margin: "20px",
    display: "inline-block",
  },
});

const CourseHeader: React.FC<ClassProps> = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4">
          {" "}
          <b>{props.name} </b>
        </Typography>
        <Typography variant="h5"> Code: {props.code} </Typography>
        <Typography variant="h5">Professor: {props.educator}</Typography>
        <Typography variant="h5" color="textSecondary">
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CourseHeader;
