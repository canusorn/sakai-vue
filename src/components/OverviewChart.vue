<template>
  <div v-if="_loaded" class="container">
    <Line  :data="chartData" />
  </div>
    <h5 v-else >Loading...</h5>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend)

export default {
  name: 'OverviewChart',
  props: ["chartDataVariable", "chartDataLabel"],
  components: { Line },
  data() {
    return {
      _loaded: false,
      chartData: null
    }
  },
  mounted() {

    this._loaded = false

    var dataout = { labels: [], datasets: [] }

    console.log(this.chartDataVariable);

    dataout.labels = this.chartDataLabel;

    dataout.datasets = [this.chartDataVariable];

    this.chartData = dataout;

    this._loaded = true

  }
}
</script>