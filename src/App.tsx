import React from "react";
import { Container, Typography, Box, Link } from "@material-ui/core";

import { CalendarProvider } from "./contexts/CalendarContext";

import Calendar from "./components/Calendar";
import EventFormDialog from "./components/EventFormDialog";

const App = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <CalendarProvider>
          <Calendar />
          <EventFormDialog />
        </CalendarProvider>
        <Typography variant="body2" color="textSecondary" align="center">
          Ejercicio para Social WOW - Ramón Cárceles{" "}
          {/* <Link color="inherit" href="#">
            GitHub
          </Link> */}
        </Typography>
      </Box>
    </Container>
  );
};

export default App;
