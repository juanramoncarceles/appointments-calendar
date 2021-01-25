import { createContext, useContext, useReducer, ReactNode } from "react";

import { uuidv4 } from "../utils";

import { AppointmentData } from "../types";
import type { AppointmentFormData } from "../types";

type Action =
  | { type: "NEW_APPOINTMENT"; payload: string }
  | { type: "CLOSE_DIALOG" }
  | { type: "SUBMIT_APPOINTMENT"; payload: AppointmentFormData }
  | { type: "EDIT_APPOINTMENT"; payload: string };

type Dispatch = (action: Action) => void;

interface IState {
  isDialogOpen: boolean;
  selectedDay: string | undefined; // example: 2021-01-10
  appointments: AppointmentData[];
  stagingAppointment: AppointmentData | undefined; // The appointment being updated.
}

const initialState: IState = {
  isDialogOpen: false,
  selectedDay: undefined,
  appointments: [],
  stagingAppointment: undefined,
};

const CalendarStateContext = createContext<IState | undefined>(undefined);
const CalendarDispatchContext = createContext<Dispatch | undefined>(undefined);

const calendarReducer = (state: IState, action: Action) => {
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
      let newState: IState;
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

const CalendarProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  console.log("Context state:", state);

  return (
    <CalendarStateContext.Provider value={state}>
      <CalendarDispatchContext.Provider value={dispatch}>
        {children}
      </CalendarDispatchContext.Provider>
    </CalendarStateContext.Provider>
  );
};

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

export { CalendarProvider, useCalendarState, useCalendarDispatch };
