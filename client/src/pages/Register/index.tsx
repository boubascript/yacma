import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { RegisterData, registerUser } from "utils/auth";
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

// Select Element requires a specific type to be used like other input elements
interface SelectElement {
  name?: string;
  value: unknown;
}

const DEFAULT_INFO: RegisterData = {
  email: "foo@bar.baz",
  password: "foobar",
  firstName: "foo",
  lastName: "bar",
  isAdmin: false,
  courses: [],
};

const Register: React.FunctionComponent = () => {
  const history = useHistory();
  const [loginData, setLoginData] = useState<RegisterData>(DEFAULT_INFO);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | SelectElement>
  ) => {
    setLoginData({
      ...loginData,
      // convert to boolean only for loginData.isAdmin
      [e.target.name!]: e.target.name === "isAdmin" ? !!e.target.value: e.target.value,
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

  return (
    <div>
      <Navbar />
      <Typography variant="h1">Pull Up</Typography>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} alignItems="center" justify="center">
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
            <Grid item xs={3}>
              <Container>
                <Select
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  name="isAdmin"
                  value={+loginData.isAdmin}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Student</MenuItem>
                  <MenuItem value={1}>Teacher</MenuItem>
                </Select>
              </Container>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Register;
