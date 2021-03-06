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
  FormLabel,
  FormHelperText,
  Button,
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
import { getToken } from "../../../helper/localstorage";
import { Socket } from "socket.io-client";
require("dotenv").config();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
      overflowY: "scroll",
    },
    findUserBox: {
      backgroudColor: theme.palette.background.paper,
      height: theme.spacing(7),
    },
  })
);

export default (props: { refreshFriendlist: Function; socket: Socket }) => {
  const classes = useStyles();
  let [users, setUsers] = useState([]);
  let [openSearchUserModal, setOpenSearchUserModal] = useState(false);
  let [pendings, setPendings] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URI
        }/user/getPendingFriends?token=${getToken()}`
      )
      .then((res) => {
        setPendings(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(
      () => handleKeywordChange(searchKeyword),
      500
    );

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const handleKeywordChange = (keyword: string) => {
    if (keyword.length < 1) {
      setUsers([]);
      return;
    }
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URI
        }/user/findUser?keyword=${keyword}&token=${getToken()}`
      )
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addFriend = (user: any) => {
    setUsers([]);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/addFriend`, {
        user: user,
        token: getToken(),
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
          props.socket.emit("notifyFriendInvitationToTarget", { uid: user.id });
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
        token: getToken(),
      })
      .then((res) => {
        setPendings(
          users.filter((x) => {
            return x !== target;
          })
        );

        enqueueSnackbar(`Friend invitation successfully accepted`, {
          variant: "info",
        });

        props.refreshFriendlist();
        props.socket.emit("notifyOtherToAddFriendlist", { uid: target });
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const handleRejectFriendReq = (target: any) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/rejectFriendRequest`, {
        target: target,
        token: getToken(),
      })
      .then((res) => {
        if (res.status === 200) {
          setPendings(
            users.filter((x) => {
              return x !== target;
            })
          );
          enqueueSnackbar(`Friend invitation successfully rejected`, {
            variant: "info",
          });
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

      <Box padding="1rem 1rem 0rem 1.5rem" marginBottom="1.5rem">
        <Typography variant="h4" style={{ fontWeight: "bolder" }}>
          Search
        </Typography>
      </Box>
      <FormControl style={{ width: "90%", padding: "1rem 0rem 0rem 1rem" }}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          color="primary"
          onClick={() => setOpenSearchUserModal(true)}
        >
          Search User
        </Button>
      </FormControl>

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
                  user={obj.user1}
                  accept={handleAcceptFriendReq}
                  reject={handleRejectFriendReq}
                  inviteID={obj.id}
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
        <Box className={classes.paper}>
          <h2 id="simple-modal-title">Find user</h2>
          <FormControl fullWidth>
            <TextField
              label="Search by username or email"
              onChange={(e) => setSearchKeyword(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </FormControl>

          <Box>
            {users.map((obj, idx) => {
              if (!_.isEmpty(obj))
                return (
                  <UserCard
                    user={obj}
                    action={(user: any) => {
                      addFriend(user);
                    }}
                    actionName="Add"
                  />
                );
            })}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
