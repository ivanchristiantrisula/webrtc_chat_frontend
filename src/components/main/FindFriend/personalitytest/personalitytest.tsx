import {
  Typography,
  Box,
  Container,
  makeStyles,
  Paper,
  Theme,
  Button,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import "./style.css";
import axios from "axios";
import { isTypeAssertion } from "typescript";
import { TransitionProps } from "@material-ui/core/transitions";
import { getToken } from "../../../../helper/localstorage";
import MBTIResultDialog from "./result";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    alignContent: "stretch",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    backgroundColor: "white",
  },
  questionContainer: {
    height: "10%",
    width: "100%",
    display: "flex",
    alignContent: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    paddingBottom: "20px",
  },
  answersArea: {
    height: "40%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  answerBox: {
    display: "flex",
    alignItems: "center",
    height: "100px",
    paddingLeft: "20px",
    marginBottom: "20px",
  },
  progressContainer: {
    width: "100%",
    height: "10%",
    paddingTop: "5%",
  },
  navigationContainer: {
    width: "100%",
    height: "5%",

    display: "flex",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "50%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  navButton: {
    width: "50%",
    height: "100%",
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfoDialog = (props: { open: boolean; handleClose: Function }) => {
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => props.handleClose()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"MBTI Personality Test"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          In order for us to give you accurate friend recommendations, you need
          to complete this MBTI personality test. You will be given 90 set of
          multiple choice questions. This test will take aproximately 15 minutes
          to finish. Good luck!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleClose()} color="primary">
          Lets Go!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default () => {
  const classes = useStyles();
  const [questionType, setQuestionType] = useState("adult");
  const [questions, setQuestions] = useState(
    require("./questions.json")[questionType].questions
  );
  const [answers, setAnswers] = useState([]);
  const [currQuestionNum, setCurrQuestionNum] = useState(0);
  const [result, setResult] = useState("");
  const [infoDialogShown, setInfoDialogShown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);

  const nextQuestion = () => {
    if (questions[currQuestionNum + 1] === undefined) {
      calculateResult();
    } else {
      setCurrQuestionNum(currQuestionNum + 1);
    }
  };

  const prevQuestion = () => {
    if (currQuestionNum > 0) {
      setCurrQuestionNum(currQuestionNum - 1);
    }
  };

  const pickSelection = (selection: number) => {
    if (answers[currQuestionNum] === undefined) {
      setAnswers((old) => [...old, selection]);
    } else {
      let x = answers;
      x[currQuestionNum] = selection;
      setAnswers([...x]);
    }
  };

  const calculateResult = () => {
    let scores = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    answers.forEach((answer, i) => {
      let col = (i + 1) % 7;
      switch (col) {
        case 1: // E/I COL 1
          if (answer === 0) {
            scores.E++;
          } else {
            scores.I++;
          }
          break;
        case 2: // S/N COL 2
          if (answer === 0) {
            scores.S++;
          } else {
            scores.N++;
          }
          break;
        case 3: // S/N COL 3
          if (answer === 0) {
            scores.S++;
          } else {
            scores.N++;
          }
          break;

        case 4: // T/F COL 4
          if (answer === 0) {
            scores.T++;
          } else {
            scores.F++;
          }
          break;
        case 5: // T/F COL 5
          if (answer === 0) {
            scores.T++;
          } else {
            scores.F++;
          }
          break;
        case 6: // J/P COL 6
          if (answer === 0) {
            scores.J++;
          } else {
            scores.P++;
          }
          break;

        case 0: // J/P COL 7
          if (answer === 0) {
            scores.J++;
          } else {
            scores.P++;
          }
          break;
      }
    });

    const typeMatrix = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];

    const typeName = {
      E: "Extrovert",
      I: "Introvert",
      S: "Sensor",
      N: "Intuitive",
      T: "Thinker",
      F: "Feeler",
      P: "Perceiver",
      J: "Judger",
    };

    let result = typeMatrix.map((pair) => {
      let a = pair[0];
      let b = pair[1];

      let type = scores[a] > scores[b] ? a : b;
      let totalScore = scores[a] + scores[b];

      return {
        type: type,
        typeName: typeName[type],
        score: Math.round((scores[type] / totalScore) * 100),
      };
    });

    let typeString = result
      .map((x) => {
        return x.type;
      })
      .join("");

    axios
      .put(process.env.REACT_APP_BACKEND_URI + "/user/updateMBTI", {
        rawResult: result,
        type: typeString,
        token: getToken(),
        answers: answers,
      })
      .then((res) => {
        if (res.status === 200) {
          setResult(typeString);
          setOpenResultDialog(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container className={classes.root}>
      <Box className={classes.progressContainer}>
        <LinearProgressWithLabel
          value={(answers.length / (questions.length - 1)) * 100}
        />
      </Box>
      <Box className={classes.questionContainer}>
        <Typography variant="h4">{questions[currQuestionNum].title}</Typography>
      </Box>
      <Box className={classes.answersArea}>
        {questions[currQuestionNum].selections.map(
          (selection: string, idx: number) => {
            return (
              <Paper
                elevation={5}
                className={classes.answerBox}
                onClick={() => pickSelection(idx)}
                color={answers[currQuestionNum] === idx ? "red" : "black"}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answers[currQuestionNum] == idx ? true : false}
                    />
                  }
                  label={
                    <Typography variant="subtitle1">{selection}</Typography>
                  }
                />
              </Paper>
            );
          }
        )}
      </Box>
      <Box className={classes.navigationContainer}>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.navButton}
            onClick={prevQuestion}
            disabled={currQuestionNum === 0}
          >
            Previous Question
          </Button>
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.navButton}
            onClick={nextQuestion}
            disabled={answers[currQuestionNum] === undefined}
          >
            Next Question
          </Button>
        </Box>
      </Box>
      {!infoDialogShown && currQuestionNum === 0 ? (
        <InfoDialog open={true} handleClose={() => setInfoDialogShown(true)} />
      ) : null}

      <MBTIResultDialog
        MBTI={result}
        open={openResultDialog}
        handleClose={() => {
          setOpenResultDialog(false);
          window.location.href = "/";
        }}
      />
    </Container>
  );
};
