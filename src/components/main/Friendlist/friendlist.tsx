import { Box, createStyles, Theme, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import UserCard from "../UserCard/UserCard";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import FriendlistContextMenu from "./ContextMenu";
import ProfileCard from "../ProfileCard";

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

export default function (props: any) {
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

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    targetSID: string
  ) => {
    e.preventDefault();
    selectedID.current = targetSID;
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

  return (
    <>
      <Box padding="1rem 1rem 0.5rem 1.5rem" marginBottom="0rem">
        <Typography variant="h4">Friends</Typography>
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
        handleClickRemoveFriend={() => {}}
        handleClickBlockUser={() => {}}
      />

      <ProfileCard
        user={openProfileCard !== "" ? props.users[openProfileCard] : null}
        anchor={anchorEl.current}
        open={openProfileCard !== "" ? true : false}
      />
    </>
  );
}
