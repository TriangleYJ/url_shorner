<template>
    <div class="sign-up">
        <h3>회원가입</h3>
        <input type="text" v-model="email" placeholder="email"><br>
        <input type="password" v-model="password" placeholder="password"><br>
        <button>가입하기</button>
        <br>
        <button @click="gotoLogin()" >Go to Login</button>
    </div>
</template>

<script>
    export default {
        name: "SignUp",
        data(){
            return{
            }
        },
        methods:{
            gotoLogin(){
                this.$emit('input', 'p/login');
            },
        },
    }
</script>

<style scoped>
    .sign-up{
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