import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#88b0b8",
    },
    secondary: {
      main: "#dd57c0",
    },
    error: {
      main: "#da4848",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
