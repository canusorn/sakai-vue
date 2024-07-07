<template>
    <!-- <div class="container-fluid"> -->
    <div class="grid">

        <div class="col-12 md:col-6">
            <h2>{{ this.thisDeviceInfo.name }}</h2>
        </div>

        <div class="col-12 md:col-6 text-right">
            <div class="mb-3">
                <span class="text-500 mb-2"><b>ID :</b> {{ this.thisDeviceInfo.espid }}</span>
            </div>
            <span class="text-500"><b>Last update :</b> {{ getLastupdate }}</span>
        </div>


        <div class="col-12">
            <TabMenu :model="tabmenu.Items" :activeIndex="activetabindex" />
            <!-- <router-view></router-view> -->
            <!-- <div v-if="this.loaded"> -->
            <device-overview v-if="this.tabmenu.activeTab === 'overview'" :msg="this.msg" :chartData="this.chartData"
                :loaded="this.loaded" :varAmount="this.varAmount"></device-overview>
            <!-- </div> -->
        </div>

    </div>
    <!-- </div> -->
</template>


<script>
import DeviceOverview from '@/views/device/Device.overview.vue';
import TabMenu from 'primevue/tabmenu';
import store from '@/store/index.js';
import mqtt from 'mqtt';
import moment from 'moment';


