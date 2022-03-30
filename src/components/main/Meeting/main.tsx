import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker";
import _ from "underscore";
import { Box, createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import BottomBar from "./bottombar";
import { Socket } from "socket.io-client";
import Whiteboard from "./Whiteboard/whiteboard";
import { useSnackbar } from "notistack";
import { isSafari } from "react-device-detect";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
    },

    videoArea: {
      minWidth: "100%",
      height: "93%",
      alignItems: "center",
      justifyContent: "center",
    },
    video: {
      width: "100%",
      height: "auto",
    },

    vidContainer: {
      minWidth: "49%",
      maxWidth: "99%",
      height: "auto",
    },

    bottomBar: {
      height: "7%",
      width: "100%",
      backgroundColor: "white",
    },

    userVidContainer: {
      marginTop: "20px",
      marginRight: "20px",
      textAlign: "right",
    },

    userVid: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    noDisplay: {
      display: "none",
    },
  })
);

const Video = (props: { peer: any }) => {
  const ref = useRef<HTMLVideoElement>();
  const classes = useStyle();

  const [isConnectionAlive, setIsConnectionAlive] = useState(true);

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });

    props.peer.on("close", () => {
      setIsConnectionAlive(false);
    });
  }, []);

  const handleDoubleClick = () => {
    try {
      if (isSafari) {
        // @ts-ignore
        ref.current.webkitRequestFullscreen();
      } else {
        ref.current.requestFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isConnectionAlive ? (
        <Box className={classes.vidContainer}>
          <video
            className={classes.video}
            autoPlay
            ref={ref}
            onDoubleClick={handleDoubleClick}
          />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default (props: {
  friends: any;
  socket: Socket;
  userSocketID: string;
  meetingID: string;
  endMeeting: Function;
  isPrivate: boolean;
}) => {
  const classes = useStyle();
  let peersRef = useRef({});
  let myStreamRef = useRef<any>();
  let screenShareRef = useRef<MediaStream>();
  let whiteboardRef = useRef();
  let userSocketsRef = useRef([]);
  const [openUserPicker, setOpenUserPicker] = useState(false);
  const [userSockets, setUserSockets] = useState([]);
  const [myStream, setMyStream] = useState<any>({});
  const [isScreensharing, setIsScreensharing] = useState(false);
  const [focusedOn, setFocusedOn] = useState("");
  const [whiteboardMode, setWhiteboardMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [participantsInfo, setParticipantsInfo] = useState([]);
  //const [streams, setStreams] = useState([]);

  useEffect(() => {
    props.socket.on("meetingInvitationResponse", (response: boolean) => {
      //do something when user has responed meeting invitation
    });

    props.socket.on("meetingMembers", (data: any) => {
      //remove user socket
      data.sockets.splice(
        data.sockets.findIndex((x: any) => x == props.userSocketID),
        1
      );

      //connect to everyone
      data.sockets.forEach((socket: any) => {
        peersRef.current[socket] = createPeer(socket, true);
      });

      setUserSockets([...data.sockets]);
      userSocketsRef.current = data.sockets;
      setParticipantsInfo(data.userDatas);

      //check if user just created the room

      if (data.sockets.length === 0 && !props.isPrivate) {
        data.sockets.length === 0 && setOpenUserPicker(true);
      }
    });

    props.socket.on("newMeetingMember", ({ sid, userData }) => {
      peersRef.current[sid] = null;
      if (props.isPrivate) {
        enqueueSnackbar(`${userData.name} accepted your call`, {
          variant: "info",
        });
      } else {
        enqueueSnackbar(`${userData.name} has joined this meeting`, {
          variant: "info",
        });
      }
      let x = participantsInfo;
      x.push(userData);
      setParticipantsInfo(x);
    });

    props.socket.on("meetingSDPTransfer", (data: any) => {
      if (data.from !== data.to) {
        if (
          peersRef.current[data.from] === null ||
          peersRef.current[data.from] === undefined
        ) {
          peersRef.current[data.from] = createPeer(data.from, false);
          setUserSockets((old) => [...old, data.from]);
          userSocketsRef.current.push(data.from);
        }
        peersRef.current[data.from].signal(data.signal);
      }
    });

    props.socket.on("removeMeetingPeer", ({ socketID, userData }) => {
      removeMeetingMemberSocket(socketID);

      setParticipantsInfo([
        ...participantsInfo.filter((user) => user.id != userData.id),
      ]);
    });

    props.socket.on("screenshareMode", ({ sid, status }) => {
      status ? setFocusedOn(sid) : setFocusedOn("");
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((x: MediaStream) => {
        x.getAudioTracks()[0].enabled = false;
        setMyStream(x);
        myStreamRef.current.srcObject = x;
      })
      .catch((err) => {
        console.error(err);
        alert("Failed accessing media device.");
        window.location.reload();
      })
      .finally(() => {
        requestMeetingMembers();
      });
  }, []);

  useEffect(() => {
    props.socket.emit("notifyScreenSharing", {
      roomID: props.meetingID,
      status: isScreensharing,
    });
  }, [isScreensharing]);

  const removeMeetingMemberSocket = (sid: string) => {
    userSocketsRef.current = userSocketsRef.current.splice(
      userSocketsRef.current.findIndex((x) => x == sid),
      1
    );
    // console.log(userSocketsRef.current);
    // setUserSockets([...userSocketsRef.current]);
  };

  const requestMeetingMembers = () => {
    props.socket.emit("requestMeetingMembers", props.meetingID);
  };

  const createPeer = (socketID: string, isInitiator: boolean) => {
    let peer = new Peer({
      initiator: isInitiator,
      trickle: true,
      config: {
        iceServers: [
          { urls: ["stun:stun.ivanchristian.me"] },
          {
            username: "ivan",
            credential: "5521",
            urls: ["turn:turn.ivanchristian.me"],
          },
        ],
      },
      stream: myStreamRef.current.srcObject,
    });

    peer.on("signal", (data: any) => handleReceivingSignal(data, socketID));

    peer.on("connect", (data: any) => {
      //do somtheing when connected
      // let name =
      //   props.friends[socketID].name !== undefined
      //     ? props.friends[socketID].name
      //     : "unknown";
      // enqueueSnackbar(
      //   `Peer-to-peer connection with ${name} has been established!`,
      //   {
      //     variant: "info",
      //   }
      // );
    });

    peer.on("error", () => {
      //try reconnect
      let name =
        props.friends[socketID].name !== undefined
          ? props.friends[socketID].name
          : "unknown";
      enqueueSnackbar(
        `Peer-to-peer connection with ${name} has encountered an error. Attempting to reconnect...`,
        {
          variant: "info",
        }
      );
      peersRef.current[socketID] = createPeer(socketID, isInitiator);
    });

    return peer;
  };

  const handleReceivingSignal = (data: any, socketID: String) => {
    props.socket.emit("transferSDPMeeting", {
      signal: data,
      to: socketID,
      from: props.userSocketID,
    });
  };

  const isUserAlone = () => {
    // if (userSockets.length < 1) {
    //   return true;
    // }
    // return false;
  };

  const isMeetingAdmin = () => {
    //userSockets.length == 0 ? true : false;
  };

  const inviteUser = (users: {}) => {
    setOpenUserPicker(false);
    for (const key in users) {
      if (Object.prototype.hasOwnProperty.call(users, key)) {
        const element = users[key];

        props.socket.emit("inviteUserToMeeting", {
          to: key,
          meetingID: props.meetingID,
        });
      }
    }
  };

  const leaveMeeting = () => {
    props.socket.emit("leaveMeeting", { meetingID: props.meetingID });
    Object.keys(peersRef.current).forEach((element: any) => {
      if (peersRef.current[element]) {
        peersRef.current[element].destroy();
      }
    });
    myStreamRef.current.srcObject
      .getTracks()
      .forEach((track: MediaStreamTrack) => {
        if (track.readyState == "live") {
          track.stop();
        }
      });
    props.endMeeting();
  };

  const toggleVideo = () => {
    myStreamRef.current.srcObject.getVideoTracks()[0].enabled =
      !myStreamRef.current.srcObject.getVideoTracks()[0].enabled;
  };

  const toggleAudio = () => {
    myStreamRef.current.srcObject.getAudioTracks()[0].enabled =
      !myStreamRef.current.srcObject.getAudioTracks()[0].enabled;
  };

  const toggleScreenShare = () => {
    if (!isScreensharing) {
      navigator.mediaDevices
        //@ts-ignore
        .getDisplayMedia({ audio: false, video: true })
        .then((stream: MediaStream) => {
          screenShareRef.current = stream;
          setIsScreensharing(true);
          Object.keys(peersRef.current).forEach((element: any) => {
            if (peersRef.current[element] !== null) {
              peersRef.current[element].replaceTrack(
                peersRef.current[element].streams[0].getVideoTracks()[0],
                stream.getVideoTracks()[0],
                myStreamRef.current.srcObject
              );
            }
          });

          stream.getVideoTracks()[0].onended = () => endScreenShare();
        })
        .catch(() => {});
    } else {
      endScreenShare();
    }
  };

  const endScreenShare = () => {
    if (!isScreensharing) return;
    screenShareRef.current.getVideoTracks()[0].stop();
    Object.keys(peersRef.current).forEach((element: any) => {
      if (peersRef.current[element] !== null) {
        peersRef.current[element].replaceTrack(
          peersRef.current[element].streams[0].getVideoTracks()[0],
          myStreamRef.current.srcObject.getVideoTracks()[0],
          myStreamRef.current.srcObject
        );
      }
    });
    setIsScreensharing(false);
  };

  const toggleWhiteboard = () => {
    if (whiteboardMode) {
      endWhiteboard();
    }
    setWhiteboardMode(!whiteboardMode);
  };

  const startWhiteboard = (stream: MediaStream) => {
    Object.keys(peersRef.current).forEach((element: any) => {
      if (peersRef.current[element] !== null) {
        peersRef.current[element].replaceTrack(
          peersRef.current[element].streams[0].getVideoTracks()[0],
          stream.getVideoTracks()[0],
          myStreamRef.current.srcObject
        );
      }
    });
  };

  const endWhiteboard = () => {
    Object.keys(peersRef.current).forEach((element: any) => {
      if (peersRef.current[element] !== null) {
        peersRef.current[element].replaceTrack(
          peersRef.current[element].streams[0].getVideoTracks()[0],
          myStreamRef.current.srcObject.getVideoTracks()[0],
          myStreamRef.current.srcObject
        );
      }
    });
  };

  return (
    <>
      <Box display="flex" flexDirection="column" className={classes.root}>
        <Box
          className={`${classes.videoArea} ${
            whiteboardMode ? classes.noDisplay : null
          }`}
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
        >
          {userSockets.map((socketID, i) => {
            return <Video peer={peersRef.current[socketID]} key={i} />;
          })}
          <Box
            width="300px"
            height="150px"
            className={classes.userVidContainer}
            position="fixed"
            top="0"
            right="0"
          >
            <video
              className={classes.userVid}
              playsInline
              //ref={(stream) => (streams.current[0] = stream)}
              ref={myStreamRef}
              autoPlay
              muted
            />
          </Box>
        </Box>

        {whiteboardMode ? (
          <Box
            width="100%"
            height="100%"
            className={!whiteboardMode ? classes.noDisplay : ""}
          >
            <Whiteboard handleCaptureStream={startWhiteboard} />
          </Box>
        ) : null}
        <Box className={classes.bottomBar} position="fixed" bottom="0" left="0">
          <BottomBar
            meetingID={props.meetingID}
            isPrivate={props.isPrivate}
            handleLeaveMeeting={leaveMeeting}
            handleInviteUser={() => setOpenUserPicker(true)}
            handleMuteVideo={toggleVideo}
            handleMuteAudio={toggleAudio}
            handleScreenShare={toggleScreenShare}
            handleWhiteboard={toggleWhiteboard}
            whiteboardMode={whiteboardMode}
            sceensharingMode={isScreensharing}
            users={participantsInfo}
          />
        </Box>
      </Box>

      <UserPicker
        isOpen={openUserPicker}
        title={"Invite to meeting"}
        multipleUser={true}
        users={props.friends}
        onPickedUser={inviteUser}
        handleClose={() => setOpenUserPicker(false)}
      />
    </>
  );
};
