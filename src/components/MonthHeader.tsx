import React from "react";
import { Box, Typography } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import type { WeekDay } from "../types";
import { useStyles } from "../hooks/useStyles";

const Root = styled(Box)({
  position: "sticky",
  top: 0,
  marginBottom: 4,
  zIndex: 20,
  color: "#fff",
  backgroundColor: "#fff",
});

interface IProps {
  weekDays: WeekDay[];
}

const MonthHeader = ({ weekDays }: IProps) => {
  const classes = useStyles();

  return (
    <Root p={1} className={classes.container}>
      {weekDays.map(weekDay => (
        <Typography
          key={weekDay.short}
          component="h4"
          align="center"
          style={{
            borderRadius: 2,
            backgroundColor: "#7aa0a8",
          }}
        >
          {weekDay.long}
        </Typography>
      ))}
    </Root>
  );
};

export default MonthHeader;
