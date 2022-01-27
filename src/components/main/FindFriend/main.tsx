import {
  Box,
  Card,
  Fade,
  Popper,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken, getUserInfo } from "../../../helper/localstorage";
import ProfileCard from "../ProfileCard";

export default () => {
  let [users, setUsers] = useState([]);
  let [userDetail, setUserDetail] = useState({});
  let [openProfileCard, setOpenProfileCard] = useState(false);
  let [cardAnchorEl, setCardAnchorEl] = useState<HTMLDivElement>();

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URI +
          `/user/getFriendsRecommendation?token=${getToken()}`
      )
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          <Typography variant="h4">Friend Finder</Typography>
        </Box>
        <Box padding="1rem 1rem 1rem 1.5rem" marginBottom="1rem">
          <Typography variant="body1" color="textSecondary">
            Your MBTI : {getUserInfo().friendFinderProfile.MBTI}
          </Typography>
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
    </>
  );
};
