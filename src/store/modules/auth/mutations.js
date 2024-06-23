export default {
    setUser(state, payload) {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.userId = payload.userId;
    }
    // setAutoLogout(state) {
    //   state.didAutoLogout = true;
    // }
};
