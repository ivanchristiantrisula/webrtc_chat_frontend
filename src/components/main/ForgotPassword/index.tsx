import {
  Box,
  makeStyles,
  Theme,
  Typography,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    transform: "translateY(-50%)",
  },
}));

const Email = (props: { handleSubmit: Function }) => {
  const [email, setEmail] = useState("");
  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "1rem" }}>
        Enter your registered email
      </Typography>
      <FormControl fullWidth>
        <TextField
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "2rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.handleSubmit(email)}
          fullWidth
        >
          Submit
        </Button>
      </FormControl>
    </>
  );
};

const Verification = (props: { handleSubmit: Function }) => {
  const [code, setCode] = useState("");
  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "1rem" }}>
        Verification Code
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "1rem" }}>
        A code has been sent to your email. Please enter the code below :
      </Typography>
      <FormControl fullWidth>
        <TextField
          label="Verification code"
          variant="outlined"
          onChange={(e) => setCode(e.target.value)}
          style={{ marginBottom: "2rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.handleSubmit(code)}
          fullWidth
        >
          Submit
        </Button>
      </FormControl>
    </>
  );
};

const ResetPassword = (props: { handleSubmit: Function }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "1rem" }}>
        Create new password
      </Typography>

      <FormControl fullWidth>
        <TextField
          id="password"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          style={{ marginBottom: "1rem" }}
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
          style={{ marginBottom: "2rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.handleSubmit(password)}
          fullWidth
          disabled={password !== confirm}
        >
          Submit
        </Button>
      </FormControl>
    </>
  );
};

export default () => {
  let history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(0);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
    useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: "", msg: "" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    setAlertMsg({ type: "", msg: "" });
  }, [step]);

  const submitEmail = (email: string) => {
    setEmail(email);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URI}/api/user/sendResetPasswordCode`,
        {
          email: email,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setVerificationCode(res.data.code);
          setStep(1);
        }
      })
      .catch((err) => {
        setAlertMsg({ type: "error", msg: "Email not found" });
      });
  };

  const submitVerificationCode = (code: number) => {
    if (code == verificationCode) {
      setIsVerificationCodeVerified(true);
      setStep(2);
    } else {
      setAlertMsg({ type: "error", msg: "Invalid verification code!" });
    }
  };

  const submitResetPassword = (password: string) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/api/user/resetPassword`, {
        code: verificationCode,
        password: password,
        email: email,
      })
      .then((res) => {
        if (res.status === 200) {
          history.push("/");
        }
      });
  };

  const renderSwitch = () => {
    switch (step) {
      case 0:
        return <Email key={step} handleSubmit={submitEmail} />;
      case 1:
        return (
          <Verification key={step} handleSubmit={submitVerificationCode} />
        );
      case 2:
        return <ResetPassword handleSubmit={submitResetPassword} />;
    }
  };

  return (
    <Box width="100vw" height="100vh">
      <Box
        position="relative"
        top="50%"
        boxShadow="5"
        width="40%"
        padding="2rem"
        margin="auto"
        borderRadius="20px"
        className={classes.box}
      >
        {alertMsg.type !== "" && alertMsg.msg !== "" ? (
          <Alert
            severity={alertMsg.type as Color}
            style={{ marginBottom: "2rem" }}
          >
            {alertMsg.msg}
          </Alert>
        ) : null}
        {renderSwitch()}
      </Box>
    </Box>
  );
};
