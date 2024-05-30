<template>
  <div v-if="_loaded" class="container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
  <h5 v-else>Loading...</h5>
</template>

<script>
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
  Filler)

export default {
  name: 'OverviewChart',
  props: ["chartDataVariable", "chartDataLabel"],
  components: { Line },
  data() {
    return {
      _loaded: false,
      chartData: {
      },
      chartOptions: {
        borderColor: "rgba(200, 20, 20, 0.9)",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        // color:"rgba(1, 0, 0, 1)",
        fill: true,
        responsive: true,
        tension: 0.1,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            type: 'time',
            ticks: {
              source: 'auto',
              // Disabled rotation for performance
              maxRotation: 0,
              autoSkip: true,
            }
          }
        }
      }
    }
  },
  mounted() {

    this._loaded = false

    const dataout = { labels: this.chartDataLabel, datasets: [this.chartDataVariable] }

    // dataout.datasets[0]["borderColor"]= "rgba(200, 20, 20, 0.9)";
    // dataout.datasets[0]["backgroundColor"]="rgba(255, 0, 0, 0.5)"
    // dataout.datasets[0]["color"]="rgba(0, 0, 0, 0)"
    // dataout.datasets[0]["fill"]= true;
    // dataout.datasets[0]["tension"]="0.5"

    this.chartData = dataout;

    // console.log(this.chartData);

    this._loaded = true

  }
}
</script>