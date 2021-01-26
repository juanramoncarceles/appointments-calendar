import React, { ChangeEvent, useState, useEffect } from "react";
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

  // TODO useReducer here to simplify state management.
  const [formHeading, setFormHeading] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [startTime, setStartDateTime] = useState("07:00"); // TODO default could be 00:00? Google puts the current hour but every 30 min
  const [endTime, setEndDateTime] = useState("08:00"); // TODO default should be one hour after the start date?

  useEffect(() => {
    // Only if there is a stagingAppointment we are editing.
    if (isDialogOpen && stagingAppointment) {
      setFormHeading("Editar");
      setTitle(stagingAppointment.title);
      // TODO If in the form instead of a time picker a date time picker was
      // used, the method dateTimeToTimeString() below should be replaced by
      // another that returns a complete date string.
      setStartDateTime(
        dateTimeToPaddedTimeString(stagingAppointment.startDate)
      );
      setEndDateTime(dateTimeToPaddedTimeString(stagingAppointment.endDate));
    } else {
      setFormHeading("Añadir");
    }
  }, [isDialogOpen]);

  const titleHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate title...
    setTitle(e.target.value);
  };

  const startDateHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate date...
    console.log("Start date", e.target.value);
    setStartDateTime(e.target.value);
  };

  const endDateHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate end date. Is it after start date?
    console.log("End date", e.target.value);
    setEndDateTime(e.target.value);
  };

  const handleClose = () => {
    calendarDispatch({ type: "CLOSE_DIALOG" });
    // Reset form values.
    setTitle("");
    // TODO reset also the times to the defaults.
  };

  const handleSubmit = () => {
    // TODO Use a library to validate the form values.
    // For now I just check if title is now empty neither all spaces.
    // If everything is ok I dispatch and close the dialog.
    if (title.trim() !== "") {
      // Create the start and end date time objects.
      // TODO if instead of time pickers a date time picker is used the context's
      // selectedDay wouldn't be necessary.
      const startDateTime = DateTime.fromISO(`${selectedDay}T${startTime}:00Z`);
      const endDateTime = DateTime.fromISO(`${selectedDay}T${endTime}:00Z`);
      calendarDispatch({
        type: "SUBMIT_APPOINTMENT",
        payload: { title, startDateTime, endDateTime },
      });
      handleClose();
    } else {
      setTitleError(true);
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
