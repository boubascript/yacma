import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "utils/auth";
import { CourseData } from "utils/types";
import { Typography } from "@material-ui/core";
import Navbar from "components/Navbar";

// TODO: Give Profile Page a purpose
const Profile: React.FunctionComponent = () => {
  const { userData } = useContext(UserContext);
  const { firstName, lastName, isAdmin, courses } = userData || {};

  return (
    <div>
      <Navbar />
      {userData && (
        <div>
          <Typography variant="h1">
            Welcome,{" "}
            {`${isAdmin ? "Professor" : ""} ${firstName} ${lastName} !`}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Profile;
