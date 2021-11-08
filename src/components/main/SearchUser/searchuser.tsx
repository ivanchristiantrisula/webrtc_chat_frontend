import {
  Card,
  createStyles,
  makeStyles,
  Modal,
  Theme,
  Avatar,
  CardHeader,
  IconButton,
  FormControl,
  Typography,
  Box,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import _ from "underscore";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import UserCardInvite from "./UserCardInvite";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
require("dotenv").config();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "white",
      broderRight: "solid black 1px",
      height: "100vh",
    },
    paper: {
      position: "absolute",
      width: 400,
      height: 600,
      left: "50%",
      top: "50%",
      marginLeft: -200,
      marginTop: -300,
      backgroundColor: theme.palette.background.paper,
      border: "solid #d7d9d7 1px",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    findUserBox: {
      backgroudColor: theme.palette.background.paper,
      height: theme.spacing(7),
    },
  })
);

export default () => {
  const classes = useStyles();
  let [users, setUsers] = useState([]);
  let [openSearchUserModal, setOpenSearchUserModal] = useState(false);
  let [pendings, setPendings] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URI
        }/user/getPendingFriends?token=${localStorage.getItem("token")}`
      )
      .then((res) => {
        console.log(res);
        setPendings(res.data.pendings);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleKeywordChange = (keyword: string) => {
    if (keyword.length < 1) {
      setUsers([]);
      return;
    }
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URI
        }/user/findUser?keyword=${keyword}&token=${localStorage.getItem(
          "token"
        )}`
      )
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addFriend = (user: any) => {
    setUsers([]);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/addFriend`, {
        user: user,
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        if (res.data.error) alert(res.data.error);
        if (res.status == 200) {
          setUsers(
            users.filter((x) => {
              return x !== user;
            })
          );
          enqueueSnackbar(`Friend request sent to ${user.name}`, {
            variant: "info",
          });
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const handleAcceptFriendReq = (target: any) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/acceptFriendRequest`, {
        target: target,
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        setPendings(
          users.filter((x) => {
            return x !== target;
          })
        );

        enqueueSnackbar(`${target.name} is now in your friendlist`, {
          variant: "info",
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleRejectFriendReq = (target: any) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/rejectFriendRequest`, {
        target: target,
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        if (res.status === 200) {
          setPendings(
            users.filter((x) => {
              return x !== target;
            })
          );
          enqueueSnackbar(
            `You have rejected friend request from ${target.name}`,
            {
              variant: "info",
            }
          );
        }
      });
  };
  return (
    <div className={classes.root}>
      {/* <div
        className={classes.findUserBox}
        onClick={() => {
          setOpenSearchUserModal(true);
        }}
      >
        <Grid container>
          <Grid item xs={2}>
            <SearchIcon />
          </Grid>
          <Grid item xs={10}>
            Find User
          </Grid>
        </Grid>
      </div> */}
      <Card
        className={classes.findUserBox}
        onClick={() => {
          setOpenSearchUserModal(true);
        }}
      >
        <CardHeader
          avatar={<SearchIcon />}
          title="Find User"
          style={{ backgroundColor: "transparent" }}
        />
      </Card>

      <div>
        <Box margin="1rem 1rem 1rem 1rem">
          <Typography variant="subtitle2" color="textSecondary">
            Friend Invitations {`(${pendings.length})`}
          </Typography>
        </Box>

        {pendings.length > 0
          ? pendings.map((obj) => {
              return (
                <UserCardInvite
                  user={obj}
                  accept={handleAcceptFriendReq}
                  reject={handleRejectFriendReq}
                />
              );
            })
          : ""}
      </div>

      <Modal
        open={openSearchUserModal}
        onClose={() => {
          setOpenSearchUserModal(false);
        }}
      >
        <div className={classes.paper}>
          <h2 id="simple-modal-title">Find user</h2>
          <FormControl fullWidth>
            <TextField
              label="Search by username or email"
              onChange={(e) => handleKeywordChange(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </FormControl>

          <div>
            {users.map((obj, idx) => {
              if (!_.isEmpty(obj))
                return (
                  <UserCard
                    user={obj}
                    addFriend={(user: any) => {
                      addFriend(user);
                    }}
                  />
                );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
