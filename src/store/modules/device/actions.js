export default {
    async getDevice(context) {
        // console.log(context);
        let url = import.meta.env.VITE_SERVERURL + '/api/device/';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${context.rootGetters.accessToken}`
            }
        });

        const responseData = await response.json();
        // console.log(responseData);

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            console.log(error);
            throw error;
        }

        context.commit('setDevice', {
            device: responseData
        });
    },
};
