<script>
// import store from '@/store/index.js';
// import { isProxy, toRaw } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
// import { mapState } from 'vuex';

export default {
    components: { AppMenuItem },
    data() {
        return {
            model:
                [
                    {},
                    {
                        label: 'Get Started',
                        items: [
                            {
                                label: 'Documentation',
                                icon: 'pi pi-fw pi-question',
                                to: '/documentation'
                            },
                            {
                                label: 'View Source',
                                icon: 'pi pi-fw pi-search',
                                url: 'https://github.com/primefaces/sakai-vue',
                                target: '_blank'
                            },
                        ]
                    },
                    {
                        label: 'Hierarchy',
                        items: [
                            {
                                label: 'Submenu 1',
                                icon: 'pi pi-fw pi-bookmark',
                                to: '/uikit/formlayout',
                            },
                            {
                                label: 'Submenu 2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    {
                                        label: 'Submenu 2.1',
                                        icon: 'pi pi-fw pi-bookmark',
                                        items: [
                                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                        ]
                                    },
                                    {
                                        label: 'Submenu 2.2',
                                        icon: 'pi pi-fw pi-bookmark',
                                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            ,
            devices: null, deviceloaded: true
        }
    }, beforeMount() {
        this.modelupdate(this.$store.getters.device);
        // console.log(this.$store.getters.device);
        // console.log(this.model);
    },
    computed: {
        count() {
            return this.$store.getters.device; // Getter function
        },
    },
    watch: {
        count(newValue, oldValue) {
            // console.log('Count changed from', oldValue, 'to', newValue);
            // Perform actions when count changes
            this.modelupdate(newValue);
            // console.log(this.model);
        },
    },
    methods: {
        async modelupdate(newDevice) {
            this.deviceloaded = false;
            // console.log(this.$store.getters.device)
            let devicelist = [];
            this.devices = newDevice;
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
                    label: 'Device',
                    icon: 'pi pi-fw pi-home',
                    to: '/device',
                    items: devicelist
                }]
            }];

            if (this.model[0].label === 'My Devices') {
                this.model.shift()
            }
            this.model.unshift(models[0]);
            // console.log(models[0].items[0].items[0]);
            // console.log(models);

            // this.model = models;
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
