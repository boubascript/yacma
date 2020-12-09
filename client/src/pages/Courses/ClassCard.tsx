import { Card, CardContent, Typography, Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

interface ClassProps {
  name: string;
  id?: string;
  code: string;
  description: string;
  educator: string;
}

const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#eceef8",
  },
  button: {
    margin: "20px",
  },
  icon: {
    margin: "5px",
    marginLeft: "8px",
    marginRight: "2px",
  },
  search: {
    marginTop: "20px",
  },
  addCard: {
    minWidth: 300,
    maxWidth: 300,
    margin: "20px",
    marginTop: 0,
    padding: "20px",
    display: "inline-block",
  },
  card: {
    minWidth: 300,
    maxWidth: 300,
    margin: "20px",
    display: "inline-block",
  },
  title: {
    marginTop: "20px",
  },
});

const ClassCard: React.FC<ClassProps> = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const loadCourse = (id: string) => {
    console.log(props.id);
    history.push({
      pathname: "/coursepage",
      search: id,
    });
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4">
          {" "}
          <b>{props.name} </b>
        </Typography>
        <Typography variant="h5"> Code: {props.code} </Typography>
        <Typography variant="h5">Professor: {props.educator}</Typography>
        <Typography variant="h5">{props.description}</Typography>
        <Button
          name={props.code}
          onClick={() => {
            loadCourse(props.id!);
          }}
        >
          Go To Course
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
