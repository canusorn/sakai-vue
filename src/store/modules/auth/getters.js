export default {
    userId(state) {
        return state.userId;
    },
    accessToken(state) {
        return state.accessToken;
    },
    refreshToken(state) {
        return state.refreshToken;
    },
    isAuthenticated(state) {
        return !!state.accessToken;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    },
    serverURL(state) {
        return state.serverURL;
    },
    mqttPass(state){
        return state.mqttPass;
    }
};
