import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      // rename to gridContainer7
      display: "grid",
      gridTemplateColumns: "repeat(7, minmax(0,1fr))",
      gridGap: theme.spacing(1),
    },
    mbAllButLast: {
      "& > *:not(:last-child)": {
        marginBottom: theme.spacing(0.5),
      },
    },
  })
);

export { useStyles };
