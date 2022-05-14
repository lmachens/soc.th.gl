import { Text } from "@mantine/core";
import Term from "./Term";

type LevelDetailsProps = {
  bacteria: any;
  type: string;
  level: number;
};
const LevelDetails = ({ bacteria, type, level }: LevelDetailsProps) => {
  return (
    <Text>
      <Term term={`Skills/${type}/Level${level}/Description`} />
      {bacteria.modifierData?.map((modifier) => (
        <div key={modifier.type}>
          <Term
            term={`Modifiers/${modifier.modifier.replace(
              "Troop",
              ""
            )}/Description`}
            applicationType={modifier.applicationType}
            count={modifier.amountToAdd}
          />
        </div>
      ))}

      {/* {bacteria.resourcesIncome &&
        `Income +${bacteria.resourcesIncome[0].amount} of ${bacteria.resourcesIncome[0].type}`}
      {bacteria.durations?.map((duration) => (
        <div key={duration.type}>
          {terms
            .find((term) => term.type === "bacteriaDuration" && !term.id)
            ?.term.replace(" {0}", "")}{" "}
          <Text color="green">{duration.duration}</Text>{" "}
          <Term
            terms={terms}
            type="bacteriaDuration"
            id={duration.type}
            count={duration.duration}
          />
        </div>
      ))} */}
    </Text>
  );
};

export default LevelDetails;
