import { Text } from "@mantine/core";
import useStyles from "./Lore.styles";

type Props = {
  text: string;
};
const Lore = ({ text }: Props) => {
  const { classes } = useStyles();

  return (
    <Text
      size="md"
      className={classes.lore}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default Lore;
