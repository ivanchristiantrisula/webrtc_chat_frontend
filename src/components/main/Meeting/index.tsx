import { useEffect, useState } from "react";
import Main from "./main";
import Welcome from "./welcome";

export default (props: {
  meetingData: { id: string; isPrivate: boolean };
  friends: any;
  socket: any;
  userSocketID: string;
  meetingMode: boolean;
  handleNewMeeting: Function;
  endMeeting: Function;
}) => {
  const [meetingData, setMeetingData] =
    useState<{ id: string; isPrivate: boolean }>();

  useEffect(() => {
    props.socket.on("meetingID", (data: { id: string; private: boolean }) => {
      // setMeetingData({ id: data.id, isPrivate: data.private });
      // //props.handleNewMeeting(id);
      // alert(data.private);
    });
  }, []);

  const requestMeetingID = () => {
    props.socket.emit("requestNewRoom", {});
  };

  const joinMeetingByCode = (code: string) => {
    props.socket.emit("joinByMeetingID", { meetingID: code });
  };
  return (
    <>
      {props.meetingData ? (
        <Main
          friends={props.friends}
          socket={props.socket}
          userSocketID={props.userSocketID}
          meetingID={props.meetingData.id}
          endMeeting={() => props.endMeeting()}
          isPrivate={props.meetingData.isPrivate}
        />
      ) : (
        <Welcome
          onCreateMeeting={requestMeetingID}
          joinMeetingCode={joinMeetingByCode}
        />
      )}
    </>
  );
};
