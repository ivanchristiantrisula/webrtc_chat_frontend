import { Box, createStyles, Theme, Typography } from "@material-ui/core";
import { useEffect } from "react";
import UserCard from "../UserCard/UserCard";
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
  //function openChatChannel(uid: string) {}
  const classes = useStyles();
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
            <div onClick={() => props.setPrivateChatTarget(keyName)}>
              <UserCard user={props.users[keyName]} />
            </div>
          );
      })}
    </>
  );
}
