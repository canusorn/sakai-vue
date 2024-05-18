import { createStore } from 'vuex';

import requestsModule from './modules/requests/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
  modules: {
    requests: requestsModule,
    auth: authModule
  }
});

export default store;