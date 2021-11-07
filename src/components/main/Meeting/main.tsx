import { useRef, useState, useEffect } from "react";
import Peer, { SimplePeerData } from "simple-peer";
import UserPicker from "../UserPicker";
import _ from "underscore";
import { Box, createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import React from "react";
import BottomBar from "./bottombar";
import { Socket } from "socket.io-client";
import Whiteboard from "./whiteboard";
import { useSnackbar } from "notistack";
import SimplePeer from "simple-peer";
// @ts-ignore

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
  const ref = useRef<any>();
  const classes = useStyle();

  useEffect(() => {
    //console.log(props.peer);
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video className={classes.video} playsInline autoPlay ref={ref} />;
};

export default (props: {
  friends: any;
  socket: Socket;
  userSocketID: string;
  meetingID: string;
  endMeeting: Function;
}) => {
  const classes = useStyle();
  let peersRef = useRef({});
  let myStreamRef = useRef<any>();
  let screenShareRef = useRef<MediaStream>();
  let whiteboardRef = useRef();
  const [openUserPicker, setOpenUserPicker] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState({});
  const [userSockets, setUserSockets] = useState([]);
  const [userStreamStatus, setUserStreamStatus] = useState(false);
  const [myStream, setMyStream] = useState<any>({});
  const [peers, setPeers] = useState([]);
  const [isScreensharing, setIsScreensharing] = useState(false);
  const [focusedOn, setFocusedOn] = useState("");
  const [whiteboardMode, setWhiteboardMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  //const [streams, setStreams] = useState([]);

  useEffect(() => {
    props.socket.on("meetingInvitationResponse", (response: boolean) => {
      //do something when user has responed meeting invitation
    });

    props.socket.on("meetingMembers", (data: []) => {
      data.splice(
        data.findIndex((x) => x == props.userSocketID),
        1
      );
      //alert(data.length);

      //connect to everyone
      data.forEach((socket: any) => {
        peersRef.current[socket] = createPeer(socket, true);
      });

      setUserSockets(data);

      //check if user just created the room
      data.length === 0 && setOpenUserPicker(true);
    });

    props.socket.on("newMeetingMember", ({ sid, userData }) => {
      peersRef.current[sid] = null;
      enqueueSnackbar(`${userData.name} has joined this meeting`, {
        variant: "info",
      });
    });

    props.socket.on("meetingSDPTransfer", (data: any) => {
      if (data.from !== data.to) {
        // let peerIdx = peersRef.current.findIndex((p) => p.socket == data.from);
        // //alert("sdp from " + props.friends[data.from].name);
        // if (peerIdx == -1) {
        //   let x = createPeer(data.from, false);
        //   x.signal(data.signal);
        //   peersRef.current.push({
        //     peer: x,
        //     socket: data.from,
        //   });
        //   setPeers((p) => [...p, x]);
        // } else {
        //   peersRef.current[peerIdx].peer.signal(data.signal);
        //   //console.log(peers[peerIdx]);
        //   //peers[peerIdx].signal(data.signal);
        // }
        if (
          peersRef.current[data.from] === null ||
          peersRef.current[data.from] === undefined
        ) {
          peersRef.current[data.from] = createPeer(data.from, false);
          setUserSockets((old) => [...old, data.from]);
        }
        peersRef.current[data.from].signal(data.signal);
      }
    });

    props.socket.on("removeMeetingPeer", ({ socketID }) => {
      // let idx = peersRef.current.findIndex((p) => p.socket === socketID);

      // if (idx > -1) {
      //   peersRef.current.splice(idx, 1);

      //   setPeers([...peers.splice(idx, 1)]);
      // }
      delete peersRef.current[socketID];

      let idx = userSockets.findIndex((x) => x == socketID);
      setUserSockets([...userSockets.splice(idx, 1)]);

      isUserAlone() && leaveMeeting();
    });

    props.socket.on("screenshareMode", ({ sid, status }) => {
      status ? setFocusedOn(sid) : setFocusedOn("");
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        setMyStream(stream);
        myStreamRef.current.srcObject = stream;
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

  const requestMeetingMembers = () => {
    props.socket.emit("requestMeetingMembers", props.meetingID);
  };

  const createPeer = (socketID: string, isInitiator: boolean) => {
    let peer = new Peer({
      initiator: isInitiator,
      trickle: false,
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
      stream: myStreamRef.current.srcObject ?? null,
    });

    peer.on("signal", (data: any) => handleReceivingSignal(data, socketID));

    peer.on("connect", (data: any) => {
      //do somtheing when connected
      enqueueSnackbar(
        `Peer-to-peer connection with ${props.friends[socketID].name} has been established!`,
        {
          variant: "info",
        }
      );
    });

    peer.on("error", () => {
      //try reconnect
      enqueueSnackbar(
        `Peer-to-peer connection with ${props.friends[socketID].name} has encountered an error. Attempting to reconnect...`,
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
    if (userSockets.length < 1) {
      return true;
    }
    return false;
  };

  const isMeetingAdmin = () => {
    if (userSockets[0].socket === props.userSocketID) return true;
    return false;
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
    // peersRef.current.forEach((element) => {
    //   element.peer.destroy();
    // });
    Object.keys(peersRef.current).forEach((element: any) => {
      if (peersRef.current[element]) {
        peersRef.current[element].destroy();
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
          Object.keys(peersRef.current).forEach((element: any) => {
            element.replaceTrack(
              element.streams[0].getVideoTracks()[0],
              stream.getVideoTracks()[0],
              myStreamRef.current.srcObject
            );
          });

          stream.getVideoTracks()[0].onended = () => endScreenShare();
        });
      setIsScreensharing(true);
    } else {
      endScreenShare();
    }
  };

  const endScreenShare = () => {
    screenShareRef.current.getVideoTracks()[0].stop();
    Object.keys(peersRef.current).forEach((element: any) => {
      element.replaceTrack(
        element.streams[0].getVideoTracks()[0],
        myStreamRef.current.srcObject.getVideoTracks()[0],
        myStreamRef.current.srcObject
      );
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
      element.replaceTrack(
        element.streams[0].getVideoTracks()[0],
        stream.getVideoTracks()[0],
        myStreamRef.current.srcObject
      );
    });
  };

  const endWhiteboard = () => {
    Object.keys(peersRef.current).forEach((element: any) => {
      element.replaceTrack(
        element.streams[0].getVideoTracks()[0],
        myStreamRef.current.srcObject.getVideoTracks()[0],
        myStreamRef.current.srcObject
      );
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
            return (
              <Box className={classes.vidContainer} key={i}>
                <Video peer={peersRef.current[socketID]} />
              </Box>
            );
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
            handleLeaveMeeting={leaveMeeting}
            handleInviteUser={() => setOpenUserPicker(true)}
            handleMuteVideo={toggleVideo}
            handleMuteAudio={toggleAudio}
            handleScreenShare={toggleScreenShare}
            handleWhiteboard={toggleWhiteboard}
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
