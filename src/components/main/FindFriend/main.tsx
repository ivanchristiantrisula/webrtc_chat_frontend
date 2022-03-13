import {
  Box,
  Card,
  Fade,
  Popper,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
  Link,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken, getUserInfo } from "../../../helper/localstorage";
import ProfileCard from "../ProfileCard";
import MBTIResultDialog from "./personalitytest/result";

export default () => {
  let [users, setUsers] = useState([]);
  let [userDetail, setUserDetail] = useState<any>();
  let [openProfileCard, setOpenProfileCard] = useState(false);
  let [cardAnchorEl, setCardAnchorEl] = useState<HTMLDivElement>();
  let [openResultDialog, setOpenResultDialog] = useState(false);
  let [reccomenderMethod, setReccomenderMethod] = useState("advance");

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URI +
          `/user/getFriendsRecommendation?token=${getToken()}&mode=${reccomenderMethod}`
      )
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reccomenderMethod]);

  const handleClickUserCard =
    (user: any) => (e: React.MouseEvent<HTMLDivElement>) => {
      setCardAnchorEl(e.currentTarget);
      setUserDetail(user);
      setOpenProfileCard(true);
    };

  const addFriend = (id: string) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/addFriend`, {
        user: { id: id },
        token: getToken(),
      })
      .then((res) => {
        if (res.data.error) alert(res.data.error);
        if (res.status == 200) {
          alert("sukses add friend");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const switchReccomenderMode = () => {
    if (reccomenderMethod == "advance") {
      setReccomenderMethod("simple");
    } else if (reccomenderMethod == "simple") {
      setReccomenderMethod("advance");
    }
  };
  return (
    <>
      <ProfileCard
        user={userDetail}
        addFriendHandler={addFriend}
        isUserFriend={false}
        open={openProfileCard}
        anchor={cardAnchorEl}
        handleClose={() => setOpenProfileCard(false)}
      />
      <Box>
        <Box padding="1rem 1rem 0rem 1.5rem">
          <Typography variant="h4" style={{ fontWeight: "bolder" }}>
            Friend Finder
          </Typography>
        </Box>
        <Box padding="1rem 1rem 1rem 1.5rem" marginBottom="1rem">
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="body1" color="textPrimary">
                MBTI :{" "}
                <Link onClick={() => setOpenResultDialog(true)}>
                  {getUserInfo().friendFinderProfile.MBTI}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={reccomenderMethod == "advance" ? true : false}
                      onChange={switchReccomenderMode}
                      name="reccomenderSwitch"
                      color="primary"
                    />
                  }
                  label={
                    reccomenderMethod[0].toUpperCase() +
                    reccomenderMethod.slice(1)
                  }
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Box>
        {users.map((user, i) => {
          if (user) {
            return (
              <Card
                onClick={handleClickUserCard(user)}
                style={{ margin: "0.5rem" }}
              >
                <CardHeader
                  avatar={<Avatar src={user.profilepicture} />}
                  title={user.name}
                  subheader={user.friendFinderProfile.MBTI}
                />
              </Card>
            );
          }
        })}
      </Box>

      <MBTIResultDialog
        MBTI={getUserInfo().friendFinderProfile.MBTI}
        open={openResultDialog}
        handleClose={() => {
          setOpenResultDialog(false);
        }}
      />
    </>
  );
};
