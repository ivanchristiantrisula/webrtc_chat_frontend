import {
  Box,
  ButtonBase,
  Container,
  createStyles,
  FormControl,
  Grid,
  makeStyles,
  Theme,
  IconButton,
} from "@material-ui/core";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      backgroundColor: theme.palette.background.paper,
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
    },
  })
);

export default function (props: {
  handleFileUpload: Function;
  handleSendText: Function;
  isUploadingFile: boolean;
}) {
  const classes = useStyles();
  let [text, setText] = useState("");
  let fileInputRef = useRef<HTMLInputElement>();
  let textInput = useRef<TextFieldProps>();

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  const sendText = () => {
    if (text != "") {
      props.handleSendText(text);
      setText("");
      textInput.current.value = "";
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = (e: any) => {
    props.handleFileUpload(e.target.files[0]);

    fileInputRef.current.value = null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendText();
    }
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Grid
        container
        alignItems="center"
        justify="center"
        spacing={2}
        className={classes.root}
      >
        <Grid item>
          <Box textAlign="center">
            <ButtonBase></ButtonBase>
            <IconButton
              aria-label=""
              onClick={handleClickUpload}
              color="primary"
            >
              <PublishOutlinedIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs>
          <FormControl fullWidth>
            <TextField
              label="Say something"
              fullWidth
              variant="outlined"
              multiline
              onChange={(e) => setText(e.target.value)}
              inputRef={textInput}
              onKeyPress={handleKeyPress}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Box textAlign="center">
            <IconButton aria-label="" onClick={sendText} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* hidden input */}
      <input
        type="file"
        onChange={handleFileSelected}
        disabled={props.isUploadingFile}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </Container>
  );
}
