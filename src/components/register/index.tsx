import React, { useState, useEffect } from "react";
// import '../App.css';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import { useHistory } from "react-router";
import axios from "axios";
import { Box, Grid, Link, makeStyles, Theme } from "@material-ui/core";
import Background from "./background.svg";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import Alert from "@material-ui/lab/Alert";
require("dotenv").config();

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  logoArea: {
    height: "5rem",
  },
  credsArea: {
    height: "20rem",
  },
  toLogin: {
    height: "3rem",
  },
  loginArea: {
    marginBottom: "0.8rem",
    marginTop: "1rem",
  },
  loginBox: {
    transform: "translateY(-50%)",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "20px",
  },
  name1: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
    fontSize: "2rem",
  },
  name2: {
    color: theme.palette.secondary.main,
    fontWeight: "bold",
    fontSize: "2rem",
  },
  textField: {
    marginBottom: "1rem",
  },
}));

function App() {
  const classes = useStyles();
  let history = useHistory();
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirm, setConfirm] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const toLogin = () => {
    history.push("/");
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    setRegisterLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URI + "/user/register", {
        email: email,
        password: password,
        name: name,
        username: username,
        confirm: confirm,
      })
      .then((res) => {
        if (res.status == 200) history.push("/");
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
      })
      .finally(() => {
        setRegisterLoading(false);
      });
  };

  return (
    <Box className={classes.root}>
      <Box
        boxShadow="5"
        width="20%"
        minWidth="25rem"
        margin="auto"
        padding="15px 20px 15px 20px"
        position="relative"
        top="50%"
        className={classes.loginBox}
      >
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12}>
            <Box
              className={classes.logoArea}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <span className={classes.name1}>
                <ChatBubbleOutlineOutlinedIcon fontSize="large" />
                Chat
              </span>
              <span className={classes.name2}>App</span>
            </Box>
          </Grid>
          <Grid
            item
            alignItems="center"
            justify="center"
            xs={12}
            style={{ marginBottom: "1.5rem" }}
          >
            {errors.map((err) => (
              <Alert severity="error">{err}</Alert>
            ))}
          </Grid>
          <Grid item alignItems="center" justify="center" xs={12}>
            <Box>
              <FormControl fullWidth>
                <form action="" onSubmit={handleRegister}>
                  <TextField
                    id="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    className={classes.textField}
                  />
                  <TextField
                    id="useraname"
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                    className={classes.textField}
                  />
                  <TextField
                    id="name"
                    label="Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    className={classes.textField}
                  />
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    className={classes.textField}
                  />
                  <TextField
                    id="confirm"
                    label="Confirm Password"
                    type="password"
                    error={password === confirm ? false : true}
                    helperText={
                      password === confirm
                        ? ""
                        : "Confirm password doesn't match password"
                    }
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    fullWidth
                    className={classes.textField}
                  />
                </form>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              className={classes.loginArea}
              display="flex"
              alignItems="center"
            >
              <FormControl fullWidth>
                <Button
                  onClick={handleRegister}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={registerLoading}
                >
                  {registerLoading ? "Signing you up..." : "Sign Up"}
                </Button>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outlined"
                color="primary"
                fullWidth
                disabled={registerLoading}
              >
                Login
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
