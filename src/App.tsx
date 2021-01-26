import React from "react";
import { Container, Box, Link } from "@material-ui/core";

import { CalendarProvider } from "./contexts/CalendarContext";

import Calendar from "./components/Calendar";
import AppointmentFormDialog from "./components/AppointmentFormDialog";

const App = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <CalendarProvider>
          <Calendar />
          <AppointmentFormDialog />
        </CalendarProvider>
        <Box color="textSecondary" textAlign="center" mt={2}>
          <Link
            color="inherit"
            href="https://github.com/juanramoncarceles/appointments-calendar"
            target="_blank"
          >
            GitHub
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
