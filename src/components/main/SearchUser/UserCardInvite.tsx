import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Button,
  Fade,
  Popper,
  ButtonBase,
  Box,
  ClickAwayListener,
  Card,
  CardContent,
  IconButton,
  CardHeader,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect, useRef, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import ProfileCard from "../ProfileCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "0 0.5rem 1rem 0.5rem",
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    avatar: {
      marginLeft: "0.5rem",
    },
  })
);

export default function (props: {
  user: any;
  accept: Function;
  reject: Function;
  inviteID: number;
}) {
  const classes = useStyles();
  let [openProfileCard, setOpenProfileCard] = useState(false);
  let [cardAnchorEl, setCardAnchorEl] = useState<HTMLDivElement>();

  let rootAnchorRef = useRef<any>();

  const toggleProfileCard = () => {
    setOpenProfileCard(true);
    setCardAnchorEl(rootAnchorRef.current);
  };

  const closePopper = () => {
    if (openProfileCard) {
      setOpenProfileCard(false);
      setCardAnchorEl(null);
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={closePopper}>
        <div
          style={{ height: "auto", padding: "0.5rem 1rem 0.5rem 1rem" }}
          ref={rootAnchorRef}
        >
          {/* <Card className={classes.root}>
            <CardContent>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={2} className={classes.avatar}>
                  <ButtonBase onClick={toggleProfileCard}>
                    <Avatar
                      src={props.user.profilepicture}
                      className={classes.purple}
                    />
                  </ButtonBase>
                </Grid>
                <Grid item xs={6}>
                  <ButtonBase onClick={toggleProfileCard}>
                    {props.user.name}
                  </ButtonBase>
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader
              avatar={<Avatar aria-label="" src={props.user.profilepicture} />}
              action={
                <Grid>
                  <Grid container direction="row" alignItems="center">
                    <Grid item>
                      <IconButton
                        color="primary"
                        component="span"
                        onClick={() => {
                          props.accept(props.user.id);
                        }}
                      >
                        <CheckIcon fontSize="large" htmlColor="green" />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="primary"
                        component="span"
                        onClick={() => {
                          props.reject(props.user.id);
                        }}
                      >
                        <ClearIcon fontSize="large" color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              }
              title={props.user.name}
              subheader=""
              onClick={() => toggleProfileCard()}
            />
          </Card>
        </div>
      </ClickAwayListener>

      <ProfileCard
        user={props.user}
        open={openProfileCard}
        anchor={cardAnchorEl}
        handleClose={() => setOpenProfileCard(false)}
        // addFriendHandler={addFriend}
        // isUserFriend={false}
      />
    </>
  );
}
