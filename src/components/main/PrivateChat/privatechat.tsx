import { useEffect, useState, useRef, useCallback } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import BottomBar from "./bottomBar";
import ChatBubble from "../ChatBubble/ChatBubble";
import TopBar from "./topbar";
import { Socket } from "dgram";
import UserPicker from "../UserPicker";
import _ from "underscore";
import ReplyCard from "./replyCard";
import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";
import Report from "../Report";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { getUserInfo } from "../../../helper/localstorage";

const useStyle = makeStyles(() =>
  createStyles({
    root: {
      minHeight: "100%",
      height: "100%",
      width: "100%",
      maxHeight: "100vh",
    },
    topBar: {
      width: "100%",
      minWidth: "100%",
    },
    chatArea: {
      marginTop: "1rem",
      marginLeft: "1rem",
      marginRight: "1rem",
      overflowY: "auto",
      overflowX: "hidden",
    },
    chatContainer1: {
      width: "100%",
    },

    replyCard: {
      height: "50px",
      width: "100%",
    },
    bottomBar: {
      bottom: "0px",
    },

    noDisplay: {
      display: "none",
    },
  })
);

interface propsInterface {
  userSocketID: string;
  recipientSocketID: string;
  peer: any;
  socket: any;
  chat: any;
  addChatFromSender: Function;
  users: any;
  sendForward: Function;
  myInfo: any;
  onlineFriends: any;
  allowForCall: boolean;
}

