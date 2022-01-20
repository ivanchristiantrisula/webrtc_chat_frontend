import { useEffect, useState } from "react";
import PersonalityTest from "./personalitytest/personalitytest";
import Main from "./main";
import { Box } from "@material-ui/core";
import { getUserInfo } from "../../../helper/localstorage";

export default () => {
  const [MBTI, setMBTI] = useState("");

  useEffect(() => {
    if (MBTI != getUserMBTI()) setMBTI(getUserMBTI());
  }, []);

  const getUserMBTI = () => {
    return getUserInfo().friendFinderProfile.MBTI || "";
  };
  return <> {MBTI == "" ? <PersonalityTest /> : <Main />} </>;
};
