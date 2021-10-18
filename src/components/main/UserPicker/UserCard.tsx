import {
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Card,
  CardHeader,
  IconButton,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useEffect } from "react";
import Radio, { RadioProps } from "@material-ui/core/Radio";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: "solid black 1px",
      height: "5rem",
      display: "flex",
      alignItems: "center",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    avatar: {
      marginLeft: "0.8rem",
    },
  })
);

export default function (props: any) {
  const classes = useStyles();

  useEffect(() => {
    //console.log(props);
  }, []);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            className={classes.avatar}
            src={`${process.env.REACT_APP_BACKEND_URI}/profilepictures/${props.user.profilepicture}.png`}
          />
        }
        title={props.user.name}
        action={<Radio checked={props.selected}></Radio>}
      />
    </Card>
  );
}
