import { Text, Tooltip, TooltipProps } from "@mantine/core";

const AppTooltip = (props: TooltipProps) => {
  const label =
    typeof props.label === "string" ? (
      <Text size="sm" dangerouslySetInnerHTML={{ __html: props.label }} />
    ) : (
      props.label
    );

  return <Tooltip {...props} label={label} />;
};

export default AppTooltip;
