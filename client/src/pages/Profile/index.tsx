import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";

const Profile: React.FunctionComponent = () => {
  const { user, userInfo } = useContext(UserContext);

  const getProfile = async () => {
    // TODO: Query for user profile information and update state
  };

  useEffect(() => {
    (async () => {
      await getProfile();
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <Typography variant="h1">
        Welcome, {userInfo && userInfo!.isAdmin ? "Professor" : ""}{" "}
        {userInfo && userInfo!.firstName} {userInfo && userInfo!.lastName} !
      </Typography>
    </div>
  );
};

export default Profile;
