import { Box, createStyles, Theme, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import { number } from "prop-types";
import ChatContextMenu from "./ContextMenu";

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
  useEffect(() => {
    //console.log(props.users);
  }, [props.chats]);
  //function openChatChannel(uid: string) {}
  const classes = useStyles();
  const [mousePos, setMousePos] = useState({ mouseX: 0, mouseY: 0 });
  const [openContextMenu, setOpenContextMenu] = useState(false);
  const [selectedContextMenuChatCardSid, setSelectedContextMenuChatCardSid] =
    useState("");

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    sid: string
  ) => {
    e.preventDefault();
    setMousePos({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
    setSelectedContextMenuChatCardSid(sid);
    setOpenContextMenu(true);
  };

  const openChat = (key: string = selectedContextMenuChatCardSid) => {
    props.setPrivateChatTarget(key);
  };

  return (
    <>
      <Box padding="1rem 1rem 1rem 1.5rem" marginBottom="1rem">
        <Typography variant="h4" style={{ fontWeight: "bolder" }}>
          Chats
        </Typography>
      </Box>
      {Object.keys(props.chats).map((keyName, i) => {
        let matchedSocketID = "";
        let userID = Object.keys(props.users).find((sid: any) => {
          if (props.users[sid].id == keyName) {
            matchedSocketID = sid;
            return true;
          }
          return false;
        });
        if (userID !== undefined) {
          return (
            <div
              onClick={() => openChat(matchedSocketID)}
              onContextMenu={(e) => handleContextMenu(e, matchedSocketID)}
              style={{ cursor: "context-menu" }}
            >
              <ChatCard
                user={props.users[userID]}
                lastMsg={props.chats[keyName].slice(-1)[0]}
              />
            </div>
          );
        }
      })}
      <ChatContextMenu
        open={openContextMenu}
        handleClose={() => setOpenContextMenu(false)}
        pos={mousePos}
        handleClickOpenChat={() => {
          openChat();
          setOpenContextMenu(false);
        }}
        handleClickDeleteChat={() => {}}
      />{" "}
    </>
  );
}
