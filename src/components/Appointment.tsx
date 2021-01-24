import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { DateTime } from "luxon";

import { dateTimeToTimeString } from "../utils";

import type { AppointmentData } from "../types";

interface IProps {
  data: AppointmentData;
}

const useStyles = makeStyles({
  root: {
    backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
});

const Appointment = ({ data }: IProps) => {
  // TODO if the appointment takes all day how to show? a "all day" string?

  const classes = useStyles();

  return (
    <Box p={0.5} className={classes.root} borderRadius={2}>
      {dateTimeToTimeString(data.startDate)} -{" "}
      {dateTimeToTimeString(data.endDate)} - {data.title}
    </Box>
  );
};

export default Appointment;
