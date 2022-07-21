import { Box, Text } from "@mantine/core";
import { ReactNode } from "react";
import useStyles from "./MetaLine.styles";

type Props = {
  label: ReactNode;
  value: ReactNode;
};
const MetaLine = ({ label, value }: Props) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.label}>{label}</Text>
      <Text className={classes.value}>{value}</Text>
    </Box>
  );
};

export default MetaLine;
