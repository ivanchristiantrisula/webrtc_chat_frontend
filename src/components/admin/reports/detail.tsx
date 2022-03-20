import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Container,
  Avatar,
  IconButton,
  makeStyles,
  Theme,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
  Button,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import axios from "axios";
import { report } from "process";
import { useEffect, useState } from "react";
import { getToken } from "../../../helper/localstorage";
import ChatBubble from "../../main/ChatBubble/ChatBubble";

const ReportInformation = (props: { report: any }) => {
  return (
    <>
      <Card>
        <CardHeader title="Report Information" subheader="Chat Report" />
        <CardContent>
          <Box>
            <Box width="100%" height="">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Reporter</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.reporter.id}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Reportee</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.reportee.id}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Report Type</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.type}
                    {" report"}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box width="100%" height="">
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
            <Box width="100%" height="">
              <Grid container>
                <Grid item xs={6}>
                  <Box textAlign="left">Description</Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="left" fontWeight="fontWeightBold">
                    {props.report.description}
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
  return (
    <>
      <Card>
        <CardHeader title="Proof" subheader="" />
        <CardContent>
          <Box>
            {JSON.parse(props.report.proof).map((element: any, idx: number) => {
              return (
                <ChatBubble data={element} userID={element.senderInfo.id} />
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

const ReportAction = (props: { report: any }) => {
  const [ban, setBan] = useState<Boolean>();

  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/report/closeReport`, {
        reportID: props.report.id,
        reporterID: props.report.reporter.id,
        reporteeID: props.report.reportee.id,
        banReportee: ban,
        token: getToken(),
      })
      .then((res) => {
        if (res.status === 200) {
          //props.handleCloseReport();
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
    <Card>
      <CardHeader title="Action" subheader="" />
      <CardContent>
        <FormControl>
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
          <FormControl fullWidth>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FormControl>
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
      <Grid container spacing={5}>
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
            <ReportAction report={props.report} />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailReport;
