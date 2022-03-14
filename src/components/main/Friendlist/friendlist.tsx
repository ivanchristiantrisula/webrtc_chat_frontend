import { Box, createStyles, Theme, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import UserCard from "../UserCard/UserCard";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import FriendlistContextMenu from "./ContextMenu";
import ProfileCard from "../ProfileCard";
import { getToken } from "../../../helper/localstorage";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    invite: {
      borderBottom: "solid black 1px",
      height: "3rem",
      display: "flex",
      alignItems: "center",
      paddingLeft: "50px",
    },
  })
);

export default function (props: {
  users: any;
  setPrivateChatTarget: Function;
  userID: string;
  handleUnfriend: Function;
}) {
  //function openChatChannel(uid: string) {}
  const classes = useStyles();
  const selectedID = useRef<string>();
  const anchorEl = useRef<HTMLDivElement>();
  const [mousePos, setMousePos] = useState({
    mouseX: 0,
    mouseY: 0,
  });
  const [openContextMenu, setOpenContextMenu] = useState(false);
  const [openProfileCard, setOpenProfileCard] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    targetSID: string
  ) => {
    e.preventDefault();
    selectedID.current = props.users[targetSID].id;
    anchorEl.current = e.currentTarget;
    setMousePos({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
    setOpenContextMenu(true);
  };

  const showProfileCard = () => {
    setOpenProfileCard(selectedID.current);
  };

  const unfriend = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/unfriend`, {
        token: getToken(),
        targetID: selectedID.current,
      })
      .then((res) => {
        if (res.status === 200) {
          //TODO : remove from friendlist state array
          props.handleUnfriend();
          enqueueSnackbar("User removed from friendlist");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const blockUser = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/blockUser`, {
        token: getToken(),
        target: selectedID.current,
      })
      .then((res) => {
        props.handleUnfriend();
        enqueueSnackbar("User blocked!");
      });
  };

  return (
    <>
      <Box padding="1rem 1rem 0.5rem 1.5rem" marginBottom="0rem">
        <Typography variant="h4" style={{ fontWeight: "bolder" }}>
          Friends
        </Typography>
      </Box>
      <Box margin="1rem 1rem 1rem 1.5rem">
        <Typography variant="subtitle2" color="textSecondary">
          Online {`(${Object.keys(props.users).length})`}
        </Typography>
      </Box>
      {Object.keys(props.users).map((keyName, i) => {
        if (keyName != props.userID)
          return (
            <div
              onClick={() => props.setPrivateChatTarget(keyName)}
              onContextMenu={(e) => handleRightClick(e, keyName)}
              style={{ cursor: "context-menu" }}
            >
              <UserCard user={props.users[keyName]} />
            </div>
          );
      })}

      <FriendlistContextMenu
        open={openContextMenu}
        handleClose={() => {
          setOpenContextMenu(false);
        }}
        pos={mousePos}
        handleClickStartChat={() => {
          props.setPrivateChatTarget(selectedID.current);
          setOpenContextMenu(false);
        }}
        handleClickShowProfile={() => {
          showProfileCard();
          setOpenContextMenu(false);
        }}
        handleClickRemoveFriend={unfriend}
        handleClickBlockUser={blockUser}
      />

      <ProfileCard
        user={openProfileCard !== "" ? props.users[openProfileCard] : null}
        anchor={anchorEl.current}
        open={openProfileCard !== "" ? true : false}
        handleClose={() => setOpenProfileCard("")}
        isUserFriend
      />
    </>
  );
}
