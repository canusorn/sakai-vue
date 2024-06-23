import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
    state() {
        return {
            device: [{ espid: 7884150, name: 'device-7884150' },{ espid: 7884150, name: 'device-7884150' }],
        };
    },
    mutations,
    actions,
    getters
};
