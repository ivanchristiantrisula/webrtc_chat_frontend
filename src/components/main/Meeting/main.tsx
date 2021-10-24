import { useRef, useState, useEffect } from "react";
import Peer from "simple-peer";
import UserPicker from "../UserPicker";
import _ from "underscore";
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Modal,
  Theme,
} from "@material-ui/core";
import React from "react";
import BottomBar from "./bottombar";
import { Socket } from "socket.io-client";
import Whiteboard from "./whiteboard";
// @ts-ignore

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
    },

    videoArea: {
      width: "100%",
      height: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
    video: {
      width: "100%",
      height: "100%",
    },

    vidContainer: {
      height: "50%",
    },

    bottomBar: {
      height: "10%",
      backgroundColor: "white",
    },

    userVidContainer: {
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
    props.peer.on("stream", (stream: any) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <video className={classes.video} playsInline autoPlay muted ref={ref} />
  );
};

export default (props: {
  friends: any;
  socket: Socket;
  userSocketID: string;
  meetingID: string;
  endMeeting: Function;
}) => {
  const classes = useStyle();
  let peersRef = useRef([]);
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
  //const [streams, setStreams] = useState([]);

  useEffect(() => {
    props.socket.on("meetingInvitationResponse", (response: boolean) => {
      //do something when user has responed meeting invitation
    });

    props.socket.on("meetingMembers", (data: any) => {
      console.log(data);
      setUserSockets(data);

      //connect to everyone
      data.forEach((socket: any) => {
        //check if peer connection doesn't exist, then create the connection
        if (
          _.isUndefined(peersRef.current.find((p) => p.socket === socket)) &&
          socket != props.userSocketID
        ) {
          console.log(myStream);
          let peer = createPeer(socket, true);
          peersRef.current.push({
            peer: peer,
            socket: socket,
          });
          setPeers((p) => [...p, peer]);
        }
      });

      //check if user just created the room
      if (data.length === 1) {
        setOpenUserPicker(true);
      }
    });

    props.socket.on("newMeetingMember", (data: any) => {
      setUserSockets((old) => [...old, data]);
    });

    props.socket.on("meetingSDPTransfer", (data: any) => {
      if (data.from !== data.to) {
        let peerIdx = peersRef.current.findIndex((p) => p.socket == data.from);
        console.log(data);
        //alert(peerIdx);
        if (peerIdx == -1) {
          let x = createPeer(data.from, false);
          x.signal(data.signal);
          peersRef.current.push({
            peer: x,
            socket: data.from,
          });
          setPeers((p) => [...p, x]);
        } else {
          //console.log(peersRef.current[peerIdx].peer);
          //console.log(peerRef);
          peersRef.current[peerIdx].peer.signal(data.signal);
        }
      }
    });

    props.socket.on("removeMeetingPeer", ({ socketID }) => {
      let idx = peersRef.current.findIndex((p) => p.socket === socketID);

      if (idx > -1) {
        peersRef.current.splice(idx, 1);

        setPeers([...peers.splice(idx, 1)]);
      }
    });

    props.socket.on("screenshareMode", ({ sid, status }) => {
      status ? setFocusedOn(sid) : setFocusedOn("");
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        setMyStream(stream);
        if (myStreamRef.current) {
          myStreamRef.current.srcObject = stream;
        }

        //wait untill user stream is available, then request meeting members
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
      trickle: true,
      config: {
        iceServers: [
          { urls: ["stun:ss-turn1.xirsys.com"] },
          {
            username:
              "nloss6_TEUhewwxb10DhQRBHngGwWTL3PGaL7GePBHQiynZGSMUXdz13rAYTPQY4AAAAAGFcdZhwdWdob2xl",
            credential: "c12003b8-25f4-11ec-8db2-0242ac140004",
            urls: [
              "turn:ss-turn1.xirsys.com:80?transport=udp",
              "turn:ss-turn1.xirsys.com:3478?transport=udp",
              "turn:ss-turn1.xirsys.com:80?transport=tcp",
              "turn:ss-turn1.xirsys.com:3478?transport=tcp",
              "turns:ss-turn1.xirsys.com:443?transport=tcp",
              "turns:ss-turn1.xirsys.com:5349?transport=tcp",
            ],
          },
        ],
      },
      stream: myStreamRef.current.srcObject,
    });

    peer.on("signal", (data: any) => {
      props.socket.emit("transferSDPMeeting", {
        signal: data,
        to: socketID,
        from: props.userSocketID,
      });
    });

    peer.on("connect", (data: any) => {
      //do somtheing when connected
      // let x = userSockets;
      // x[socketID].status = "Connected. Waiting for stream";
      // setUserSockets(x);
    });

    return peer;
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
    peersRef.current.forEach((element) => {
      element.peer.destroy();
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
          console.log(stream.getVideoTracks()[0]);
          screenShareRef.current = stream;
          peersRef.current.forEach((element) => {
            element.peer.replaceTrack(
              element.peer.streams[0].getVideoTracks()[0],
              stream.getVideoTracks()[0],
              myStreamRef.current.srcObject
            );
            //element.peer.addStream(stream);
          });

          stream.getVideoTracks()[0].onended = () => endScreenShare();
        });
      setIsScreensharing(true);
    } else {
      endScreenShare();
    }

    //console.log(stream);
  };

  const endScreenShare = () => {
    screenShareRef.current.getVideoTracks()[0].stop();
    peersRef.current.forEach((element) => {
      element.peer.replaceTrack(
        element.peer.streams[0].getVideoTracks()[0],
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
    peersRef.current.forEach((element) => {
      element.peer.replaceTrack(
        element.peer.streams[0].getVideoTracks()[0],
        stream.getVideoTracks()[0],
        myStreamRef.current.srcObject
      );
    });
  };

  const endWhiteboard = () => {
    peersRef.current.forEach((element) => {
      element.peer.replaceTrack(
        element.peer.streams[0].getVideoTracks()[0],
        myStreamRef.current.srcObject.getVideoTracks()[0],
        myStreamRef.current.srcObject
      );
    });
  };

  return (
    <>
      <Box className={classes.root}>
        <Grid container>
          <Grid
            item
            xs={12}
            className={`${classes.videoArea} ${
              whiteboardMode ? classes.noDisplay : null
            }`}
          >
            <Grid container>
              <Grid item xs={6} className={classes.vidContainer}>
                {!_.isUndefined(peers[0]) ? (
                  <Video key={0} peer={peers[0]} />
                ) : (
                  <Box width="100%" height="100%">
                    Kosong
                  </Box>
                )}
              </Grid>
              <Grid item xs={6} className={classes.vidContainer}>
                {!_.isUndefined(peers[1]) ? (
                  <Video key={1} peer={peers[1]} />
                ) : (
                  <Box width="100%" height="100%">
                    Kosong
                  </Box>
                )}
              </Grid>
              <Grid item xs={6} className={classes.vidContainer}>
                {!_.isUndefined(peers[2]) ? (
                  <Video key={2} peer={peers[2]} />
                ) : (
                  <Box width="100%" height="100%">
                    Kosong
                  </Box>
                )}
              </Grid>
              <Grid item xs={6} className={classes.vidContainer}>
                {!_.isUndefined(peers[3]) ? (
                  <Video key={3} peer={peers[3]} />
                ) : (
                  <Box width="100%" height="100%">
                    Kosong
                  </Box>
                )}
              </Grid>

              {whiteboardMode ? (
                <Grid
                  item
                  xs={12}
                  style={{ height: "100%" }}
                  className={!whiteboardMode ? classes.noDisplay : ""}
                >
                  <Whiteboard handleCaptureStream={startWhiteboard} />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.bottomBar}>
            <BottomBar
              meetingID={props.meetingID}
              handleLeaveMeeting={leaveMeeting}
              handleInviteUser={() => setOpenUserPicker(true)}
              handleMuteVideo={toggleVideo}
              handleMuteAudio={toggleAudio}
              handleScreenShare={toggleScreenShare}
              handleWhiteboard={toggleWhiteboard}
            />
          </Grid>
        </Grid>
      </Box>

      <UserPicker
        isOpen={openUserPicker}
        title={"Invite to meeting"}
        multipleUser={true}
        users={props.friends}
        onPickedUser={inviteUser}
        handleClose={() => setOpenUserPicker(false)}
      />

      <Box
        width="300px"
        height="150px"
        position="fixed"
        top="0"
        right="0"
        className={classes.userVidContainer}
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
    </>
  );
};
