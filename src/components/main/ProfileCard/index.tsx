import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import {
  Box,
  ClickAwayListener,
  Fade,
  Popper,
  PopperProps,
  CardHeader,
  Avatar,
  IconButton,
} from "@material-ui/core";
import axios from "axios";
import { getToken } from "../../../helper/localstorage";
import { useSnackbar } from "notistack";
import Report from "../Report";

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    maxWidth: 345,
  },
  media: {
    width: "100%",
    height: 200,
  },
});

export default function ProfileCard(props: {
  user: any;
  isUserFriend?: boolean;
  addFriendHandler?: Function;
  blockUserHandler?: Function;
  anchor: HTMLDivElement;
  open: boolean;
  handleClose: Function;
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const selectedProfile = useRef<any>({});
  const [openReportDialog, setOpenReportDialog] = useState(false);

  const handleClickAway = () => {
    if (props.open) {
      props.handleClose();
    }
  };

  const blockUser = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/blockUser`, {
        token: getToken(),
        target: props.user.id,
      })
      .then((res) => {
        if (res.status == 200) {
          enqueueSnackbar(`${props.user.name} has been blocked!`, {
            variant: "info",
          });
          props.blockUserHandler(props.user.id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const reportUser = (profile: {}) => {
    selectedProfile.current = profile;
    setOpenReportDialog(true);
  };

  return (
    <>
      {props.user ? (
        <Popper
          open={props.open}
          anchorEl={props.anchor}
          placement={"right-start"}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Card className={classes.root}>
                <CardHeader
                  action={
                    <IconButton onClick={() => props.handleClose()}>
                      <CloseIcon />
                    </IconButton>
                  }
                />
                <CardActionArea>
                  <Box onClick={() => window.open(props.user.profilepicture)}>
                    <CardMedia
                      className={classes.media}
                      image={props.user.profilepicture}
                    />
                  </Box>

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {props.user.name + " · " + props.user.username}
                    </Typography>
                    {props.user.friendFinderProfile ? (
                      <Typography
                        gutterBottom
                        variant="overline"
                        component="h6"
                      >
                        {props.user.friendFinderProfile.MBTI}
                      </Typography>
                    ) : null}

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {props.user.bio}
                    </Typography>
                    {props.user.score ? (
                      <>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Score : {props.user.score}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Number of mutual friends : {props.user.mutualsCount}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          MBTI Compability :{" "}
                          {props.user.isMBTICompatible
                            ? "Compatible"
                            : "Not Compatible"}
                        </Typography>
                      </>
                    ) : null}
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {props.addFriendHandler ? (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => props.addFriendHandler(props.user.id)}
                      hidden={!props.isUserFriend}
                    >
                      Add Friend
                    </Button>
                  ) : null}

                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => blockUser()}
                    hidden={!props.isUserFriend}
                  >
                    Block
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => setOpenReportDialog(true)}
                  >
                    Report
                  </Button>
                </CardActions>
              </Card>
            </Fade>
          )}
        </Popper>
      ) : null}

      {props.user ? (
        <Report
          open={openReportDialog}
          targetUID={props.user.id}
          closeDialog={() => setOpenReportDialog(false)}
          profile={props.user}
          chat={null}
        />
      ) : null}
    </>
  );
}
