import { useEffect, useState } from "react";
import PersonalityTest from "./personalitytest/personalitytest";
import Main from "./main";
import { Box } from "@material-ui/core";

export default () => {
  const [MBTI, setMBTI] = useState("");

  useEffect(() => {
    if (MBTI != getUserMBTI()) setMBTI(getUserMBTI());
  }, []);

  const getUserMBTI = () => {
    return JSON.parse(localStorage.getItem("user")).MBTI || "";
  };
  return <> {MBTI == "" ? <PersonalityTest /> : <Main />} </>;
};
