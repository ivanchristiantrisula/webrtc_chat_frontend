import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getToken } from "../../../helper/localstorage";

export default (props: { handleSubmit: Function }) => {
  let history = useHistory();
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

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

  const handleSubmit = () => {
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
          onChange={(e) => setCodeInput(e.target.value)}
          style={{ marginBottom: "2rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          fullWidth
        >
          Submit
        </Button>
      </FormControl>
    </>
  );
};
