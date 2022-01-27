import React, { useEffect } from "react";
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

const useStyles = makeStyles({
  root: {
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
  anchor: HTMLDivElement;
  open: boolean;
  handleClose: Function;
}) {
  const classes = useStyles();

  const handleClickAway = () => {
    if (props.open) {
      props.handleClose();
    }
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
                  <CardMedia
                    className={classes.media}
                    title="Contemplative Reptile"
                    image={props.user.profilepicture}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {props.user.name}
                    </Typography>
                    <Typography gutterBottom variant="overline" component="h6">
                      {props.user.friendFinderProfile.MBTI}
                    </Typography>
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
                  <Box display={props.isUserFriend ? "none" : "block"}>
                    <Button size="small" color="secondary">
                      Block
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => props.addFriendHandler(props.user.id)}
                    >
                      Add Friend
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Fade>
          )}
        </Popper>
      ) : null}
    </>
  );
}
