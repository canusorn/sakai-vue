<template>
    <div class="grid" v-if="this.$store.getters.device">
        <div class="col-12 md:col-4" v-for="device in this.$store.getters.device">
            <div class="card shadow-2 p-3 border-round">
                <div class="flex justify-content-center">

                    <div>
                        <router-link :to="'/device/' + device.espid">
                            <div class="text-center text-900 font-medium text-xl text-primary mb-3">{{ device.name }}
                            </div>
                        </router-link>
                        <span class="text-center block text-300 font-medium"><small>{{ device.espid }}</small></span>
                    </div>

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
}
</script>