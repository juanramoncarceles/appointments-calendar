import React from "react";
import { Typography } from "@material-ui/core";

import type { WeekDay } from "../types";
import { useStyles } from "../hooks/useStyles";

interface IProps {
  weekDays: WeekDay[];
}

const MonthHeader = ({ weekDays }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {weekDays.map(weekDay => (
        <Typography key={weekDay.short} component="h4" align="center">
          {weekDay.long}
        </Typography>
      ))}
    </div>
  );
};

export default MonthHeader;
