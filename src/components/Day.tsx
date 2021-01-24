import React from "react";
import { Box, Typography } from "@material-ui/core";
import { DateTime } from "luxon";

import Appointment from "./Appointment";

import {
  useCalendarDispatch,
  useCalendarState,
} from "../contexts/CalendarContext";

import type { DayDate } from "../types";
import { useStyles } from "../hooks/useStyles";

interface IProps {
  date: DayDate;
}

const Day = ({ date }: IProps) => {
  const calendarDispatch = useCalendarDispatch();
  const { appointments } = useCalendarState();

  const classes = useStyles();

  return (
    <Box
      onClick={() =>
        calendarDispatch({ type: "OPEN_DIALOG", payload: date.key })
      }
      display="flex"
      flexDirection="column"
      p={1}
      bgcolor={date.isWeekend ? "palegoldenrod" : "white"}
    >
      <Typography component="h5" align="center" gutterBottom>
        {date.text}
      </Typography>
      <div className={classes.mbAllButLast}>
        {appointments
          .filter(a => a.daysInterval.contains(DateTime.fromISO(date.key)))
          .map(a => (
            <Appointment key={a.id} data={a} />
          ))}
      </div>
    </Box>
  );
};

export default Day;
