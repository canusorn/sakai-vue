<script>
import store from '@/store/index.js';
import { isProxy, toRaw } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

// const device = reactive(store.state.device);


// watch(device, (newX) => {
//     //   console.log(newX);
//     console.dir(newX.device.device[0].espid);
//     for (const devic in newX.device) {
//         console.table(devic.espid);
//     }
// })

// onMounted(() => {
//   console.log(store.state.device)
// })

export default {
    components: { AppMenuItem },
    data() {
        return {
            model: null, devices: null, deviceloaded: false
        }
    }, watch: {

    }, beforeMount() {
        this.modelupdate();
        // console.log(this.$store.getters.device);
    }, conputed: {

    },
    methods: {
        async modelupdate() {
            
            // console.log(this.$store.getters.device)
            let devicelist = [];
            this.devices = this.$store.getters.device;
            for (var dec in this.devices) {
                // console.log(this.devices.device[dec]); 
                devicelist.push({
                    label: this.devices[dec].name,
                    icon: 'pi pi-fw pi-wifi',
                    to: '/device/' + this.devices[dec].espid
                });
                // console.log(dec); 
            }
            // console.log(devicelist);

            const models = [{
                label: 'My Devices',
                items: [{
                    label: 'Device', icon: 'pi pi-fw pi-home', to: '/device',
                    items: devicelist
                }]
            }];


            // models[0].items[0].items[0] = devicelist;
            // console.log(models[0].items[0].items[0]);
            // console.log(models);

            this.model = models;
            // console.log(this.model);
            this.deviceloaded = true;
        }
    }
}
</script>

<template>
    <ul class="layout-menu" v-if="this.deviceloaded">
        <template v-for="( item, i ) in  this.model " :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li>
    </ul>
</template>

<style lang="scss" scoped></style>
