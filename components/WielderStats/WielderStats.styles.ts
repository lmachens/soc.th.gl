import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  table: {
    width: "auto",
    td: {
      ":first-of-type": {
        width: "30%",
        minWidth: 200,
      },
      ":not(:first-of-type)": {
        color: theme.colors[theme.primaryColor][2],
      },
    },
  },
}));
