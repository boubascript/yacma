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
  const { user } = useContext(UserContext);

  const logout = async () => {
    const { code: errorCode, message } = await logoutUser() || {};
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
          <Button onClick={logout} color="inherit">
            Sign Out
          </Button>
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
