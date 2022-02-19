import {
  Box,
  Button,
  FormControl,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { getToken } from "../../../helper/localstorage";
import Background from "../../landing/background.svg";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import Alert from "@material-ui/lab/Alert";

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
    height: "10rem",
    alignItems: "center",
    justify: "center",
  },
  toRegister: {
    height: "3rem",
    display: "flex",
    alignItems: "center",
  },
  loginArea: {
    height: "3rem",
    display: "flex",
    alignItems: "center",
    justify: "center",
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

export default (props: { handleSubmit: Function }) => {
  const classes = useStyles();
  let history = useHistory();
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [errors, setErrors] = useState([]);

  let inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/user/sendEmailVerificationCode`,
        {
          token: getToken(),
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setCode(res.data.code);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    inputRef.current.value = "";
  }, [errors]);

  const handleSubmit = () => {
    if (code != codeInput) {
      setErrors(["Invalid verification code"]);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/verifyAccount`, {
        token: getToken(),
      })
      .then((res) => {
        if (res.status === 200) {
          history.push("/chat");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
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
          <Grid container>
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

            <Grid item alignItems="center" justify="center" xs={12}>
              <Box>
                <Typography variant="h5" style={{ marginBottom: "1rem" }}>
                  Verification Code
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  A code has been sent to your email. Please enter the code
                  below :
                </Typography>
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
                <FormControl fullWidth>
                  <TextField
                    label="Verification code"
                    variant="outlined"
                    onChange={(e) => setCodeInput(e.target.value)}
                    style={{ marginBottom: "2rem" }}
                    inputRef={inputRef}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className={classes.loginArea}>
                <FormControl fullWidth>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                  >
                    Verify
                  </Button>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
