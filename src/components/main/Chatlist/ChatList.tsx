import { Box, createStyles, Theme, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import ChatCard from "./ChatCard";
import { makeStyles } from "@material-ui/styles";
import ChatContextMenu from "./ContextMenu";
import { useSnackbar } from "notistack";

import {
  getUserChatHistory,
  getUserInfo,
  setUserChatHistory,
} from "../../../helper/localstorage";

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
  setPrivateChatTarget: Function;
  chats: any;
  users: any;
  updateChats: Function;
  userID: string;
}) {
  useEffect(() => {
    //console.log(props.users);
  }, [props.chats]);
  //function openChatChannel(uid: string) {}
  const classes = useStyles();
  const [mousePos, setMousePos] = useState({ mouseX: 0, mouseY: 0 });
  const [openContextMenu, setOpenContextMenu] = useState(false);
  const [selectedContextMenuChatCardSid, setSelectedContextMenuChatCardSid] =
    useState("");
  const { enqueueSnackbar } = useSnackbar();
  const selectedContextMenuUserID = useRef("");

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    sid: string,
    uid: string
  ) => {
    e.preventDefault();
    setMousePos({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
    setSelectedContextMenuChatCardSid(sid);
    selectedContextMenuUserID.current = uid;
    setOpenContextMenu(true);
  };

  const openChat = (key: string = selectedContextMenuChatCardSid) => {
    props.setPrivateChatTarget(key);
  };

  const deleteChat = () => {
    let chats = getUserChatHistory();
    let user = getUserInfo();
    delete chats[selectedContextMenuUserID.current];
    //console.log(chats[user.id][selectedContextMenuUserID.current]);
    setUserChatHistory(chats);
    props.updateChats();
    enqueueSnackbar("Chat deleted!", { variant: "info" });
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
              onContextMenu={(e) =>
                handleContextMenu(e, matchedSocketID, keyName)
              }
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
        handleClickDeleteChat={() => deleteChat()}
      />
    </>
  );
}
