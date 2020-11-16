import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { UserInfo, registerUser } from "utils/auth";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";
import Navbar from "components/Navbar";

const DEFAULT_INFO: UserInfo = {
  email: "foo@bar.baz",
  password: "foobar",
  firstName: "foo",
  lastName: "bar",
  isAdmin: false,
};

const Register: React.FunctionComponent = () => {
  const history = useHistory();
  const [loginData, setLoginData] = useState<UserInfo>(DEFAULT_INFO);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { user, error } = await registerUser(loginData);
    if (user) {
      history.push("/me");
    } else {
      console.log(error);
    }
  };

  const handleAdminChange = (event: any) => {
    setLoginData({
      ...loginData,
      isAdmin: Boolean(event.target.value),
    });
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h1">Pull Up</Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="firstName"
              label="firstName"
              id="firstName"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="lastName"
              label="lastName"
              id="lastName"
              onChange={handleChange}
            />
          </Grid>
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
          <Grid>
            <Grid item xs={12}>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                name="isAdmin"
                value={loginData.isAdmin ? 1 : 0}
                onChange={handleAdminChange}
              >
                <MenuItem value={0}>Student</MenuItem>
                <MenuItem value={1}>Teacher</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Register;
