import React, { ChangeEvent, useState, useEffect, useReducer } from "react";
import { DateTime } from "luxon";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { useCalendarState } from "../contexts/CalendarContext";
import { useCalendarDispatch } from "../contexts/CalendarContext";

import { dateTimeToPaddedTimeString } from "../utils";

type Action =
  | { type: "FORM_HEADING"; payload: string }
  | { type: "TITLE_VALUE"; payload: string }
  | { type: "TITLE_ERROR"; payload: boolean }
  | { type: "START_TIME_VALUE"; payload: string }
  | { type: "END_TIME_VALUE"; payload: string };

interface IState {
  formHeading: string;
  title: string;
  titleError: boolean;
  startTime: string;
  endTime: string;
}

const initialState: IState = {
  formHeading: "",
  title: "",
  titleError: false,
  startTime: "07:00", // TODO default could be 00:00? Google puts the current hour but every 30 min
  endTime: "08:00", // TODO default should be one hour after the start date?
};

const formReducer = (state: IState, action: Action) => {
  switch (action.type) {
    case "FORM_HEADING":
      return { ...state, formHeading: action.payload };
    case "TITLE_VALUE":
      return { ...state, title: action.payload };
    case "TITLE_ERROR":
      return { ...state, titleError: action.payload };
    case "START_TIME_VALUE":
      return { ...state, startTime: action.payload };
    case "END_TIME_VALUE":
      return { ...state, endTime: action.payload };
    default:
      throw new Error();
  }
};

const AppointmentFormDialog = () => {
  const { isDialogOpen, selectedDay, stagingAppointment } = useCalendarState();
  const calendarDispatch = useCalendarDispatch();

  // Temporary, could be used as the default start date in the form.
  const currentHourAndMinute = () => {
    const now = new Date();
    return `${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  // The values are destructured from the reducer's state.
  const [
    { formHeading, title, titleError, startTime, endTime },
    dispatch,
  ] = useReducer(formReducer, initialState);

  useEffect(() => {
    // Only if there is a stagingAppointment we are editing.
    if (isDialogOpen && stagingAppointment) {
      dispatch({ type: "FORM_HEADING", payload: "Editar" });
      dispatch({ type: "TITLE_VALUE", payload: stagingAppointment.title });
      // TODO If in the form instead of a time picker a date time picker was
      // used, the method dateTimeToTimeString() below should be replaced by
      // another that returns a complete date string.
      dispatch({
        type: "START_TIME_VALUE",
        payload: dateTimeToPaddedTimeString(stagingAppointment.startDate),
      });
      dispatch({
        type: "END_TIME_VALUE",
        payload: dateTimeToPaddedTimeString(stagingAppointment.endDate),
      });
    } else {
      dispatch({ type: "FORM_HEADING", payload: "Añadir" });
    }
  }, [isDialogOpen]);

  const titleHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate title...
    dispatch({ type: "TITLE_VALUE", payload: e.target.value });
  };

  const startDateHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate date...
    console.log("Start date", e.target.value);
    dispatch({ type: "START_TIME_VALUE", payload: e.target.value });
  };

  const endDateHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate end date. Is it after start date?
    console.log("End date", e.target.value);
    dispatch({ type: "END_TIME_VALUE", payload: e.target.value });
  };

  const handleClose = () => {
    calendarDispatch({ type: "CLOSE_DIALOG" });
    // Reset form values.
    dispatch({ type: "TITLE_VALUE", payload: "" });
    // TODO reset also the times to the defaults.
  };

  const handleSubmit = () => {
    // TODO Use a library to validate the form values.
    // For now I just check if title is now empty neither all spaces.
    // If everything is ok I dispatch and close the dialog.
    if (title.trim() !== "") {
      // Create the start and end date time objects. Used zone UTC for simplicity.
      // TODO if instead of time pickers a date time picker is used the context's
      // selectedDay wouldn't be necessary.
      const startDateTime = DateTime.fromISO(`${selectedDay}T${startTime}:00`, {
        zone: "utc",
      });
      const endDateTime = DateTime.fromISO(`${selectedDay}T${endTime}:00`, {
        zone: "utc",
      });
      calendarDispatch({
        type: "SUBMIT_APPOINTMENT",
        payload: { title, startDateTime, endDateTime },
      });
      handleClose();
    } else {
      dispatch({ type: "TITLE_ERROR", payload: true });
    }
  };

  // TODO Using a form would be more accessible? and better for submit with Enter and disable autoComplete...
  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        data-testid="appointment-dialog"
      >
        <DialogTitle id="form-dialog-title">{formHeading} Cita</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Para añadir una cita rellena los siguientes campos.
          </DialogContentText> */}
          <TextField
            required
            autoFocus
            margin="dense"
            id="title"
            label="Título"
            type="text"
            fullWidth
            error={titleError}
            helperText="Título incorrecto."
            value={title}
            onChange={e => titleHandler(e)}
          />
          <TextField
            required
            margin="dense"
            id="startDate"
            label="Hora de inicio"
            type="time"
            fullWidth
            value={startTime}
            onChange={e => startDateHandler(e)}
          />
          <TextField
            margin="dense"
            id="endDate"
            label="Hora de final"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endTime}
            onChange={e => endDateHandler(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentFormDialog;
