import { Box, createStyles, Theme, Typography } from "@material-ui/core";
import { useEffect } from "react";
import ChatCard from "./ChatCard";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";

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

  return (
    <>
      <Box padding="1rem 1rem 1rem 1.5rem" marginBottom="1rem">
        <Typography variant="h4">Chats</Typography>
      </Box>
      {Object.keys(props.chats).map((keyName, i) => {
        let matchedSocketID = "";
        let user = Object.keys(props.users).find((sid: any) => {
          if (props.users[sid]._id == keyName) {
            matchedSocketID = sid;
            return true;
          }
          return false;
        });
        if (user !== undefined)
          return (
            <div onClick={() => props.setPrivateChatTarget(matchedSocketID)}>
              <ChatCard
                user={user}
                lastMsg={props.chats[keyName].slice(-1)[0]}
              />
            </div>
          );
      })}
    </>
  );
}
