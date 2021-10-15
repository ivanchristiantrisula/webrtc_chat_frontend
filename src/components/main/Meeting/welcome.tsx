import { Box, Container, Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";

export default (props: { onCreateMeeting: Function }) => {
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
    </Box>
  );
};
