import { Box, Container, Grid, TextField, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { CodeRounded } from "@material-ui/icons";
import { useState } from "react";

export default (props: {
  onCreateMeeting: Function;
  joinMeetingCode: Function;
}) => {
  const [code, setCode] = useState("");
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      textAlign="center"
      flexDirection="column"
    >
      <Typography variant="h3" style={{ marginBottom: "1.5rem" }}>
        Start free meeting now!
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "3rem" }}>
        Up to 4 people can join your meeting
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: "1.5rem", width: "25%", height: "3rem" }}
        onClick={() => props.onCreateMeeting()}
      >
        Start Meeting
      </Button>
      <Typography variant="body1" style={{ marginBottom: "3rem" }}>
        Or, join a meeting by code
      </Typography>
      <TextField
        label="Meeting Code"
        variant="outlined"
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.joinMeetingCode(code)}
      >
        Join
      </Button>
    </Box>
  );
};
