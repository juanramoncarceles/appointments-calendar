import React from "react";
import Box from "@material-ui/core/Box";

import { useCalendarDispatch } from "../contexts/CalendarContext";

import type { DayDate } from "../types";

interface IProps {
  date: DayDate;
}

const Day = ({ date }: IProps) => {
  const calendarDispatch = useCalendarDispatch();

  return (
    <Box
      onClick={() =>
        calendarDispatch({ type: "OPEN_DIALOG", payload: date.key })
      }
      p={1}
      bgcolor={date.isWeekend ? "palegoldenrod" : "white"}
    >
      {date.text}
    </Box>
  );
};

export default Day;
