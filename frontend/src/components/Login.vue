<template>
    <div class="login">
        <h3>Login</h3>
        <input type="text" placeholder="email"/> <br>
        <input type="password" placeholder="password"/> <br>
        <button @click="login">로그인</button>
        <p>If you don't have an account, please register first.</p>
        <button @click="gotoSignUp()">Go to SignUp</button>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return{

            }
        },
        methods:{
            gotoSignUp(){
                this.$emit('input', 'p/signup');
            },
            login(){
                this.$emit('input', 'p/');
            }
        },
    }
</script>

<style scoped>
    .login{
        margin-top:40px;
    }
    input {
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }
    button {
        margin-top: 20px;
        width: 10%;
        cursor: pointer;
    }
    p {
        margin-top: 40px;
        font-size: 12px;
    }
    span{
        display: block;
        margin-top: 20px;
        font-size: 15px;
    }

</style>