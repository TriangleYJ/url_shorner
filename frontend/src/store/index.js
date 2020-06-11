// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
//login auth form from http://jeonghwan-kim.github.io/2018/03/26/vue-authentication.html

const resourceHost = 'http://localhost:5000';

const enhanceAccessToeken = () => {
    const {accessToken} = localStorage;
    if (!accessToken) return;
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};
enhanceAccessToeken();

export default new Vuex.Store({
    state: {
        accessToken: null
    },
    getters: {

    },
    mutations: {
        LOGIN (state, accessToken) {
            state.accessToken = accessToken;
            localStorage.accessToken = accessToken;
        },
        LOGOUT (state) {
            state.accessToken = null;
            delete localStorage.accessToken;
        }
    },
    actions: {
        LOGIN ({commit}, {email, password}) {
            return axios.post(`${resourceHost}/login`, {id: email, pw: password})
                .then(result => {
                    let code =result.data.result;
                    if( code === 1 ){
                        commit('LOGIN', result.data.token);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
                    }
                    return code;

                });
        },
        LOGOUT ({commit}) {
            axios.defaults.headers.common['Authorization'] = undefined;
            commit('LOGOUT')
        },
    }
})