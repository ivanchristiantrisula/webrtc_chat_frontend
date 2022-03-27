import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./components/landing/";
import RegisterPage from "./components/register/";
import MainPage from "./components/main/main";
import {
  createTheme,
  makeStyles,
  Snackbar,
  ThemeProvider,
} from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import AdminPage from "./components/admin";
import ForgotPasswordPage from "./components/main/ForgotPassword/";
import VerifyEmailPage from "./components/main/VerifyEmail/";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3F72AF",
      light: "#3F72AF",
    },
  },
});
const useStyles = makeStyles({
  snackbar: {
    whiteSpace: "pre-line",
  },
});

function App() {
  const classes = useStyles();

  useEffect(() => {
    document.oncontextmenu = null;
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/chat" component={MainPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/verify-email" component={VerifyEmailPage} />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
