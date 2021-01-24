import React, { ChangeEvent, useState } from "react";
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

const EventFormDialog = () => {
  const { isDialogOpen, selectedDay } = useCalendarState();
  const calendarDispatch = useCalendarDispatch();

  // Temporary, could be used as the default start date in the form.
  const currentHourAndMinute = () => {
    const now = new Date();
    return `${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [startDate, setStartDate] = useState("07:00"); // TODO default could be 00:00? Google puts the current hour but every 30 min
  const [endDate, setEndDate] = useState("08:00"); // TODO default should be one hour after the start date?

  const handleClose = () => {
    calendarDispatch({ type: "CLOSE_DIALOG", payload: null });
  };

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
    setStartDate(e.target.value);
  };

  const endDateHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // TODO Validate end date. Is it after start date?
    console.log("End date", e.target.value);
    setEndDate(e.target.value);
  };

  const handleSubmit = () => {
    // TODO Check if there are errors, if not dispatch and close the dialog, otherwise set errors on TextFields.
    if (title != "") {
      // Creating the appointment object.
      const appointmentData = {
        id: "testId", // TODO this could be an uuid or a combination of title and exact date
        title: title,
        startDate: new Date(`${selectedDay}T${startDate}:00Z`),
        endDate: new Date(`${selectedDay}T${endDate}:00Z`),
      };
      // Dipatch action to create the appointm
      calendarDispatch({
        type: "CREATE_APPOINTMENT",
        payload: appointmentData,
      });
      // Dipatch action to close the dilog.
      calendarDispatch({ type: "CLOSE_DIALOG", payload: null });
    } else {
      setTitleError(true);
    }
  };

  // TODO Using a form would be more accessible?
  return (
    <div>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Añadir Cita</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para añadir una cita rellena los siguientes campos.
          </DialogContentText>
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
            value={startDate}
            onChange={e => startDateHandler(e)}
          />
          <TextField
            margin="dense"
            id="endDate"
            label="Hora de final"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
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

export default EventFormDialog;
