<template>
    <div class="grid">
        <div class="col-12 xl:col-12">
            <div class="card" v-if="loaded">
                <h5>Sales Overview</h5>
                <OverviewChart v-for="varNo in varAmount" :chart-data-variable="this.chartData.datasets[varNo - 1]"
                    :chart-data-label="this.chartData.labels" />
            </div>
        </div>
    </div>
</template>


<script>
import OverviewChart from '@/components/OverviewChart.vue';
import store from "@/store/index.js";

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
    components: { OverviewChart },
    data() {
        return {
            espid: 7884150,
            loaded: false,
            chartData: null,
            varAmount: 0
        }
    },
    async mounted() {

        this.loaded = false

        fetch(store.getters.serverURL + "/api/v1/" + this.espid,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${store.getters.accessToken}`
                }
            }
        )
            .then((res) => res.json())
            .then((data) => {
                // console.log(typeof data)
                // console.log(data)

                this.loaded = false;

                let size = Object.keys(data[0]).length;
                this.varAmount = size - 2;
                console.log("object size : " + size);

                var dataout = { labels: [], datasets: [] }

                let labels = [], datasets = [];

                data.forEach((document) => {

                    for (let i = 1; i <= size - 2; i++) {
                        if (!datasets[i - 1]) {
                            datasets.push({ label: Object.keys(data[0])[i], data: [] })
                        }
                        datasets[i - 1].data.push(Object.values(document)[i])
                    }
                    labels.push(Object.values(document)[size - 1])

                });


                dataout.labels = labels;
                dataout.datasets = datasets;


                this.chartData = dataout;
                // console.log(this.chartData);
                this.loaded = true
            })
            .catch((err) => {
                console.log("error occured", err)
            });


    }
}
</script>