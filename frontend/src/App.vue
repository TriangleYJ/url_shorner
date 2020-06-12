<template>
    <div id="app">
        <component :is="whichComp" @set-page="setPage"/>
    </div>
</template>

<script>
    import axios from "axios";
    import Vue from 'vue'
    import {MdCard, MdField, MdButton} from 'vue-material/dist/components'
    import 'vue-material/dist/vue-material.min.css'
    import 'vue-material/dist/theme/default.css'

    Vue.use(MdCard);
    Vue.use(MdField);
    Vue.use(MdButton);


    export default {
        name: 'App',
        components: {
            'Login': () => import('./components/Login'),
            'SignUp': () => import('./components/SignUp'),
            'Page404': () => import('./components/Page404'),
            'Main': () => import('./components/Main'),
        },
        data: function () {
            return {
                islogin: false,
                page: 'p/main'
            }
        },
        methods: {
            setPage(new_page) {
                this.page = new_page;
            }
        },
        computed: {
            whichComp() {
                switch (this.page) {
                    case 'p/login':
                        return 'Login';
                    case 'p/signup':
                        return 'SignUp';
                    case 'p/main':
                        return 'Main';
                    default:
                        return 'Page404'; //Nopage
                }
            }
        },
        created() {
            let cur_route = window.location.pathname;
            //Redirect part
            if (cur_route !== "/") {
                window.document.body.innerHTML = "Connecting.. Please wait...";
                axios.get('http://localhost:5000/surl' + cur_route).then(result => {
                    let code = result.data.result;
                    if (code === 1) window.location.href = result.data.url;
                    else if (code === 0) {
                        alert("The link does not exist! Redirect to main page.");
                        window.location.href = "/";
                    }
                });
            }
        }
    };
</script>

<!--<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>-->
