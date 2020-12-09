import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { UserContext, logoutUser } from "utils/auth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navlink: {
      textDecoration: "none",
      color: "white",
    },
  })
);

const Navbar: React.FunctionComponent = () => {
  const history = useHistory();
  const classes = useStyles();
  const { user, userData } = useContext(UserContext);
  let addCourseLink = "/";

  if (userData != null) {
    addCourseLink = userData!.isAdmin ? "/addCourseProf" : "/addCourseStudent";
  }

  const logout = async () => {
    const { code: errorCode, message } = (await logoutUser()) || {};
    if (!errorCode) history.push("/");
    else {
      console.log(`${errorCode}: ${message}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6">
          <Link className={classes.navlink} to="/">
            {" "}
            YACMA{" "}
          </Link>
        </Typography>
        {user ? (
          <div>
            {" "}
            <Button color="inherit">
              <Link className={classes.navlink} to={addCourseLink}>
                Add Course
              </Link>
            </Button>
            <Button onClick={logout} color="inherit">
              {" "}
              Sign Out{" "}
            </Button>{" "}
          </div>
        ) : (
          <>
            <Button color="inherit">
              <Typography variant="h6">
                <Link className={classes.navlink} to="/login">
                  Login
                </Link>
              </Typography>
            </Button>
            <Button color="inherit">
              <Typography variant="h6">
                <Link className={classes.navlink} to="/register">
                  Sign Up
                </Link>
              </Typography>
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
