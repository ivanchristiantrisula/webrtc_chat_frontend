import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  Avatar,
  CardHeader,
  Box,
  Grid,
  Button,
  FormControl,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { getToken } from "../../../helper/localstorage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "0.5rem",
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

const BannedUserCard = (props: { user: any; handleUserUnbanned: Function }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>();

  useEffect(() => {
    fetchReportDetail();
  }, []);

  const handleExpandClick = () => setExpanded(!expanded);

  const fetchReportDetail = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URI}/report/getReportDetail?id=${props.user.banReportID}`
      )
      .then((res) => {
        if (res.status === 200) setDetail(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClick = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/unbanUser`, {
        userID: props.user.id,
      })
      .then((res) => {
        if (res.status === 200) props.handleUserUnbanned();
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="" src={props.user.profilepicture}></Avatar>
          }
          action={
            <CardActions disableSpacing>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
          }
          title={props.user.name}
          subheader=""
        />
        {detail == undefined ? (
          "Fetching"
        ) : (
          <>
            <Card>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Box>
                    <FormControl fullWidth>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                      >
                        Unban User
                      </Button>
                    </FormControl>
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          </>
        )}
      </Card>
    </>
  );
};

const BannedUsers = (props: { showDetail: Function }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const removeUser = (user: any) => {
    setUsers(users.filter((item) => user.id !== item.id));
  };

  const fetchBannedUsers = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/user/getBannedUsers`)
      .then((res) => {
        if (res.status === 200) setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <>
      {users.map((user, idx) => {
        return (
          <>
            <Box onClick={() => props.showDetail(user.banReportID)}>
              <BannedUserCard
                key={idx}
                user={user}
                handleUserUnbanned={() => removeUser(user)}
              />
            </Box>
          </>
        );
      })}
    </>
  );
};

export default BannedUsers;