export default (props: propsInterface) => {
  const classes = useStyle();

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    handleFileUpload(acceptedFiles[0]);
  }, []);
  const [chat, setChat] = useState<any[]>([]);
  const [videoCall, setVideoCall] = useState(false);
  const [openUserPickerModal, setOpenUserPickerModal] = useState(false);
  const [replyChat, setReplyChat] = useState({});
  const [reportChat, setReportChat] = useState<any>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });
  const [userID, setUserID] = useState(getUserInfo().id);

  //let [forwardChat, setForwardChat] = useState({});
  const worker = new Worker("../worker.js");
  let forwardChat = useRef({});

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    props.socket.on("startVideoCall", () => {
      startVideoCall(false);
    });

    props.socket.on("endVideoCall", () => {});
  }, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  const sendChatText = (text: string) => {
    let payload = {
      senderInfo: props.myInfo,
      from: props.userSocketID,
      kind: "direct", //direct,forward,quote TODO : GANTI KIND JADI SOURCE
      type: "text",
      message: text,
      timestamp: new Date(),
    };
    if (_.isEmpty(replyChat)) {
      payload["reply"] = null;
    } else {
      payload["reply"] = replyChat;
      setReplyChat({});
    }
    //setChat([...chat, payload]);
    props.addChatFromSender(payload);
    props.peer.send(Buffer.from(JSON.stringify(payload)));
  };

  const startVideoCall = (isInitiator: boolean) => {
    // setVideoCall(true);

    // if (isInitiator)
    //   props.socket.emit("startVideoCall", { to: props.recipientSocketID });
    if (!props.allowForCall) {
      enqueueSnackbar(`Can't start a call while in meeting!`, {
        variant: "error",
      });
      return;
    }
    props.socket.emit("requestNewRoom", {
      invitedUser: props.recipientSocketID,
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploadingFile(true);

    const MAXIMUM_CHUNK_SIZE = 16 * 1024; //WEBRTC only allows max 16kb buffer size
    const peer = props.peer;
    enqueueSnackbar(
      `Uploading file to ${
        props.users[props.recipientSocketID].name
      } \n ${formatBytes(file.size)}`,
      {
        variant: "info",
        persist: false,
      }
    );

    const arrayBuffer = await file.arrayBuffer();
    for (let i = 0; i < arrayBuffer.byteLength; i += MAXIMUM_CHUNK_SIZE) {
      peer.write(Buffer.from(arrayBuffer.slice(i, i + MAXIMUM_CHUNK_SIZE))); //split file to smaller chunk size then send it
    }

    //send chat info after file upload finished
    peer.write(
      JSON.stringify({
        type: "file",
        done: true,
        name: file.name,
        fileType: file.type || "file/other",
        senderInfo: props.myInfo,
        from: props.userSocketID,
        kind: "direct",
        timestamp: new Date(),
        size: formatBytes(file.size),
      })
    );

    props.addChatFromSender({
      senderInfo: props.myInfo,
      from: props.userSocketID,
      kind: "direct", //direct,forward,quote TODO : GANTI KIND JADI SOURCE
      type: file.type,
      name: file.name,
      timestamp: new Date(),
      file: file,
      size: formatBytes(file.size),
    });

    setIsUploadingFile(false);

    function formatBytes(bytes: number, decimals = 1) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
  };

  const handleForward = (chat: any, targetSID: any) => {
    //alert("forward msg");
    setOpenUserPickerModal(true);
    forwardChat.current = chat;
  };

  const handleReply = (chat: any, targetSID: any) => {
    setReplyChat(chat);
  };

  const handleReport = (chat: any, idx: number) => {
    let chats = [];
    let targetUID = props.users[props.recipientSocketID].id;

    //get previous and afterward the reported message so admin can get better context about the whole situation
    props.chat[idx - 1] !== undefined ? chats.push(props.chat[idx - 1]) : null;

    if (props.chat[idx] !== undefined) {
      //mark as reported
      let a = props.chat[idx];
      a.isReported = true;
      chats.push(a);
    }

    props.chat[idx + 1] !== undefined ? chats.push(props.chat[idx + 1]) : null;

    //replace socket id with user id
    chats.forEach((element) => {
      //console.log(element);
      if (element.from === props.userSocketID) {
        element.from = props.myInfo.id;
      } else {
        element.from = targetUID;
      }
    });

    setReportChat({
      target: props.recipientSocketID,
      targetUID: targetUID,
      chat: chats,
      idx: idx,
    });
  };

  const sendForward = (users: {}) => {
    for (const key in users) {
      let payload = forwardChat.current;
      payload["origin"] = payload["from"];
      payload["from"] = props.userSocketID;
      payload["senderInfo"] = props.myInfo;

      props.sendForward(payload, key);
    }

    setOpenUserPickerModal(false);
  };
  const renderReplyCard = () => {
    if (!_.isEmpty(replyChat)) {
      return (
        <Box order={3} className={classes.replyCard}>
          <ReplyCard chat={replyChat} />
        </Box>
      );
    }
    return;
  };
  return (
    <div className={classes.root} {...getRootProps()}>
      <Box
        display="flex"
        className={`${classes.root} ${videoCall ? classes.noDisplay : null}`}
        flexDirection="column"
      >
        <Box order={1} className={classes.topBar}>
          <TopBar
            startVideoCall={() => {
              startVideoCall(true);
            }}
            user={props.users[props.recipientSocketID]}
          />
        </Box>
        <Box order={2} className={classes.chatArea} flexGrow={1}>
          <div className={classes.chatContainer1}>
            {props.chat !== undefined ? (
              <>
                {props.chat.map(function (obj: any, idx: number) {
                  return (
                    <ChatBubble
                      data={obj}
                      userID={userID}
                      handleReply={handleReply}
                      handleForward={handleForward}
                      handleReport={(chat: any) => handleReport(chat, idx)}
                    />
                  );
                })}
              </>
            ) : null}
          </div>
        </Box>
        {renderReplyCard()}
        <Box order={4} className={classes.bottomBar}>
          <BottomBar
            handleSendText={(e: string) => {
              sendChatText(e);
            }}
            handleFileUpload={(file: File) => {
              handleFileUpload(file);
            }}
            isUploadingFile={isUploadingFile}
          />

          <input type="file" hidden {...getInputProps()} />
        </Box>
      </Box>
      <UserPicker
        isOpen={openUserPickerModal}
        users={props.onlineFriends}
        onPickedUser={sendForward}
        multipleUser={true}
        title="Foward"
        handleClose={() => setOpenUserPickerModal(false)}
      />

      <Report
        open={!_.isEmpty(reportChat)}
        chat={reportChat ? reportChat.chat : {}}
        targetUID={reportChat ? reportChat.targetUID : ""}
        closeDialog={() => setReportChat(null)}
      />
    </div>
  );
};
