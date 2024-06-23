import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
    state() {
        return {
            accessToken: null,
            refreshToken: null,
            userId: null,
            serverURL: 'http://192.168.0.101:3000',
            mqttPass: 'iotbundleclient'
        };
    },
    mutations,
    actions,
    getters
};
