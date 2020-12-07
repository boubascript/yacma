import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import axios from "axios";
import Navbar from "components/Navbar";

const Home: React.FunctionComponent = () => {
  const [message, setMessage] = useState("");

  const getMessage = async () => {
    const res = await axios.get(`/api/`);
    setMessage(res.data);
  };

  useEffect(() => {
    (async () => {
      await getMessage();
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <Typography variant="h1">Home Page. Soon Come.</Typography>
      <Typography variant="h2">{message}</Typography>
    </div>
  );
};

export default Home;
