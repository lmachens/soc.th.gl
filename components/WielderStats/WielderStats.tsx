import { Table } from "@mantine/core";
import { WielderDTO } from "../../lib/wielders";
import { useTerms } from "../Terms/Terms";
import useStyles from "./WielderStats.styles";

type Props = {
  wielder: WielderDTO;
};
const WielderStats = ({ wielder }: Props) => {
  const terms = useTerms();
  const level = wielder.skills
    ? wielder.skills.find((skill) => skill.type === "Command")?.level ||
      wielder.skills.at(-1)?.level
    : 0;
  const { classes } = useStyles();

  return (
    <Table className={classes.table}>
      <tbody>
        <tr>
          <td>{terms.offense}</td>
          <td>{wielder.stats.offense}</td>
        </tr>
        <tr>
          <td>{terms.defense}</td>
          <td>{wielder.stats.defense}</td>
        </tr>
        <tr>
          <td>{terms.movement}</td>
          <td>{wielder.stats.movement}</td>
        </tr>
        <tr>
          <td>{terms.viewRadius}</td>
          <td>{wielder.stats.viewRadius}</td>
        </tr>
        <tr>
          <td>{terms.command}</td>
          <td>{level}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default WielderStats;
