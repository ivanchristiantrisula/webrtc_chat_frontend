import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { classicNameResolver } from "typescript";
import { getToken } from "../../../helper/localstorage";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  card: {
    height: "auto",
    marginBottom: "0.5rem",
  },
}));

export default function AdminReports(props: { openReportDetail: Function }) {
  const [reports, setReports] = useState([]);
  const [openReportID, setOpenReportID] = useState({});
  const classes = useStyles();
  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {}, [reports]);

  const fetchReports = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/report/getAllReports`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.proof) {
            try {
              res.data.proof = JSON.parse(res.data.proof);
            } catch (error) {
              console.error("Error parsing proof");
            }
          }
          setReports(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const closeReport = (idx: number) => {
    setOpenReportID({});

    let old = reports[idx];
    old.status = "Closed";

    setReports(old);
  };

  const handleClick = (report: {}) => {
    props.openReportDetail(report);
  };
  return (
    <Box
      className={classes.root}
      padding="1rem 0.5rem 0.5rem 0.5rem"
      marginBottom="0rem"
    >
      <Typography
        variant="h4"
        color="textPrimary"
        style={{
          fontWeight: "bolder",
          marginBottom: "2rem",
          marginLeft: "1.5rem",
        }}
      >
        Reports
      </Typography>
      {reports.map((report) => {
        return (
          <Card className={classes.card} onClick={() => handleClick(report)}>
            <CardContent>
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">
                    <Typography variant="h6">{report.category}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="right">
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      style={{ textAlign: "right" }}
                    >
                      {new Date(report.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box textAlign="left">
                    <Typography color="textSecondary">
                      Report ID : {report.id}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Box
                    textAlign="right"
                    color={report.status === "Open" ? "dark green" : "red"}
                  >
                    <Typography variant="body1" color="initial">
                      {report.status}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
