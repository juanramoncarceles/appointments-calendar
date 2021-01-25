import React, { MouseEvent, KeyboardEvent } from "react";
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

  /**
   * Handles if the click occurs in the day itself or in an appointment item inside.
   * This is to avoid individual handlers and having to use stopPropagation() in the child ones.
   * TODO The type of the param should be `MouseEvent | KeyboardEvent` but there is a problem with
   * the compiler and I can't cast values neither use a type guard. Cast would be: `target as Element`
   */
  const clickHandler = (e: any) => {
    const target = e.target;
    if (target.closest(".appointment-identifier")) {
      calendarDispatch({ type: "EDIT_APPOINTMENT", payload: target.id });
    } else {
      calendarDispatch({ type: "NEW_APPOINTMENT", payload: date.key });
    }
  };

  // TODO The day and event should be able to have focus, use tabIndex or buttons.
  return (
    <Box
      tabIndex={0}
      onClick={e => clickHandler(e)}
      onKeyDown={e => e.key === "Enter" && clickHandler(e)}
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
