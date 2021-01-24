import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridGap: theme.spacing(1),
    },
  })
);

export { useStyles };
