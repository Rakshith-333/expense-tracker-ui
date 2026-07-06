import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  registerables
} from 'chart.js';


Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  ...registerables
);