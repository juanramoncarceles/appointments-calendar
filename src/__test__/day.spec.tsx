import { render, screen } from "@testing-library/react";
import { DateTime } from "luxon";

import Day from "../components/Day";
import {
  CalendarStateContext,
  CalendarDispatchContext,
} from "../contexts/CalendarContext";

import type { DayDate, CalendarContextState } from "../types";
import { AppointmentData } from "../types";

describe("<Day/>", () => {
  it("displays an appointment", () => {
    // A random day for the appointment.
    const day = "2021-01-25";
    // Two random date times during the day.
    const startDateTime = DateTime.fromISO(`${day}T09:00:00Z`);
    const endDateTime = DateTime.fromISO(`${day}T09:30:00Z`);
    // The appointment
    const appointment = new AppointmentData(
      "",
      "An appointment title",
      startDateTime,
      endDateTime
    );

    const date: DayDate = {
      key: day,
      text: "",
      trailing: false,
      isWeekend: false,
    };

    const state: CalendarContextState = {
      isDialogOpen: false,
      selectedDay: undefined,
      appointments: [appointment],
      stagingAppointment: undefined,
    };

    // Dispatch context is required by hooks inside Day but it does nothing.
    render(
      <CalendarStateContext.Provider value={state}>
        <CalendarDispatchContext.Provider value={() => {}}>
          <Day date={date} />
        </CalendarDispatchContext.Provider>
      </CalendarStateContext.Provider>
    );

    // Exact is set to false because I don't care about the case and probably
    // the title will be part of a longer string with the time.
    expect(screen.getByText("An appointment title", { exact: false }));
  });
});
