import React from "react";
import { Box } from "@material-ui/core";

import Day from "./Day";

import type { DayDate } from "../types";
import { useStyles } from "../hooks/useStyles";

interface IProps {
  dates: DayDate[];
}

const MonthGrid = ({ dates }: IProps) => {
  const classes = useStyles();

  return (
    <Box bgcolor="lightgray" p={1} className={classes.container}>
      {dates.map(date => (
        <Day key={date.key} date={date} />
      ))}
    </Box>
  );
};

export default MonthGrid;
