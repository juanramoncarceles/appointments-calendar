import { render } from "@testing-library/react";

import AppointmentFormDialog from "../components/AppointmentFormDialog";
import {
  CalendarStateContext,
  CalendarDispatchContext,
} from "../contexts/CalendarContext";

import type { CalendarContextState } from "../types";

describe("<AppointmentFormDialog/>", () => {
  const state: CalendarContextState = {
    isDialogOpen: true,
    selectedDay: undefined,
    appointments: [],
    stagingAppointment: undefined,
  };

  it("is open when context's isDialogOpen is true", () => {
    // I set it to true before passing it to context.
    state.isDialogOpen = true;

    // Dispatch context is required by hooks inside AppointmentFormDialog but it does nothing.
    const { queryByTestId } = render(
      <CalendarStateContext.Provider value={state}>
        <CalendarDispatchContext.Provider value={() => {}}>
          <AppointmentFormDialog />
        </CalendarDispatchContext.Provider>
      </CalendarStateContext.Provider>
    );

    expect(queryByTestId("appointment-dialog")).toBeTruthy();
  });

  it("is closed when context's isDialogOpen is false", () => {
    // I set it to false before passing it to context.
    state.isDialogOpen = false;

    // Dispatch context is required by hooks inside EventFormDialog but it does nothing.
    const { queryByTestId } = render(
      <CalendarStateContext.Provider value={state}>
        <CalendarDispatchContext.Provider value={() => {}}>
          <AppointmentFormDialog />
        </CalendarDispatchContext.Provider>
      </CalendarStateContext.Provider>
    );

    expect(queryByTestId("appointment-dialog")).toBeNull();
  });
});
