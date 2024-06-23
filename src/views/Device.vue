<script>
import OverviewChart from '@/components/OverviewChart.vue';
import ValueDisplay from '@/components/ValueDisplay.vue';
import store from '@/store/index.js';
import mqtt from 'mqtt';

export default {
    components: { OverviewChart, ValueDisplay },
    beforeRouteLeave() {
        this.destroyConnection();
    },
    data() {
        return {
            espid: null,
            loaded: false,
            chartData: 0,
            varAmount: 0,
            msg: {},
            connection: {
                protocol: 'ws',
                host: '192.168.0.101',
                // ws: 8083; wss: 8084
                port: 8888,
                // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
                clean: true,
                connectTimeout: 30 * 1000, // ms
                reconnectPeriod: 4000, // ms
                clientId: this.espid,
                // auth
                username: store.getters.userId,
                password: store.getters.mqttPass
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
            retryTimes: 0
        };
    },
    methods: {
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
                    console.log('object size : ' + size);

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

                    this.chartData = dataout;
                    // console.log(this.chartData);
                    this.loaded = true;
                })
                .catch((err) => {
                    console.log('error occured', err);
                });
        },
        initData() {
            this.client = {
                connected: false
            };
            this.retryTimes = 0;
            this.connecting = false;
            this.subscribeSuccess = false;
            this.subscription.topic = '/' + this.espid + '/#';
            this.publish.topic = '/' + this.espid + '/';
            this.connection.clientId = 'web-' + this.espid;
        },
        handleOnReConnect() {
            this.retryTimes += 1;
            if (this.retryTimes > 5) {
                try {
                    this.client.end();
                    this.initData();
                    this.$message.error('Connection maxReconnectTimes limit, stop retry');
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
                        console.log('Connection succeeded!');
                    });
                    this.client.on('reconnect', this.handleOnReConnect);
                    this.client.on('error', (error) => {
                        console.log('Connection failed', error);
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

                        console.log(`Received message ${message} from topic ${topic}`);
                        // console.log(this.chartData.datasets);
                    });
                }
            } catch (error) {
                this.connecting = false;
                console.log('mqtt.connect error', error);
            }
        },
        doSubscribe() {
            const { topic, qos } = this.subscription;
            this.client.subscribe(topic, { qos }, (error, res) => {
                if (error) {
                    console.log('Subscribe to topics error', error);
                    return;
                }
                this.subscribeSuccess = true;
                console.log('Subscribe to topics res', res);
            });
        },
        doUnSubscribe() {
            const { topic } = this.subscription;
            this.client.unsubscribe(topic, (error) => {
                if (error) {
                    console.log('Unsubscribe error', error);
                }
            });
        },
        doPublish() {
            const { topic, qos, payload } = this.publish;
            this.client.publish(topic, payload, { qos }, (error) => {
                if (error) {
                    console.log('Publish error', error);
                }
            });
        },
        destroyConnection() {
            if (this.client.connected) {
                try {
                    this.client.end(false, () => {
                        this.initData();
                        console.log('Successfully disconnected!');
                    });
                } catch (error) {
                    console.log('Disconnect failed', error.toString());
                }
            }
        }
    },
    mounted() {
        this.espid = this.$route.params.espId;
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
};
</script>

<template>
    <!-- <div class="container-fluid"> -->
    <div class="grid">
        <div class="col-12">
            <div class="grid" v-if="loaded">
                <div class="col-12 md:col-4 lg:col-2" v-for="varNo in varAmount">
                    <ValueDisplay :label="this.chartData.datasets[varNo - 1].label"
                        :value="Object.values(this.msg)[varNo - 1]"></ValueDisplay>
                </div>
            </div>
        </div>

        <div class="col-12 lg:col-6" v-if="loaded" v-for="varNo in varAmount">
            <div class="card shadow-2">
                <h5>{{ this.chartData.datasets[varNo - 1].label }}</h5>
                <OverviewChart :chart-data-variable="this.chartData.datasets[varNo - 1]"
                    :chart-data-label="this.chartData.labels"
                    :new-var="{ value: Object.values(this.msg)[varNo - 1], label: new Date() }" />
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>

<style scoped>
.card {
    padding: 1rem;
}
</style>
