import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  InputLabel,
  TextField,
  TextFieldClassKey,
  TextFieldProps,
  Theme,
} from "@material-ui/core";
import {
  Container,
  createStyles,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  FormLabel,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import { TextFormat, Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";
import { InputFiles } from "typescript";
import {
  getToken,
  getUserInfo,
  setToken,
  setUserInfo,
} from "../../../helper/localstorage";
import UserCard from "../SearchUser/UserCard";
import Searchuser from "../SearchUser/searchuser";
import { useSnackbar } from "notistack";
import { Socket } from "socket.io-client";
import { Alert } from "@material-ui/lab";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    topGrid: {
      height: "20%",
    },
    bottomGrid: {
      height: "100%",
    },

    avatar: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },

    grid: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "40px",
    },
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      width: "25ch",
    },

    passwordDialog: {
      width: "50%",
    },
  })
);

// const initState = {
//   name: JSON.parse(localStorage.getItem("user")).name,
//   bio: JSON.parse(localStorage.getItem("user")).bio,
// };

const ChangePasswordDialog = (props: {
  openDialog: boolean;
  onClose: Function;
}) => {
  const classes = useStyle();
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    validation();
  }, [oldPassword, newPassword, confirmPassword]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleChangeOld = (pass: string) => {
    setOldPassword(pass);
  };
  const handleChangeNew = (pass: string) => {
    setNewPassword(pass);
  };
  const handleChangeConfirm = (pass: string) => {
    setConfirmPassword(pass);
  };

  const validation = () => {
    let match = confirmPassword === newPassword;
    setConfirmError(!match);

    return match;
  };
  const handleSave = () => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URI}/user/changePassword`, {
        old: oldPassword,
        new: newPassword,
        confirm: confirmPassword,
        token: getToken(),
      })
      .then((res) => {
        if (res.status == 200) {
          enqueueSnackbar("Password successfully changed!", {
            variant: "info",
          });
          props.onClose();
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(String(error));
      });
  };
  return (
    <Dialog open={props.openDialog}>
      <DialogTitle id="">Change Password</DialogTitle>
      <DialogContent>
        <Box>
          <FormControl className={clsx(classes.margin, classes.textField)}>
            {errorMessage != "" ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}

            <TextField
              label="Old Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChangeOld(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChangeNew(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChangeConfirm(e.target.value)}
              error={confirmError ? true : false}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave()}
          disabled={
            oldPassword != "" &&
            newPassword != "" &&
            confirmPassword != "" &&
            !confirmError
              ? false
              : true
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BlocksDialog = (props: { open: boolean; handleClose: Function }) => {
  const [users, setUsers] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchBlockList();
  }, []);

  const fetchBlockList = () => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_URI
        }/user/getBlocks?token=${getToken()}`
      )
      .then((res) => {
        if (res.status == 200) {
          setUsers(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const unblock = (target: any) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/unblock`, {
        token: getToken(),
        target: target.id,
      })
      .then((res) => {
        if (res.status == 200) {
          setUsers([...users.filter((user) => user.id != target.id)]);
          enqueueSnackbar(`${target.name} has been unblocked!`, {
            variant: "info",
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.handleClose()}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title" style={{ fontWeight: "bolder" }}>
          Block List
        </DialogTitle>
        <DialogContent dividers={false}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {users.map((user: any) => (
              <UserCard user={user} action={unblock} actionName={"Unblock"} />
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleClose()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const resetCookies = () => {
  let cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export default (props: { user: any; socket: Socket }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  let history = useHistory();
  const classes = useStyle();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(props.user.name);
  const [bio, setBio] = useState(props.user.bio);
  const [openChangePassDialog, setOpenChangePassDialog] = useState(false);
  const [openBlocksDialog, setOpenBlocksDialog] = useState(false);

  let nameInputRef = useRef<TextFieldProps>();
  let bioInputRef = useRef<TextFieldProps>();
  let fileInputRef = useRef<HTMLInputElement>();

  const resetFields = () => {
    setName(props.user.name);
    setBio(props.user.bio);
    nameInputRef.current.value = props.user.name;
    bioInputRef.current.value = props.user.bio;
    setEditMode(false);
  };

  const saveProfileEdit = () => {
    // send post to backend
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/user/updateProfile`, {
        name: name,
        bio: bio,
        token: getToken(),
      })
      .then((res) => {
        if (res.status == 200) {
          props.socket.disconnect();
          setToken(res.data.token);
          setUserInfo(res.data.user);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const changePP = () => {
    fileInputRef.current.click();
  };

  const handleImageSelected = async (e: any) => {
    let fd = new FormData();
    fd.append("file", e.target.files[0], `${getUserInfo().id}.png`);
    try {
      const response = await axios({
        method: "post",
        url: `${
          process.env.REACT_APP_BACKEND_URI
        }/user/uploadProfilePicture?token=${getToken()}`,
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status == 200) {
        props.socket.disconnect();
        setToken(response.data.token);
        setUserInfo(response.data.user);
        window.location.reload();
      }
    } catch (error) {
      alert("error upload image");
    }
  };

  const toggleBlocksDialog = () => {
    setOpenBlocksDialog(!openBlocksDialog);
  };

  return (
    <>
      <Container className={classes.root}>
        <Grid container style={{ height: "100%", width: "100%" }}>
          <Grid
            item
            xs={3}
            style={{
              height: "20%",
            }}
            className={classes.grid}
          >
            <Box onClick={changePP}>
              <Avatar
                className={classes.avatar}
                src={getUserInfo().profilepicture}
              />
            </Box>
          </Grid>

          <Grid item xs={9} style={{ height: "20%" }} className={classes.grid}>
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                defaultValue={name}
                onChange={(e) => {
                  setEditMode(true);
                  setName(e.target.value);
                }}
                inputRef={nameInputRef}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            className={classes.grid}
            style={{
              height: "70%",
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box style={{ width: "100%", marginBottom: "20px" }}>
              <TextField
                id="outlined-multiline-static"
                label="Bio"
                multiline
                rows={12}
                defaultValue={bio}
                variant="outlined"
                fullWidth
                placeholder="Tell the world a little about yourself"
                onChange={(e) => {
                  setEditMode(true);
                  setBio(e.target.value);
                }}
                inputRef={bioInputRef}
              />
            </Box>
            <Box style={{ float: "right" }} width="100%">
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  setOpenChangePassDialog(true);
                }}
                style={{ marginRight: "1rem" }}
              >
                Change Password
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => toggleBlocksDialog()}
              >
                Block List
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} style={{ height: "10%", float: "right" }}>
            <Box
              style={{ float: "right" }}
              display={editMode ? "block" : "none"}
            >
              <Button color="primary" onClick={() => resetFields()}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => saveProfileEdit()}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <ChangePasswordDialog
        openDialog={openChangePassDialog}
        onClose={() => {
          setOpenChangePassDialog(false);
        }}
      />

      <BlocksDialog open={openBlocksDialog} handleClose={toggleBlocksDialog} />

      {/* hidden input file */}
      <Box display="none">
        <input
          type="file"
          name=""
          id="changeAvatarInput"
          ref={fileInputRef}
          onChange={handleImageSelected}
          accept="image/png, image/gif, image/jpeg"
        />
      </Box>
    </>
  );
};
