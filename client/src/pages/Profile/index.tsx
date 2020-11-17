import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";

const Profile: React.FunctionComponent = () => {
  const { user, userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin } = userData || {};

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
      {
        userData &&
        <Typography variant="h1">
          Welcome, { `${isAdmin ? "Professor" : ""} ${firstName} ${lastName} !`}
        </Typography>

      }
    </div>
  );
};

export default Profile;
