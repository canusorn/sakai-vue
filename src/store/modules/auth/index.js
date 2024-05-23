import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      accessToken: null,
      refreshToken: null,
      userId: null
    };
  },
  mutations,
  actions,
  getters
};