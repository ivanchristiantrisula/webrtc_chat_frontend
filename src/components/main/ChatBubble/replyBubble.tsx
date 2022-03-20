import classes from "*.module.css";
import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: "5px",
      borderRadius: "10px",
      padding: "10px",
      border: "1px solid white",
    },
  })
);
export default (props: { chat: any }) => {
  const classes = useStyle();

  return <div className={classes.root}>{props.chat.message}</div>;
};
