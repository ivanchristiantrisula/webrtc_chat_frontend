import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";
import { makeStyles } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";

ReactDOM.render(
  <SnackbarProvider
    style={{ whiteSpace: "pre-line" }}
    maxSnack={5}
    iconVariant={{
      success: <ChatIcon style={{ marginRight: "0.5rem" }} />,
    }}
  >
    <App />
  </SnackbarProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
