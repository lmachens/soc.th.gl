import { SavegameDeserialized } from "../../lib/savegames";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

type Props = {
  savegame: SavegameDeserialized;
};
const SavegameGraphs = ({ savegame }: Props) => {
  const labels = savegame.File._teamsSerializable.map((team) => team._name);

  const data = {
    labels,
    datasets: [
      {
        label: "Army Value",
        data: savegame.File._teamsSerializable.map(
          (team) => team._statistics._roundStatistics.at(-1)?.ArmyValue || 0
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Won Battles",
        data: savegame.File._teamsSerializable.map((team) =>
          team._statistics._roundStatistics.reduce(
            (acc, cur) => acc + cur.WonBattles,
            0
          )
        ),
        borderColor: "rgb(74, 235, 53)",
        backgroundColor: "rgba(53, 208, 235, 0.5)",
      },
      {
        label: "Lost Battles",
        data: savegame.File._teamsSerializable.map((team) =>
          team._statistics._roundStatistics.reduce(
            (acc, cur) => acc + cur.LostBattles,
            0
          )
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default SavegameGraphs;
