export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.accessToken;
  },
  isAuthenticated(state) {
    return !!state.accessToken;
  },
  didAutoLogout(state) {
    return state.didAutoLogout;
  }
};