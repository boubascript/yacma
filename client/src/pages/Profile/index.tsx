import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "utils/auth";
import { Container, Typography, Button } from "@material-ui/core";
import Navbar from "components/Navbar";

const Profile: React.FunctionComponent = () => {
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);

  const getProfile = async () => {
    // TODO: Query for user profile information and update state
    setMessage("Profile stuff here or something");
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
        Profile Page. Soon Come, {user && user.email}
      </Typography>
      <Typography variant="h2">{message}</Typography>
    </div>
  );
};

export default Profile;
