export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        });
    },
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        });
    },
    async auth(context, payload) {
        const mode = payload.mode;
        let url = context.getters.serverURL + '/api/auth/login';

        if (mode === 'signup') {
            url = context.getters.serverURL + '/api/auth/signup';
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: payload.email,
                password: payload.password
            })
        });

        const responseData = await response.json();
        // console.log(responseData);

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            console.log(error);
            throw error;
        }

        localStorage.setItem('accessToken', responseData.access_token);
        localStorage.setItem('refreshToken', responseData.refresh_token);
        localStorage.setItem('userId', payload.email);

        context.commit('setUser', {
            accessToken: responseData.access_token,
            refreshToken: responseData.refresh_token,
            userId: payload.email
        });
    },
    tryLogin(context) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');

        if (accessToken && refreshToken && userId) {
            context.commit('setUser', {
                accessToken: accessToken,
                refreshToken: refreshToken,
                userId: userId
            });
        }
    },
    logout(context) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');

        context.commit('setUser', {
            accessToken: null,
            refreshToken: null,
            userId: null
        });
    }
};
