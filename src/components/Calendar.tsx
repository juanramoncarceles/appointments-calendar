import React, { useState } from "react";
import { DateTime, Interval } from "luxon";
import { Typography } from "@material-ui/core";

import { getWeekdaysDescriptions, getMonthCalendarGrid } from "../utils";

import CalendarHeader from "./CalendarHeader";
import MonthHeader from "./MonthHeader";
import MonthGrid from "./MonthGrid";

const Calendar = () => {
  const [activeMonth, setActiveMonth] = useState(() => {
    const currentDate = new Date();
    return DateTime.fromISO(currentDate.toISOString()).toFormat("yyyy-MM");
  });

  const weekDays = getWeekdaysDescriptions();

  const monthDates = getMonthCalendarGrid(activeMonth);

  return (
    <div>
      <CalendarHeader month={activeMonth} />
      <Typography align="center" gutterBottom>
        Seleccione un día para añadir una cita
      </Typography>
      {/* wrap the two elements below in a <CalendarView /> */}
      <MonthHeader weekDays={weekDays} />
      <MonthGrid dates={monthDates} />
    </div>
  );
};

export default Calendar;
