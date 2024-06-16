<template>
  <div v-if="_loaded">
    <Line :data="chartData" :options="chartOptions" height="200px" />
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
  props: ["chartDataVariable", "chartDataLabel", "newVar"],
  components: { Line },
  data() {
    return {
      _loaded: false,
      chartData: {},
      newVar: this.newVar,
      chartOptions: {
        maintainAspectRatio: false,
        responsive: true,
        backgroundColor: 'rgba(60,141,188,0.5)',
        borderColor: 'rgba(60,141,188,0.8)',
        fill: true,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        pointRadius: 0.5,
        tension: 0.1,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        plugins: {
          legend: {
            display: false,
          },
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

    // this.chart = new Chart(this.$refs.chart, {
    //   type: 'line',
    //   data: this.chartData,
    //   options: this.chartOptions,
    // });

  },
  // computed: {
  //     chartData() { return /* mutable chart data */ },
  // //     chartOptions() { return /* mutable chart options */ }
  //   }
  methods: {
    updateChart(updateVar) {
      // console.log(new Date());
      this.chartData = {
        ...this.chartData,
        labels: [...this.chartData.labels, new Date()],
        datasets: [{
          ...this.chartData.datasets[0],
          data: this.chartData.datasets[0].data = [...this.chartData.datasets[0].data, updateVar]
        }]
      }
    },
  },
  watch: {
    newVar(newvar, _) {
      // console.log(newvar);
      this.updateChart(newvar.value);
    }
  }
}
</script>