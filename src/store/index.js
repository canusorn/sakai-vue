import { createStore } from 'vuex';

import devicesModule from './modules/device/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
    modules: {
        device: devicesModule,
        auth: authModule
    }
});

export default store;
