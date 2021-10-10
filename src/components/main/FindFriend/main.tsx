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
          `/api/user/getFriendsRecommendation?token=${localStorage.getItem(
            "token"
          )}`
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
      setUserDetail(user);
      setOpenProfileCard(true);
      setCardAnchorEl(e.currentTarget);
    };

  const addFriend = (id: string) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/api/user/addFriend`, {
        user: { _id: id },
        token: localStorage.getItem("token"),
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
      <Popper
        open={openProfileCard}
        anchorEl={cardAnchorEl}
        placement={"right-start"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <ProfileCard
              user={userDetail}
              addFriendHandler={addFriend}
              isUserFriend={false}
            />
          </Fade>
        )}
      </Popper>
      <Box>
        <Box padding="1rem 1rem 0rem 1.5rem">
          <Typography variant="h4">Friend Recommendations</Typography>
        </Box>
        <Box padding="1rem 1rem 1rem 1.5rem" marginBottom="1rem">
          <Typography variant="body1" color="textSecondary">
            Your MBTI : {JSON.parse(localStorage.getItem("user")).MBTI}
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
                  avatar={
                    <Avatar
                      src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${user.profilepicture}.png`}
                    />
                  }
                  title={user.name}
                  subheader={user.MBTI}
                />
              </Card>
            );
          }
        })}
      </Box>
    </>
  );
};
