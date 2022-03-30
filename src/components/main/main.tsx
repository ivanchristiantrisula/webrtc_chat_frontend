import { Grid, Paper, Box, createStyles, Theme } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Friendlist from "./Friendlist/friendlist";
import _, { keys, omit } from "underscore";
import Peer from "simple-peer";
import PrivateChat from "./PrivateChat/privatechat";
import { makeStyles } from "@material-ui/styles";
import SearchUser from "./SearchUser/searchuser";
import axios from "axios";
import ChatList from "./Chatlist/ChatList";
import { useSnackbar } from "notistack";
import Meeting from "./Meeting/";
import AlertDialog from "./AlertDialog";
import FriendFinder from "./FindFriend";
import FindFriend from "./FindFriend";
import Profile from "./Profile/";
import streamSaver from "streamsaver";
import { useHistory } from "react-router";
import {
  getToken,
  getUserChatHistory,
  getUserInfo,
  setUserChatHistory,
} from "../../helper/localstorage";

const io = require("socket.io-client");
require("dotenv").config();

const worker = new Worker("../worker.js");

//import Peer from "simple-peer";

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    display: "none",
  },

  root: {
    minHeight: "100vh",
    minWidth: "100wh",
    maxHeight: "100vh",
    maxWidth: "100wh",

    backgroundColor: theme.palette.primary.main,
  },

  sidebar: {
    backgroundColor: theme.palette.primary.main,
  },

  midContainer: {
    backgroundColor: "white",
    width: "25rem",
    borderRadius: "1rem 0rem 0rem 1rem",
    borderColor: "transparent",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
    overflowY: "auto",
  },

  chatContainer: {
    backgroundColor: "white",
    borderRadius: "0rem 1rem 1rem 0rem",
    marginRight: "0.5rem",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
    borderLeft: "solid #d7d9d7 1px",
  },

  meeting: {
    backgroundColor: "white",
    borderRadius: "1rem 1rem 1rem 1rem",
    marginRight: "0.5rem",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
    overflowY: "auto",
  },

  findfriend: {
    backgroundColor: "white",
    width: "20rem",
    borderRadius: "0rem 1rem 1rem 1rem",
    marginRight: "0.5rem",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
    overflowY: "scroll",
  },

  personalitytest: {
    backgroundColor: "white",
    borderRadius: "1rem 1rem 1rem 1rem",
    marginRight: "0.5rem",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
  },

  profile: {
    backgroundColor: "white",
    borderRadius: "1rem 1rem 1rem 1rem",
    marginRight: "0.5rem",
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
  },
}));

const initState = {
  meetingProps: {
    open: false,
    title: "",
    body: "",
    positiveTitle: "",
    negativeTitle: "",
    fromSocket: "",
  },
};

