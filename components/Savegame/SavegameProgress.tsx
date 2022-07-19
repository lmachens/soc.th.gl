import { SavegameDeserialized } from "../../lib/savegames";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ColorHash from "color-hash";
import { useState } from "react";
import { Select, Stack, Title } from "@mantine/core";

const borderColorHash = new ColorHash();
const backgroundColorHash = new ColorHash({ lightness: 0.5 });

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const RESOURCE_TYPES = [
  "Gold",
  "Wood",
  "Stone",
  "AncientAmber",
  "Glimmerweave",
  "CelestialOre",
];
type Props = {
  savegame: SavegameDeserialized;
};
const SavegameProgress = ({ savegame }: Props) => {
  const [filter, setFilter] = useState("armyValue");

  const labels = Array(savegame.Metadata.Round)
    .fill(null)
    .map((_, index) => index + 1);

  const data = {
    labels,
    datasets: savegame.File._teamsSerializable.map((team) => {
      let data: number[] = [];
      switch (filter) {
        case "armyValue":
          data = team._statistics._roundStatistics.map(
            (roundStatistic) => roundStatistic.ArmyValue
          );
          break;
        case "lostBattles":
          data = team._statistics._roundStatistics.map(
            (roundStatistic) => roundStatistic.LostBattles
          );
          break;
        case "wonBattles":
          data = team._statistics._roundStatistics.map(
            (roundStatistic) => roundStatistic.WonBattles
          );
          break;
        case "gold":
          data = team._statistics._roundStatistics.map(
            (roundStatistic) => roundStatistic.Income[0]._amount
          );
          break;
      }
      return {
        label: team._name,
        data: data,
        borderColor: borderColorHash.hex(team._name),
        backgroundColor: backgroundColorHash.hex(team._name),
      };
    }),
  };

  return (
    <Stack>
      <Title order={3}>Overview</Title>
      <Select
        value={filter}
        onChange={(filter) => setFilter(filter!)}
        data={[
          { value: "armyValue", label: "Army Value" },
          { value: "lostBattles", label: "Lost Battles" },
          { value: "wonBattles", label: "Won Battles" },
          { value: "gold", label: "Gold" },
        ]}
      />
      <Line options={options} data={data} />
    </Stack>
  );
};

export default SavegameProgress;
