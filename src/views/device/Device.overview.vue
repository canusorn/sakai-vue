<template>
    <div class="col-12">
        <div class="grid">
            <div class="col-12 sm:col-4 lg:col-2" v-if="loaded" v-for="varNo in varAmount">
                <value-display :label="this.chartData.datasets[varNo - 1].label"
                    :value="Object.values(this.msg)[varNo - 1] ? Object.values(this.msg)[varNo - 1] : this.chartData.datasets[varNo - 1].data[[this.chartData.datasets[varNo - 1].data.length - 1]]">
                </value-display>
            </div>
        </div>
    </div>

    <div class="col-12 lg:col-6" v-if="loaded" v-for="varNo in varAmount">
        <overview-chart :chart-data-variable="this.chartData.datasets[varNo - 1]"
            :chart-data-label="this.chartData.labels"
            :new-var="{ value: Object.values(this.msg)[varNo - 1], label: new Date() }" />

    </div>
</template>


<script>
import OverviewChart from '@/components/OverviewChart.vue';
import ValueDisplay from '@/components/ValueDisplay.vue';

export default {
    components: { OverviewChart, ValueDisplay },
    name: 'DeviceOverview',
    props: ['msg', 'chartData', 'loaded','varAmount'],
}

</script>