export default {
    components: { TabMenu, DeviceOverview },
    beforeRouteUpdate(newRoute) {
        if (this.espid == newRoute.params.espId) {
            // console.log("same espId");
            return;
        }
        // console.log(this.espid);
        // console.log(newRoute.params.espId);
        this.doUnSubscribe();
        this.destroyConnection();
        // console.log('beforeRouteUpdate');
        // next();
    },
    beforeRouteLeave() {
        this.doUnSubscribe();
        this.destroyConnection();
        console.log('beforeRouteLeave');
    },
    data() {
        return {
            espid: null,
            loaded: false,
            chartData: 0,
            varAmount: 0,
            msg: {},
            thisDeviceInfo: {},
            lasttimeupdate: null,
            connection: {
                protocol: 'ws',
                host: '192.168.0.101',
                // ws: 8083; wss: 8084
                port: 8888,
                // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
                clean: true,
                connectTimeout: 30 * 1000, // ms
                reconnectPeriod: 10000, // ms
                clientId: 0,
                // auth
                username: store.getters.userId,
                password: store.getters.accessToken
            },
            subscription: {
                topic: '',
                qos: 0
            },
            publish: {
                topic: '',
                qos: 0,
                payload: '{ "msg": "Hello, I am browser." }'
            },
            receiveNews: '',
            qosList: [0, 1, 2],
            client: {
                connected: false
            },
            subscribeSuccess: false,
            connecting: false,
            retryTimes: 0,
            tabmenu: {
                Items: [
                    {
                        label: 'overview',
                        to: '/device/:espId/overview',
                        command: () => this.handleClick("overview")
                    },
                    {
                        label: 'control',
                        to: '/device/:espId/control',
                        command: () => this.handleClick("control")
                    }
                ],
                activeTab: "",
            }
        };
    },
    methods: {
        handleClick(page) {
            // console.log(this.$route.path);
            this.tabmenu.activeTab = page;
            // console.log(this.activeTab);
            this.$router.push("/device/" + this.espid + "/" + this.tabmenu.activeTab);
        },
        initDeviceInfo() {
            this.thisDeviceInfo = this.$store.getters.device.find(id => id.espid == this.espid);
            //    console.dir(thisDeviceInfo.name) 
        },
        initChart() {
            this.loaded = false;

            fetch(store.getters.serverURL + '/api/timedata/' + this.espid + '/getlastdata', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${store.getters.accessToken}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(typeof data)
                    // console.log(data)
                    data.reverse();

                    this.loaded = false;

                    let size = Object.keys(data.at(-1)).length;
                    this.varAmount = size - 2;
                    // console.log('object size : ' + this.varAmount);

                    const dataout = { labels: [], datasets: [] };

                    let labels = [],
                        datasets = [];

                    data.forEach((document) => {
                        for (let i = 1; i <= size - 2; i++) {
                            if (!datasets[i - 1]) {
                                datasets.push({ label: Object.keys(data[0])[i], data: [] });
                            }
                            datasets[i - 1].data.push(Object.values(document)[i]);
                        }
                        labels.push(Object.values(document)[size - 1]);
                    });

                    dataout.labels = labels;
                    dataout.datasets = datasets;

                    this.lasttimeupdate = labels[labels.length - 1];

                    this.chartData = dataout;
                    // console.log(this.chartData.datasets[0].data[this.chartData.datasets[0].data.length - 1]);
                    this.loaded = true;
                })
                .catch((err) => {
                    console.error('\x1b[31merror occured', err);
                });
        },
        initData() {
            this.connection.password = store.getters.accessToken;
            this.client = {
                connected: false
            };
            this.retryTimes = 0;
            this.connecting = false;
            this.subscribeSuccess = false;
            this.subscription.topic = '/' + this.espid + '/#';
            this.publish.topic = '/' + this.espid + '/';
            this.connection.clientId = 'WEB_' + this.espid;
            // console.log(this.espid);
        },
        handleOnReConnect() {
            this.retryTimes += 1;
            if (this.retryTimes > 5) {
                try {
                    this.client.end();
                    this.initData();
                    this.$message.error('\x1b[31mConnection maxReconnectTimes limit, stop retry');
                } catch (error) {
                    this.$message.error(error.toString());
                }
            }
        },
        createConnection() {
            try {
                this.connecting = true;
                const { protocol, host, port, ...options } = this.connection;
                const connectUrl = `${protocol}://${host}:${port}`;
                this.client = mqtt.connect(connectUrl, options);
                if (this.client.on) {
                    this.client.on('connect', () => {
                        this.connecting = false;
                        console.log('\x1b[32mConnection succeeded!');
                    });
                    this.client.on('reconnect', this.handleOnReConnect);
                    this.client.on('error', (error) => {
                        console.error('\x1b[31mConnection failed', error);
                    });
                    this.client.on('message', (topic, message) => {
                        this.receiveNews = this.receiveNews.concat(message);
                        this.msg = JSON.parse(message);

                        // this.isupdate=true;
                        // if (this.loaded) {
                        //     console.log(this.chartData);
                        //     this.chartData.datasets['0'].data.push(this.msg.humid);
                        //     this.chartData.datasets['1'].data.push(this.msg.temp);
                        //     this.chartData.labels.push(String(Date.parse(new Date())));
                        // }
                        this.lasttimeupdate = new Date();
                        console.log(`Received message \x1b[36m ${message} \x1b[0mfrom topic \x1b[4m${topic}`);
                        // console.log(this.chartData.datasets);
                    });
                }
            } catch (error) {
                this.connecting = false;
                console.error('\x1b[31mmqtt.connect error', error);
            }
        },
        doSubscribe() {
            const { topic, qos } = this.subscription;
            this.client.subscribe(topic, { qos }, (error, res) => {
                if (error) {
                    console.error('\x1b[31mSubscribe to topics error', error);
                    return;
                }
                this.subscribeSuccess = true;
                console.log('\x1b[32mSubscribe to topics res', res);
            });
        },
        doUnSubscribe() {
            const { topic } = this.subscription;
            this.client.unsubscribe(topic, (error) => {
                if (error) {
                    console.error('\x1b[31mUnsubscribe error', error);
                }
            });
        },
        doPublish() {
            const { topic, qos, payload } = this.publish;
            this.client.publish(topic, payload, { qos }, (error) => {
                if (error) {
                    console.error('\x1b[31mPublish error', error);
                }
            });
        },
        destroyConnection() {
            // if (this.client.connected) {
            try {
                this.client.end();
            } catch (error) {
                console.error('\x1b[31mDisconnect failed', error.toString());
            }
            // }
        },
        updateChart(updateVar) {
            // console.log(new Date());
            this.chartData = {
                ...this.chartData,
                labels: [...this.chartData.labels, new Date()],
                datasets: [
                    {
                        ...this.chartData.datasets[0],
                        data: (this.chartData.datasets[0].data = [...this.chartData.datasets[0].data, updateVar])
                    }
                ]
            };
        }
    },
    mounted() {
        this.espid = this.$route.params.espId;
        this.tabmenu.activeTab = this.$route.params.page ? this.$route.params.page : 'overview';
        this.initDeviceInfo();
        this.initChart();
        this.initData();
        this.createConnection();
        this.doSubscribe();
    },
    // created() {
    //     this.espid = this.$route.params.espId;
    //     this.subscription.topic = '/' + this.espid + '/data/update';
    //     this.publish.topic = '/' + this.espid + '/';
    //     this.connection.clientId = this.espid + '-web';
    // },
    // watch: {
    //     espid(id){

    //         console.log(this.subscription);
    //     }
    // }
    watch: {
        $route(newRoute) {
            if (this.espid == newRoute.params.espId) {
                if (this.tabmenu.activeTab == 'overview') {
                    this.initChart();
                }
                return;
            }
            this.msg = {};
            this.espid = newRoute.params.espId;
            this.tabmenu.activeTab = this.$route.params.page ? this.$route.params.page : 'overview';
            this.initDeviceInfo();
            this.initChart();
            this.initData();
            this.createConnection();
            this.doSubscribe();
        }
    },
    computed: {
        getLastupdate() {
            if (this.lasttimeupdate) {
                return moment(this.lasttimeupdate).format("YYYY-MM-DD HH:mm:ss");
            } else {
                return "loading...";
            }
        },
        activetabindex() {
            return this.tabmenu.Items.findIndex(e => e.label == this.tabmenu.activeTab);
        }
    }
}
</script>


<style scoped>
.card {
    padding: 1rem;
}
</style>
