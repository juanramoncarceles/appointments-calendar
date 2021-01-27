import { createContext, useContext, useReducer, ReactNode } from "react";

import { uuidv4 } from "../utils";

import { AppointmentData } from "../types";
import type { CalendarContextState, AppointmentFormData } from "../types";

// All action types should be added here and TypeScript will take care of the rest.
type Action =
  | { type: "NEW_APPOINTMENT"; payload: string }
  | { type: "CLOSE_DIALOG" }
  | { type: "SUBMIT_APPOINTMENT"; payload: AppointmentFormData }
  | { type: "EDIT_APPOINTMENT"; payload: string };

type Dispatch = (action: Action) => void;

const initialState: CalendarContextState = {
  isDialogOpen: false,
  selectedDay: undefined,
  appointments: [],
  stagingAppointment: undefined,
};

// I split state and dispatch to avoid problems with context, especially when calling dispatch in effects.
const CalendarStateContext = createContext<CalendarContextState | undefined>(
  undefined
);
const CalendarDispatchContext = createContext<Dispatch | undefined>(undefined);

// This is the reducer that will manage the state of the context.
const calendarReducer = (state: CalendarContextState, action: Action) => {
  switch (action.type) {
    // Opens the form dialog, sets the selected day and clears stagingAppointment.
    case "NEW_APPOINTMENT":
      return {
        ...state,
        isDialogOpen: true,
        selectedDay: action.payload,
        stagingAppointment: undefined,
      };
    case "CLOSE_DIALOG":
      // TODO clear also the selectedDay value ?
      return { ...state, isDialogOpen: false, stagingAppointment: undefined };
    case "SUBMIT_APPOINTMENT": {
      // The data from the appointment form.
      const appointmentData = action.payload;
      // If it is an edit of an existing appointment here I get the old data.
      const existingAppointment = state.stagingAppointment;
      // The new state will be temporarily referenced here.
      let newState: CalendarContextState;
      // If the appointment doesn't exist yet it is added, otherwise it is replaced.
      if (existingAppointment) {
        const updatedAppointment = new AppointmentData(
          existingAppointment.id,
          appointmentData.title,
          appointmentData.startDateTime,
          appointmentData.endDateTime
        );
        // The new state with the appointment replaced.
        newState = {
          ...state,
          appointments: state.appointments.map(a =>
            a.id === existingAppointment.id ? updatedAppointment : a
          ),
        };
      } else {
        // TODO The id for the new appointment would actually be from the database.
        const id = uuidv4();
        // Create a new appointment.
        const newAppointment = new AppointmentData(
          id,
          action.payload.title,
          action.payload.startDateTime,
          action.payload.endDateTime
        );
        // The new state with the appointment added.
        newState = {
          ...state,
          appointments: [...state.appointments, newAppointment],
        };
      }
      // Save the appointments data to localStorage.
      localStorage.setItem(
        "appointments",
        JSON.stringify(newState.appointments)
      );

      return newState;
    }
    case "EDIT_APPOINTMENT":
      // Open the dialog and find the data of the appointment to be edited.
      {
        // Find the appointment data by id.
        const appointment = state.appointments.find(
          a => a.id === action.payload
        );
        // TODO If in the future an appointment could start and end in different days there
        // wouldn't be a state.selectedDay but instead two complete dateTimes.
        // For now I just use the startDate to get the day since both (start and end) are the same.
        if (appointment) {
          return {
            ...state,
            isDialogOpen: true,
            stagingAppointment: appointment,
            selectedDay: appointment.startDate.toISODate(),
          };
        }
        console.error(`No appointment found with id ${action.payload}`);
      }
      return state;
    default:
      throw new Error(`Unhandled action: ${action}`);
  }
};

interface IProps {
  children: ReactNode;
}

// The actual context provider. It should be placed above a consumer in the tree.
const CalendarProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarStateContext.Provider value={state}>
      <CalendarDispatchContext.Provider value={dispatch}>
        {children}
      </CalendarDispatchContext.Provider>
    </CalendarStateContext.Provider>
  );
};

// Those two custom hooks below will get the context from the nearest
// CalendarProvider, and if there is none, they throw a helpful error message.

const useCalendarState = () => {
  const context = useContext(CalendarStateContext);
  if (context === undefined) {
    throw new Error("useCalendarState must be used within a CalendarProvider");
  }
  return context;
};

const useCalendarDispatch = () => {
  const context = useContext(CalendarDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarDispatch must be used within a CalendarProvider"
    );
  }
  return context;
};

// CalendarStateContext and CalendarDispatchContext are exported for testing.
export {
  CalendarProvider,
  CalendarStateContext,
  CalendarDispatchContext,
  useCalendarState,
  useCalendarDispatch,
};
