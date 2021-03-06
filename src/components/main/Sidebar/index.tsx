import {
  Avatar,
  Box,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popper,
  Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import GroupIcon from "@material-ui/icons/Group";
import ChatIcon from "@material-ui/icons/Chat";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import ProfileMenu from "../Profile/menu";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import { getUserInfo } from "../../../helper/localstorage";
import RateReviewIcon from "@material-ui/icons/RateReview";

const useStyles = makeStyles((theme: Theme) => ({
  open: {
    borderLeft: "solid white 5px",
    color: "white",
  },
  openIcon: {
    color: "white",
  },
  icon: {
    color: "rgb(201, 206, 209)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 0,
  },
  avatar: {
    position: "fixed",
    bottom: "0",
    marginBottom: "10px",
    width: "5rem",
    borderRadius: 0,
  },
}));

const ProfilePopperMenu = (props: {
  anchor: any;
  open: boolean;
  handleClose: Function;
  handleClickProfile: Function;
  handleClickLogout: Function;
}) => {
  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={props.anchor}
        keepMounted
        open={props.open}
        onClose={() => props.handleClose()}
      >
        <MenuItem
          onClick={() => {
            props.handleClickProfile();
            props.handleClose();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={() => props.handleClickLogout()}>Logout</MenuItem>
      </Menu>
      ;
    </>
  );
};

function App(props: { user: any; openMenu: Function }) {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState("friendlist");
  const [popperAnchorEl, setPopperAnchorEl] = useState<HTMLDivElement>(null);

  const openProfilePopper = (e: React.MouseEvent<HTMLDivElement>) => {
    setPopperAnchorEl(e.currentTarget);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    window.location.href = "/";
  };
  return (
    <React.Fragment>
      <List>
        <ListItem
          button
          className={`${openMenu === "friendlist" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            setOpenMenu("friendlist");
            props.openMenu("friendlist");
          }}
        >
          <ListItemIcon>
            <PersonIcon
              style={{ display: "block", margin: "auto" }}
              className={
                openMenu === "friendlist" ? classes.openIcon : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          className={`${openMenu === "chatlist" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            setOpenMenu("chatlist");
            props.openMenu("chatlist");
          }}
        >
          <ListItemIcon>
            <ChatIcon
              style={{ display: "block", margin: "auto" }}
              className={
                openMenu === "chatlist" ? classes.openIcon : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          className={`${openMenu === "searchUser" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            setOpenMenu("searchUser");
            props.openMenu("searchUser");
          }}
        >
          <ListItemIcon>
            <SearchIcon
              style={{ display: "block", margin: "auto" }}
              className={
                openMenu === "searchUser" ? classes.openIcon : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          className={`${openMenu === "meeting" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            setOpenMenu("meeting");
            props.openMenu("meeting");
          }}
        >
          <ListItemIcon>
            <GroupIcon
              style={{ display: "block", margin: "auto" }}
              className={
                openMenu === "meeting" ? classes.openIcon : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          className={` ${
            openMenu === "personalitytest" || openMenu === "findfriend"
              ? classes.open
              : ""
          } ${classes.iconContainer}`}
          onClick={() => {
            if (props.user.friendFinderProfile.MBTI === null) {
              setOpenMenu("personalitytest");
              props.openMenu("personalitytest");
            } else {
              setOpenMenu("findfriend");
              props.openMenu("findfriend");
            }
          }}
        >
          <ListItemIcon>
            <PersonPinCircleIcon
              style={{ display: "block", margin: "auto" }}
              className={
                openMenu === "personalitytest" || openMenu === "findfriend"
                  ? classes.openIcon
                  : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem>
        {/* <ListItem
          button
          className={`${openMenu === "review" ? classes.open : ""} ${
            classes.iconContainer
          }`}
          onClick={() => {
            window
              .open("https://forms.gle/55KMv3Taa91vTF3S7", "_blank")
              .focus();
          }}
        >
          <ListItemIcon>
            <RateReviewIcon
              style={{ display: "block", margin: "auto", color: "#ECB753" }}
              className={
                openMenu === "review" ? classes.openIcon : classes.icon
              }
              fontSize="large"
            />
          </ListItemIcon>
        </ListItem> */}
        <ListItem
          button
          className={`${openMenu === "profile" ? classes.open : ""} ${
            classes.avatar
          }`}
          onClick={(e) => {
            setOpenMenu("profile");
            openProfilePopper(e);
            //props.openMenu("profile");
          }}
        >
          <ListItemIcon>
            <Avatar src={getUserInfo().profilepicture} />
          </ListItemIcon>
        </ListItem>
      </List>

      <Popper
        open={Boolean(popperAnchorEl)}
        anchorEl={popperAnchorEl}
        placement={"right-end"}
        transition
      >
        <ProfilePopperMenu
          open={openMenu === "profile"}
          anchor={popperAnchorEl}
          handleClose={() => setPopperAnchorEl(null)}
          handleClickProfile={() => {
            props.openMenu("profile");
          }}
          handleClickLogout={handleLogOut}
        />
      </Popper>
    </React.Fragment>
  );
}

export default App;