const App = () => {
  const history = useHistory();
  let [allUsers, setAllUsers] = useState({});
  let socket: any = useRef();
  let [meetingData, setMeetingData] = useState<{
    id: string;
    isPrivate: boolean;
  }>();
  const [userSocketID, setUserSocketID] = useState("");
  const [friends, setFriends] = useState([]);
  let [socketConnection, setSocketConnection] = useState(false);
  let [openChatSocket, setOpenChatSocket] = useState("");
  let peers: any = useRef({});
  let [chats, setChats] = useState({});
  let [chatConnectionStatus, setChatConnectionStatus] = useState([]);
  let [openMenu, setOpenMenu] = useState("friendlist");
  let [onlineFriends, setOnlineFriends] = useState({});
  let [meetingMode, setMeetingMode] = useState(false);
  //let [meetingID, setMeetingID] = useState("");
  let [onPrivateCall, setOnPrivateCall] = useState(false);
  let fileTransfers = useRef({});
  let [stringifiedChats, setStringifiedChats] = useState("");

  let [alertDialogProps, setAlertDialogProps] = useState(
    initState.meetingProps
  );

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    checkWebRTCSupport();
    fetchUserFriends();
    initSocketListener();
    loadChatFromDB();
  }, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(
      () => findIntersectBetweenOnlineUsersAndFriends(),
      500
    );

    return () => clearTimeout(delayDebounceFn);
  }, [allUsers, friends]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!_.isEmpty({ ...chats })) {
        saveChatToDB();
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [chats]);

  const checkWebRTCSupport = () => {
    if (!Peer.WEBRTC_SUPPORT) {
      alert(
        "Browser has no WebRTC support. Please update your browser or use compatible browser. See : https://en.wikipedia.org/wiki/WebRTC"
      );
      history.push("/");
    }
  };

  const checkCurrentOpenChatSocketUserWentOffline = (users: any) => {
    if (users[openChatSocket] === undefined) {
      setOpenChatSocket("");
    }
  };

  const saveChatToDB = () => {
    setUserChatHistory({ ...chats });
  };

  const loadChatFromDB = () => {
    setChats(getUserChatHistory());
  };

  const initSocketListener = () => {
    socket.current = io.connect(process.env.REACT_APP_BACKEND_URI, {
      query: `token=${getToken()}`,
    });

    socket?.current?.on("connect", () => {
      console.info("Connected to signalling server");
      enqueueSnackbar(`Connected to signalling server!`, {
        variant: "info",
      });
      setSocketConnection(true);
    });

    socket?.current?.on("yourID", (id: string) => {
      console.info("User Socket ID : " + id);
      setUserSocketID(id);
    });
    socket?.current?.on("allUsers", (users: any) => {
      console.info("Fetched all users");
      checkCurrentOpenChatSocketUserWentOffline(users);
      setAllUsers(users);
    });

    socket?.current?.on("disconnect", () => {
      setSocketConnection(false);
      console.info("Disconnected from signalling server");
      enqueueSnackbar(`Disconnected from signalling server!`, {
        variant: "error",
      });
    });

    socket.current.on("duplicateLogin", () => {
      setSocketConnection(false);
      console.info("Duplicate login. Disconnecting...");
      enqueueSnackbar(`Someone with your account is already logged in`, {
        variant: "error",
      });

      history.push("/");
    });

    socket.current.on("sdpTransfer", handleReceivingSDP);

    socket.current.on("meetingInvitation", handleReceivingMeetingInvitation);

    socket.current.on("joinMeetingByIDDenied", () => {
      enqueueSnackbar(`Meeting code not found`, {
        variant: "error",
      });
    });

    socket.current.on("joinMeetingByIDApproved", (data: any) => {
      //setMeetingID(data.code);
      setMeetingData({
        id: data.code,
        isPrivate: false,
      });
      setOpenMenu("meeting");
      setMeetingMode(true);
    });

    socket.current.on("meetingID", (data: any) => {
      //setMeetingID(data.id);
      setMeetingData({
        id: data.id,
        isPrivate: data.private,
      });
      setMeetingMode(true);
      setOpenMenu("meeting");
    });

    socket.current.on("addToFriendlist", (newFriend: any) => {
      setFriends([...friends, newFriend]);
      enqueueSnackbar(`${newFriend.name} accepted your friend request!`, {
        variant: "info",
      });
    });

    socket.current.on("checkFriendInvitations", (data: { name: string }) => {
      enqueueSnackbar(`${data.name} sent you a friend request!`, {
        variant: "info",
      });
    });

    socket.current.on("removeFromFriendlist", (userData: any) => {
      // enqueueSnackbar(`${userData.name} removed you from their friendlist!`, {
      //   variant: "info",
      // });
      let x = { ...onlineFriends };
      x = Object.keys(x).filter((key) => x[key].id !== userData.id);
      setOnlineFriends(x);
    });

    //close socket connection when tab is closed by user
    window.onbeforeunload = function () {
      socket.current.onclose = function () {}; // disable onclose handler first
      socket.current.close();
    };
  };

  const handleReceivingSDP = (data: any) => {
    if (peers.current[data.from] !== undefined) {
      peers.current[data.from].signal(data.signal);
    } else {
      //set as receiver
      addPeer(data.from, false);
      peers.current[data.from].signal(data.signal);
    }
  };

  const handleReceivingMeetingInvitation = (data: any) => {
    setMeetingData({
      id: data.meetingID,
      isPrivate: data.purpose == "private" ? true : false,
    });

    if (data.purpose == "meeting") {
      setAlertDialogProps({
        open: true,
        title: "You are invited to join a meeting",
        body: `${data.senderInfo.name} invited you to join their meeting.`,
        positiveTitle: "Join meeting",
        negativeTitle: "Decline Meeting",
        fromSocket: data.from,
      });
    } else {
      setAlertDialogProps({
        open: true,
        title: `Incoming Call`,
        body: `${data.senderInfo.name} is calling you`,
        positiveTitle: "Accept",
        negativeTitle: "Reject",
        fromSocket: data.from,
      });
    }
  };

  const addPeer = (socketid: string, isInitiator: boolean) => {
    peers.current[socketid] = new Peer({
      initiator: isInitiator,
      trickle: true,
      config: {
        iceServers: [
          { urls: ["stun:stun.ivanchristian.me"] },
          { urls: ["stun:stun1.l.google.com:19302"] },
          {
            username: "ivan",
            credential: "5521",
            urls: ["turn:turn.ivanchristian.me"],
          },
        ],
      },
    });

    peers.current[socketid].on("signal", (data: any) => {
      //console.log(data);
      socket.current.emit("transferSDP", {
        signal: data,
        to: socketid,
        from: userSocketID,
      });
    });

    peers.current[socketid].on("data", (data: any) => {
      let dataType = "";
      if (Buffer.isBuffer(data)) dataType = "buffer";
      if (typeof data === "string") dataType = "string";

      const isJsonParsable = (x: Buffer) => {
        try {
          JSON.parse(x.toString());
        } catch (e) {
          return false;
        }
        return true;
      };

      if (isJsonParsable(data)) {
        data = JSON.parse(data.toString());
        if (data.type === "file") {
          if (data.done) {
            let x = chats;
            if (x[data.senderInfo.id] === undefined) {
              x[data.senderInfo.id] = new Array(data);
            } else {
              x[data.senderInfo.id].push(data);
            }
            setChats({ ...x });
            download(socketid, data.name);
          }
        } else if (data.type === "text") {
          let parsedData = data;
          if (parsedData.kind) {
            let x = chats;
            try {
              x[parsedData.senderInfo.id].push(parsedData);
            } catch (error) {
              x[parsedData.senderInfo.id] = new Array(parsedData);
            }

            setChats({ ...x });
          }
          enqueueSnackbar(
            `${parsedData.senderInfo.name} \n ${parsedData.message}`,
            {
              variant: "success",
            }
          );
        }
      } else {
        //IF DATA ISNT PARSEABLE, THEN IT HAS TO BE ARRAY BUFFER
        if (fileTransfers.current[socketid] === undefined)
          //CHECK IF SERVICE WORKER IS AVAILABLE FOR THIS PEER
          fileTransfers.current[socketid] = new Worker("../worker.js"); //CREATE NEW SERVICE WORKER TO RECEIVE ARRAY BUFFER

        fileTransfers.current[socketid].postMessage(
          new Uint8Array(data).buffer //convert buffer to arraybuffer then passes it to worker
        );
      }
    });

    peers.current[socketid].on("connect", () => {
      // wait for 'connect' event before using the data channel
      let temp = { ...chatConnectionStatus };
      temp[socketid] = 2;
      setChatConnectionStatus(temp);
    });
  };

  const download = (socketid: string, name: string) => {
    //setGotFile(false);
    fileTransfers.current[socketid].postMessage("download");
    fileTransfers.current[socketid].addEventListener(
      "message",
      (event: any) => {
        const stream = event.data.stream();
        const fileStream = streamSaver.createWriteStream(name);
        stream.pipeTo(fileStream);
      }
    );
    delete fileTransfers.current[socketid];
  };

  const startPeerConnection = (socketRecipient: string) => {
    if (peers.current[socketRecipient] === undefined) {
      addPeer(socketRecipient, true);
    }
    setOpenChatSocket(socketRecipient);
  };

  const addChatFromSender = (data: any, sid?: any) => {
    //console.log(data);
    let user = getUserInfo();
    let id = sid;
    if (!sid) {
      id = allUsers[openChatSocket].id;
    }

    let x = chats;
    if (x[id] === undefined) {
      x[id] = new Array(data);
    } else {
      x[id].push(data);
    }
    setChats({ ...x });
  };

  const fetchUserFriends = () => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URI
        }/user/getFriends?token=${getToken()}`
      )
      .then((res) => {
        let allFriends: [] = res.data;
        setFriends([...allFriends]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const findIntersectBetweenOnlineUsersAndFriends = () => {
    let intersectsA = Object.keys(allUsers).filter((a: any) => {
      return friends.some((b: any) => {
        return b.id == allUsers[a].id;
      });
    });

    let intersectsB = {};

    intersectsA.forEach((sid: any) => {
      let user = allUsers[sid];
      intersectsB[sid] = user;
    });

    setOnlineFriends(intersectsB);
  };

  const forwardChat = (payload: any, sid: string) => {
    //check if user is already connected with target peer
    if (peers.current[sid] !== undefined) {
      peers.current[sid].send(Buffer.from(JSON.stringify(payload)));
    } else {
      //wait until target peer is successfuly connected, then forward the chat
      startPeerConnection(sid);
      peers.current[sid].on("connect", () => {
        peers.current[sid].send(Buffer.from(JSON.stringify(payload)));
      });
    }
    addChatFromSender(payload, sid);
  };

  const handleMeetingInviteAccepted = (targetSID: string) => {
    socket.current.emit("respondMeetingInvitation", {
      response: true,
      to: targetSID,
      meetingID: meetingData.id,
    });
    setOpenMenu("meeting");
    setMeetingMode(true);
  };

  const handleMeetingInviteDeclined = (targetSID: string) => {
    socket.current.emit("respondMeetingInvitation", {
      response: false,
      to: targetSID,
      meetingID: meetingData.id,
    });
    //setMeetingID("");
  };

  const endMeeting = () => {
    setMeetingMode(false);
    //setMeetingID("");

    //TEMP FIX
    //TODO : FIX LEAVE MEETING BUG
    window.location.reload();
  };

  const handleUnfriend = () => {
    loadChatFromDB();
    fetchUserFriends();
  };

  return (
    <>
      <Box className={classes.root}>
        <Grid container justify="center" style={{ height: "100vh" }}>
          <Grid style={{ width: "5rem" }} item className={classes.sidebar}>
            <Sidebar
              openMenu={(menu: string) => {
                setOpenMenu(menu);
              }}
              user={allUsers[userSocketID]}
            />
          </Grid>
          <Grid
            item
            className={`${classes.midContainer} ${
              openMenu != "friendlist" ? classes.hidden : ""
            }`}
          >
            <Friendlist
              users={onlineFriends}
              userID={userSocketID}
              setPrivateChatTarget={(e: any) => startPeerConnection(e)}
              handleUnfriend={handleUnfriend}
              socket={socket.current}
            />
          </Grid>
          <Grid
            item
            className={`${classes.midContainer} ${
              openMenu != "chatlist" ? classes.hidden : ""
            }`}
          >
            <ChatList
              users={allUsers}
              userID={userSocketID}
              setPrivateChatTarget={(e: any) => startPeerConnection(e)}
              chats={{ ...chats }}
              updateChats={loadChatFromDB}
            />
          </Grid>
          {openMenu == "searchUser" ? (
            <Grid item className={classes.midContainer}>
              <SearchUser
                refreshFriendlist={fetchUserFriends}
                socket={socket.current}
              />
            </Grid>
          ) : (
            ""
          )}
          {openMenu == "meeting" || meetingMode ? (
            <Grid
              item
              xs
              className={`${classes.meeting} ${
                openMenu != "meeting" ? classes.hidden : ""
              }`}
            >
              <Meeting
                friends={onlineFriends}
                socket={socket.current}
                userSocketID={userSocketID}
                meetingData={meetingData}
                meetingMode={meetingMode}
                handleNewMeeting={(id: string) => {}}
                endMeeting={endMeeting}
              />
            </Grid>
          ) : (
            ""
          )}
          {openMenu == "findfriend" || openMenu == "personalitytest" ? (
            <Grid
              item
              xs={openMenu == "personalitytest"}
              className={
                openMenu == "findfriend"
                  ? classes.midContainer
                  : classes.personalitytest
              }
            >
              <FindFriend />
            </Grid>
          ) : null}

          {openMenu == "profile" ? (
            <Grid item xs className={classes.profile}>
              <Profile user={allUsers[userSocketID]} socket={socket.current} />
            </Grid>
          ) : null}

          <Grid
            item
            xs
            className={`${classes.chatContainer} ${
              openMenu == "meeting" ||
              openMenu == "personalitytest" ||
              openMenu == "profile"
                ? classes.hidden
                : ""
            }`}
          >
            {openChatSocket != "" ? (
              <PrivateChat
                userSocketID={userSocketID}
                recipientSocketID={openChatSocket}
                peer={peers.current[openChatSocket]}
                socket={socket.current}
                chat={chats[allUsers[openChatSocket].id]}
                addChatFromSender={(data: any) => {
                  addChatFromSender(data);
                }}
                users={allUsers}
                onlineFriends={onlineFriends}
                sendForward={forwardChat}
                myInfo={allUsers[userSocketID]}
                allowForCall={!meetingMode}
              />
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Box>
      <AlertDialog
        open={alertDialogProps.open}
        title={alertDialogProps.title}
        body={alertDialogProps.body}
        posActionButtonName={alertDialogProps.positiveTitle}
        negActionButtonName={alertDialogProps.negativeTitle}
        onPosClicked={() => {
          setAlertDialogProps(initState.meetingProps);
          handleMeetingInviteAccepted(alertDialogProps.fromSocket);
        }}
        onNegClicked={() => {
          setAlertDialogProps(initState.meetingProps);
          handleMeetingInviteDeclined(alertDialogProps.fromSocket);
        }}
        handleClose={() => setAlertDialogProps(initState.meetingProps)}
      />
    </>
  );
};

export default App;
