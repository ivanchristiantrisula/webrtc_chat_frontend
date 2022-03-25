import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  IconButton,
} from "@material-ui/core";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      paddingLeft: "2rem",
      paddingRight: "1rem",
    },
  })
);

export default (props: { startVideoCall: Function; user: any }) => {
  const classes = useStyles();

  const handleClickVideoCall = () => {
    props.startVideoCall();
  };

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      justify="center"
    >
      <Grid item xs={7}>
        <CardHeader
          avatar={<Avatar src={props.user.profilepicture} />}
          title={props.user.name}
        />
      </Grid>
      <Grid item xs={3}>
        <Box textAlign="right">
          <IconButton
            aria-label=""
            onClick={handleClickVideoCall}
            color="primary"
          >
            <VideocamOutlinedIcon fontSize="large" />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
};
