<template>
  <div id="app">
    <component :is="whichComp" @set-page="setPage"/>
  </div>
</template>

<script>
  import axios from "axios";
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
    methods:{
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
      if(cur_route !== "/"){
        window.document.body.innerHTML = "현재 접속 중입니다.. 잠시만 기다려 주세요.";
        axios.get('http://localhost:5000/surl' + cur_route).then(result => {
          let code =result.data.result;
          if(code === 1) window.location.href = result.data.url;
          else if(code === 0){
            alert("해당 주소는 존재하지 않습니다! 메인 페이지로 이동합니다.");
            window.location.href = "/";
          }
        });
      }
    }
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
