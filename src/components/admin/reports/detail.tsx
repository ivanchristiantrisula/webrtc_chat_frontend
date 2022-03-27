import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Container,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControl,
  FormHelperText,
  Avatar,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useSnackbar } from "notistack";

const ReportInformation = (props: { report: any }) => {
  return (
    <>
      <Card style={{ paddingLeft: "1rem" }}>
        <CardHeader
          title="Report Information"
          subheader={_.capitalize(props.report.type) + " Report"}
        />
        <CardContent>
          <Box>
            <Box width="100%" height="" marginBottom="1rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Reporter</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.reporter.name}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="" marginBottom="1rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Reportee</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.reportee.name}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="" marginBottom="1rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Report Type</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {_.capitalize(props.report.type) + " Report"}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="" marginBottom="1rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Category</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.category}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="" marginBottom="1rem">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Description</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.description || "-"}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

const ReportProof = (props: { report: any }) => {
  let anchorElement = useRef<HTMLDivElement>();
  return (
    <>
      <Card style={{ padding: "0.5rem 0.5rem 1rem 0.5rem" }}>
        <CardHeader
          title="Evidence"
          subheader={
            props.report.type == "chat" ? "Chat Log" : "Profile History"
          }
        />
        <CardContent>
          {props.report.type == "chat" ? (
            <Box>
              <Typography variant="body1" color="textPrimary">
                {"..."}
              </Typography>
              {JSON.parse(props.report.proof).map(
                (element: any, idx: number) => {
                  return (
                    <Box
                      width="100%"
                      height=""
                      marginBottom="1rem"
                      marginTop={"1rem"}
                    >
                      <Grid container>
                        <Grid item xs={6}>
                          <Box textAlign="left">
                            <Typography variant="body1" color="textPrimary">
                              [{new Date(element.timestamp).toLocaleString()}]{" "}
                              {element.senderInfo.name}
                              {" : "}
                              {element.message || "no-text"}
                              {element.isReported ? " (Reported)" : ""}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="left" fontWeight="fontWeightBold">
                            {JSON.parse(props.report.proof).name}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                }
              )}
              <Typography variant="body1" color="textPrimary">
                {"..."}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box width="100%" height="" marginBottom="1rem">
                <Grid container>
                  <Grid item xs={6}>
                    <Box textAlign="left">Name</Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="left" fontWeight="fontWeightBold">
                      {JSON.parse(props.report.proof).name}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box width="100%" height="" marginBottom="1rem">
                <Grid container>
                  <Grid item xs={6}>
                    <Box textAlign="left">Username</Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="left" fontWeight="fontWeightBold">
                      {JSON.parse(props.report.proof).username}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box width="100%" height="" marginBottom="1rem">
                <Grid container>
                  <Grid item xs={6}>
                    <Box textAlign="left">Biodata</Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="left" fontWeight="fontWeightBold">
                      {JSON.parse(props.report.proof).biodata || "-"}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box width="100%" height="" marginBottom="1rem">
                <Grid container>
                  <Grid item xs={12}>
                    <Box textAlign="left">Profile Picture</Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      textAlign="left"
                      fontWeight="fontWeightBold"
                      style={{ textAlign: "center" }}
                      marginTop="2rem"
                    >
                      <img
                        src={JSON.parse(props.report.proof).profilepicture}
                        onClick={() =>
                          window.open(
                            JSON.parse(props.report.proof).profilepicture
                          )
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const ReportAction = (props: { report: any; onCloseReport: Function }) => {
  const [ban, setBan] = useState<Boolean>();
  const { enqueueSnackbar } = useSnackbar();
  const [display, setDisplay] = useState("block");

  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/report/closeReport`, {
        reportID: props.report.id,
        reporterID: props.report.reporter.id,
        reporteeID: props.report.reportee.id,
        banReportee: ban,
      })
      .then((res) => {
        if (res.status === 200) {
          //props.handleCloseReport();
          enqueueSnackbar(`${ban ? "User banned and" : ""} report is closed!`, {
            variant: "info",
          });
          props.onCloseReport();
          setDisplay("none");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBan(event.target.value == 1 ? true : false);
  };
  return (
    <Card style={{ minWidth: "100%", display: display }}>
      <CardHeader title="Action" subheader="" />
      <CardContent>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Action</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value={1}>Ban User</MenuItem>
            <MenuItem value={0}>Do Nothing</MenuItem>
          </Select>
          <FormHelperText></FormHelperText>
        </FormControl>
        <FormControl fullWidth style={{ marginTop: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={ban === undefined}
          >
            Submit
          </Button>
        </FormControl>
      </CardContent>
    </Card>
  );
};

const DetailReport = (props: { report: any }) => {
  useEffect(() => {
    console.log(props.report);
  });
  return (
    <Container>
      <Grid container spacing={5} style={{ paddingTop: "2rem" }}>
        <Grid item xs={12}>
          <Box>
            <ReportInformation report={props.report} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box width>
            <ReportProof report={props.report} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          {props.report.status !== "Closed" ? (
            <ReportAction report={props.report} onCloseReport={() => {}} />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailReport;
