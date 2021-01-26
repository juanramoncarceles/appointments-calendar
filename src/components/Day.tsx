import React, { MouseEvent, KeyboardEvent } from "react";
import { Box, Typography } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { DateTime } from "luxon";

import Appointment from "./Appointment";

import {
  useCalendarDispatch,
  useCalendarState,
} from "../contexts/CalendarContext";

import type { DayDate } from "../types";
import { useStyles } from "../hooks/useStyles";

const Root = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minHeight: 110,
  padding: 6,
  border: "1px solid #88b0b8",
  borderRadius: 2,
  position: "relative",
  outline: "none",
  boxShadow: "2px 2px 0px #88b0b8",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",

  "&:hover, &:focus": {
    transform: "translate(-2px, -2px)",
    boxShadow: "4px 4px 0px #88b0b8",
    zIndex: 10,
  },
});

const AContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  maxHeight: 115,
  overflowY: "hidden",
  borderRadius: 6,
  backgroundColor: "inherit",

  "&:hover": {
    overflowY: "visible",
  },

  "& > div": {
    flexGrow: 1,
    padding: 2,
    backgroundColor: "inherit",
  },

  "&:hover > div": {
    outline: "1px solid #aec8cd",
  },
});

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
    <Root
      tabIndex={0}
      onClick={e => clickHandler(e)}
      onKeyDown={e => e.key === "Enter" && clickHandler(e)}
      bgcolor={date.isWeekend ? "#f4f1ce" : "white"}
      style={{
        opacity: date.trailing ? 0.4 : 1,
      }}
    >
      <Typography component="h5" align="center" gutterBottom>
        {date.text}
      </Typography>
      <AContainer>
        <div className={classes.mbAllButLast}>
          {appointments
            .filter(a => a.daysInterval.contains(DateTime.fromISO(date.key)))
            .map(a => (
              <Appointment key={a.id} data={a} />
            ))}
        </div>
      </AContainer>
    </Root>
  );
};

export default Day;
