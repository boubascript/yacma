import React, { useState, useEffect } from "react";
import { getHomeMessage } from "utils/services";
import { Link } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import axios from "axios";
import Navbar from "components/Navbar";
import Login from "pages/Login";
import Register from "pages/Register";

const Home: React.FunctionComponent = () => {
  const [message, setMessage] = useState("");
  const [display, setDisplay] = useState(1); //Login
  const logoLink = "https://storage.googleapis.com/yacma-images/yacma-logo.png";

  const getMessage = async () => {
    const message = await getHomeMessage();
    setMessage(message);
  };

  useEffect(() => {
    (async () => {
      await getMessage();
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <img src={logoLink} /> <br></br>
      <Button onClick={() => setDisplay(1)}> Login </Button>
      <Button onClick={() => setDisplay(0)}> Register </Button>
      { display ?  <Login/> : <Register/> }

    </div>
  );
};

export default Home;
