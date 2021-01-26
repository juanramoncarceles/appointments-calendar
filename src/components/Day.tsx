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

  "&:hover .appointment-identifier": {
    backgroundImage: "linear-gradient(45deg, #f494a9 30%, #f6957a 90%)",
  },
});

const AContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  maxHeight: 115,
  overflowY: "hidden",
  overflowX: "hidden",
  borderRadius: 6,

  "&:hover": {
    overflowY: "visible",
    overflowX: "visible",
  },

  "& > div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 1,
    padding: 2,
  },

  "& .appointment-identifier": {
    backgroundImage: "linear-gradient(45deg, #ebd7db 30%, #f1d3ca 90%)",
  },

  "& .appointment-identifier:hover": {
    backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
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
    let appointmentContainer: Element;
    if ((appointmentContainer = target.closest(".appointment-identifier"))) {
      calendarDispatch({
        type: "EDIT_APPOINTMENT",
        payload: appointmentContainer.id,
      });
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
            // Keep comparison time as 00:00:00 because contains() is inclusive, and otherwise if
            // appointments are longer than a day it could fail, because if if I set a time during
            // the day and the appointment ends that day but at a time before, the day will be excluded.
            // Important to add the Z at the end to compare as UTC, like the start and end dates were created.
            .filter(a =>
              a.daysInterval.contains(DateTime.fromISO(`${date.key}T00:00:00Z`))
            )
            // TODO this will not work if in the future appointments can start
            // and end in differnt days. For that filter again to put first the
            // ones that start in a previous day and sort the rest and concat.
            .sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis())
            .map(a => (
              <Appointment key={a.id} data={a} />
            ))}
        </div>
      </AContainer>
    </Root>
  );
};

export default Day;
