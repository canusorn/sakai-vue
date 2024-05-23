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
    // const mode = payload.mode;
    let url =
      'http://192.168.0.101:3000/api/login';

    // if (mode === 'signup') {
    //   url =
    //     'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBvOcmh_Avvu08bFdUHdmJzA06c6vV4h0E';
    // }
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
    console.log(responseData);

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      console.log(error);
      throw error;
    }
    // const expiresIn = +responseData.expiresIn * 1000;
    // const expiresIn = 5000;
    // const expirationDate = new Date().getTime() + expiresIn;
    localStorage.setItem('accessToken', responseData.access_token);
    localStorage.setItem('refreshToken', responseData.refresh_token);
    localStorage.setItem('userId', payload.email);
    // localStorage.setItem('tokenExpiration', expirationDate);

    // timer = setTimeout(function () {
    //   context.dispatch('autoLogout');
    // }, expiresIn);

    context.commit('setUser', {
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      userId: payload.email
    });

    console.log(responseData.refresh_token);
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
  },
  // autoLogout(context) {
  //   context.dispatch('logout');
  //   context.commit('setAutoLogout');
  // }
};
