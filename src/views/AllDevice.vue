<template>
    <div class="grid">
        <div class="col-12 md:col-3" v-for="device in devices">
            <div class="card shadow-2 p-3 border-round">
                <div class="flex justify-content-center mb-3">
                    <router-link :to="'/device/' + device.espid">
                        <div>
                            <span class="text-center block text-500 font-medium mb-3">{{ device.espid }}</span>
                            <div class="text-center text-900 font-medium text-xl text-primary">{{ device.name }}</div>
                        </div> 
                    </router-link>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span>
                    <span class="text-500">since last visit</span> -->
            </div>
        </div>
    </div>
</template>


<script>
// import store from '@/store/index.js';

export default {
    data() {
        return {
            devices: this.$store.getters.device,
        }
    },
    methods: {
        initChart() {

        }
    },
    mounted() {
        // console.log(store.getters.device);
        this.$store.dispatch('getDevice');
    },
}
</script>