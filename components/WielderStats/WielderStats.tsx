import { Group, Table } from "@mantine/core";
import { IconsDTO } from "../../lib/icons";
import { WielderDTO } from "../../lib/wielders";
import AppTooltip from "../AppTooltip/AppTooltip";
import SpriteSheet from "../SpriteSheet/SpriteSheet";
import { useTerms } from "../Terms/Terms";
import useStyles from "./WielderStats.styles";

type Props = {
  wielder: WielderDTO;
  icons: IconsDTO;
};
const WielderStats = ({ wielder, icons }: Props) => {
  const terms = useTerms();
  const { classes } = useStyles();

  return (
    <Table className={classes.table}>
      <tbody>
        <tr>
          <td>
            <AppTooltip label={terms.offenseDescription}>
              <Group spacing="xs">
                <SpriteSheet
                  spriteSheet={icons.StatsOffenceRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {terms.offense}
              </Group>
            </AppTooltip>
          </td>
          <td>{wielder.stats.offense}</td>
        </tr>
        <tr>
          <td>
            <AppTooltip label={terms.defenseDescription}>
              <Group spacing="xs">
                <SpriteSheet
                  spriteSheet={icons.StatsDefenseRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {terms.defense}
              </Group>
            </AppTooltip>
          </td>
          <td>{wielder.stats.defense}</td>
        </tr>
        <tr>
          <td>
            <AppTooltip label={terms.movementDescription}>
              <Group spacing="xs">
                <SpriteSheet
                  spriteSheet={icons.StatsMovementRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {terms.movement}
              </Group>
            </AppTooltip>
          </td>
          <td>{wielder.stats.movement}</td>
        </tr>
        <tr>
          <td>
            <AppTooltip label={terms.viewDescription}>
              <Group spacing="xs">
                <SpriteSheet
                  spriteSheet={icons.StatsViewRendered}
                  folder="icons"
                  resize={0.5}
                  inline
                />
                {terms.viewRadius}
              </Group>
            </AppTooltip>
          </td>
          <td>{wielder.stats.viewRadius}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default WielderStats;
