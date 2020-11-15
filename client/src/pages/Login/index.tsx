import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { UserInfo, UserAuthInfo, loginUser } from "utils/auth";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import Navbar from "components/Navbar";

const DEFAULT_INFO: UserAuthInfo = {
  email: "foo@bar.baz",
  password: "foobar",
};

const Login: React.FunctionComponent = () => {
  const history = useHistory();
  const [loginData, setLoginData] = useState<UserAuthInfo>(DEFAULT_INFO);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { user, error } = await loginUser(loginData);
    if (user) {
      history.push("/me");
    } else {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h1">Login Page</Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default Login;
