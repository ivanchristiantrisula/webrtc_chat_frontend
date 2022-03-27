import {
  Box,
  Button,
  ButtonBase,
  createStyles,
  Grid,
  makeStyles,
  Popover,
  Theme,
  Typography,
  CardHeader,
  Avatar,
  IconButton,
} from "@material-ui/core";
import AirplayIcon from "@material-ui/icons/Airplay";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import CallEndIcon from "@material-ui/icons/CallEnd";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PeopleIcon from "@material-ui/icons/People";
import { useRef, useState } from "react";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    hidden: {
      visibility: "hidden",
    },
    gridParent: {
      minHeight: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    gridItems: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
    },
    leftSection: {
      marginRight: "auto",
      paddingLeft: "20px",
    },
    midSection: {},
    rightSection: {
      marginLeft: "auto",
      paddingRight: "20px",
    },
    iconContainer: {
      marginLeft: "15px",
      marginRight: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  })
);

const ParticipantsPopover = (props: {
  open: boolean;
  handleClose: Function;
  anchor: HTMLDivElement;
  users: [any];
}) => {
  return (
    <div>
      <Popover
        id={props.open ? "simple-popover" : undefined}
        open={props.open}
        anchorEl={props.anchor}
        onClose={() => props.handleClose()}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <li>
          {props.users.map((user) => (
            <ul>
              <CardHeader
                avatar={<Avatar aria-label="" src={user.profilepicture} />}
                title={user.name}
                subheader=""
              />
            </ul>
          ))}
        </li>
      </Popover>
    </div>
  );
};

export default (props: {
  meetingID: string;
  isPrivate: boolean;
  handleLeaveMeeting: Function;
  handleInviteUser: Function;
  handleMuteVideo: Function;
  handleMuteAudio: Function;
  handleScreenShare: Function;
  handleWhiteboard: Function;
  whiteboardMode: boolean;
  sceensharingMode: boolean;
  users: any;
}) => {
  const classes = useStyle();
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(false);
  const participantsAnchor = useRef<HTMLDivElement>();
  const [showParticipants, setShowParticipants] = useState(false);

  const toggleParticipantsPopover = () =>
    setShowParticipants(!showParticipants);

  return (
    <>
      <Grid className={classes.gridParent} container justify="center">
        <Grid item xs={4} className={classes.gridItems}>
          <Box display="flex" className={classes.leftSection}>
            <Box
              className={`${classes.iconContainer} ${
                props.isPrivate && classes.hidden
              }`}
            >
              <AirplayIcon
                fontSize="large"
                onClick={() => props.handleScreenShare()}
                color={props.whiteboardMode ? "disabled" : "inherit"}
              />
              Screen Share
            </Box>
            <Box
              className={`${classes.iconContainer} ${
                props.isPrivate && classes.hidden
              }`}
              onClick={() => props.handleWhiteboard()}
            >
              <VideoLabelIcon
                fontSize="large"
                color={props.sceensharingMode ? "disabled" : "inherit"}
              />
              Whiteboard
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} className={classes.gridItems}>
          <Box display="flex" className={classes.midSection}>
            <Box
              className={classes.iconContainer}
              onClick={() => {
                props.handleMuteAudio();
                setAudio(!audio);
              }}
            >
              {audio ? (
                <>
                  <MicIcon fontSize="large" />
                  <Typography variant="body1" color="textPrimary">
                    Disable Mic
                  </Typography>
                </>
              ) : (
                <>
                  <MicOffIcon fontSize="large" color="error" />
                  <Typography variant="body1" color="error">
                    Enable Mic
                  </Typography>
                </>
              )}
            </Box>
            <Box
              className={classes.iconContainer}
              onClick={() => props.handleLeaveMeeting()}
            >
              <CallEndIcon fontSize="large" />
              End Call
            </Box>
            <Box
              className={classes.iconContainer}
              onClick={() => {
                props.handleMuteVideo();
                setVideo(!video);
              }}
            >
              {video ? (
                <>
                  <VideocamIcon fontSize="large" />
                  <Typography variant="body1">Disable Video</Typography>
                </>
              ) : (
                <>
                  <VideocamOffIcon fontSize="large" color="error" />
                  <Typography variant="body1" color="error">
                    Enable Video
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2} className={classes.gridItems}>
          <Box display="flex" className={classes.midSection}>
            <div
              className={`${classes.iconContainer} ${
                props.isPrivate && classes.hidden
              }`}
              onClick={() => toggleParticipantsPopover()}
              ref={participantsAnchor}
            >
              <PeopleIcon fontSize="large" />
              Participants
            </div>
            <Box
              className={`${classes.iconContainer} ${
                props.isPrivate && classes.hidden
              }`}
              onClick={() => props.handleInviteUser()}
            >
              <PersonAddIcon fontSize="large" />
              Invite
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2} className={classes.gridItems}>
          <Box
            display="flex"
            className={`${classes.rightSection} ${
              props.isPrivate && classes.hidden
            }`}
          >
            {props.meetingID}
          </Box>
        </Grid>
      </Grid>

      <ParticipantsPopover
        open={showParticipants}
        handleClose={toggleParticipantsPopover}
        anchor={participantsAnchor.current}
        users={props.users}
      />
    </>
  );
};
