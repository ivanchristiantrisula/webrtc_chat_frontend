import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { classicNameResolver } from "typescript";
import _ from "underscore";
import AdminReports from "./reports";
import Sidebar from "./sidebar";
import ReportDetail from "./reports/detail";
import BannedUsers from "./bans";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    visibility: "hidden",
  },

  visible: {
    visibility: "visible",
  },
  sidebar: {
    width: "75px",
  },
  midContainer: {
    width: "25rem",
    minWidth: 0,
    borderRight: "solid #d7d9d7 1px",
    backgroundColor: "white",
  },
  rightContainer: {
    width: "auto",
    backgroundColor: "white",
  },
}));

export default function AdminPage() {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState("reports");
  const [reportDetail, setReportDetail] = useState({});

  const fetchReportDetail = (rid: string) => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URI}/report/getReportDetail?id=${rid}`
      )
      .then((res) => {
        if (res.status === 200) setReportDetail(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const renderMidContent = () => {
    if (openMenu === "reports") {
      return (
        <AdminReports
          openReportDetail={(report: any) => setReportDetail(report)}
        />
      );
    } else if (openMenu === "bans") {
      return <BannedUsers showDetail={(id: string) => fetchReportDetail(id)} />;
    }
  };

  return (
    <Box>
      <Grid container>
        {/* SIDEBAR */}
        <Grid item className={classes.sidebar}>
          <Sidebar openMenu={(menu: string) => setOpenMenu(menu)} />
        </Grid>
        {/* MID */}
        <Grid item className={`${classes.midContainer}`}>
          {renderMidContent()}
        </Grid>
        {/* RIGHT */}
        <Grid item xs className={classes.rightContainer}>
          {!_.isEmpty(reportDetail) ? (
            <ReportDetail report={reportDetail} />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
}
