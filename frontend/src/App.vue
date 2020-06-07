<template>
  <div id="app">
    <component :is="whichComp" v-model="page"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {
      'Login': () => import('./components/Login'),
      'SignUp': () => import('./components/SignUp'),
      'HelloWorld': () => import('./components/HelloWorld')
    },
    data: function () {
      return {
        islogin: false,
        page: 'p/signup'
      }
    },
    computed: {
      whichComp() {
        switch (this.page) {
          case 'p/':
            return 'HelloWorld';
          case 'p/login':
            return 'Login';
          case 'p/signup':
            return 'SignUp';
          default:
            return 'HelloWorld'; //Nopage
        }
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
