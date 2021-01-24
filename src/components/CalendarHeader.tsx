import React from "react";

import { Typography } from "@material-ui/core";

import { getDisplayMonthAndYear } from "../utils";

interface IProps {
  month: string;
}

const CalendarHeader = ({ month }: IProps) => {
  const monthAndYearString = getDisplayMonthAndYear(month);

  return (
    <Typography variant="h1" align="center" gutterBottom>
      {monthAndYearString}
    </Typography>
  );
};

export default CalendarHeader;
