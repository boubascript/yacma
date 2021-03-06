import { Card, CardContent, Typography, Button } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { CourseData } from "utils/types";
import { unenroll } from "utils/services";
import { getUserData, UserContext } from "utils/auth";

interface ClassCardData extends CourseData {
  uid?: string;
  refresh: () => void;
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

const ClassCard: React.FC<ClassCardData> = ({
  id,
  name,
  code,
  educator,
  description,
  uid,
  refresh,
}) => {
  const { userData, deleteCourseContext } = useContext(UserContext);
  const history = useHistory();
  const classes = useStyles();

  const loadCourse = () => {
    history.push({
      pathname: "/coursepage",
      search: id,
    });
  };

  const unenrollCourse = async () => {
    const isUnenrolled = await unenroll(id!, uid!);
    if (isUnenrolled) {
      deleteCourseContext(id!);
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4">
          {" "}
          <b>{name} </b>
        </Typography>
        <Typography variant="h5"> Code: {code} </Typography>
        <Typography variant="h5">Professor: {educator}</Typography>
        <Typography variant="h6" color="textSecondary">
          {description}
        </Typography>
        <Button
          name={code}
          onClick={() => {
            loadCourse();
          }}
        >
          Go To Course
        </Button>{" "}
        <br></br>
        {!userData?.isAdmin && (
          <Button
            color="secondary"
            startIcon={<DeleteIcon />}
            name={code}
            onClick={unenrollCourse}
          >
            Unenroll
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassCard;
