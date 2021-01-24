import { createContext, useContext, useReducer, ReactNode } from "react";

import type { Appointment } from "../types";

type Action =
  | { type: "OPEN_DIALOG"; payload: string }
  | { type: "CLOSE_DIALOG"; payload: null }
  | { type: "CREATE_APPOINTMENT"; payload: Appointment }
  | { type: "EDIT_APPOINTMENT"; payload: Appointment };

type Dispatch = (action: Action) => void;

interface IState {
  isDialogOpen: boolean;
  selectedDay: string | undefined; // example: 2021-01-10
}

const initialState: IState = {
  isDialogOpen: false,
  selectedDay: undefined,
};

const CalendarStateContext = createContext<IState | undefined>(undefined);
const CalendarDispatchContext = createContext<Dispatch | undefined>(undefined);

const calendarReducer = (state: IState, action: Action) => {
  switch (action.type) {
    case "OPEN_DIALOG":
      // console.log("OPEN_DIALOG", action.payload);
      return { ...state, isDialogOpen: true, selectedDay: action.payload };
    case "CLOSE_DIALOG":
      return { ...state, isDialogOpen: false };
    case "CREATE_APPOINTMENT":
      console.log(action.payload);
      // TODO Update state with the form values adding a new appointment to the array.
      return state;
    case "EDIT_APPOINTMENT":
      console.log(action.payload);
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
