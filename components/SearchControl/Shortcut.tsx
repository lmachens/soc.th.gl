import { Text } from "@mantine/core";
import { useOs } from "@mantine/hooks";

const Shortcut = () => {
  const os = useOs();

  return (
    <Text
      weight={700}
      sx={(theme) => ({
        fontSize: 11,
        lineHeight: 1,
        padding: "4px 7px",
        borderRadius: theme.radius.sm,
        color: theme.colors.dark[0],
        border: `1px solid ${theme.colors.dark[6]}`,
        backgroundColor: theme.colors.dark[6],

        [theme.fn.smallerThan("sm")]: {
          display: "none",
        },
      })}
    >
      {os === "undetermined" || os === "macos" ? "⌘" : "Ctrl"} + K
    </Text>
  );
};

export default Shortcut;
