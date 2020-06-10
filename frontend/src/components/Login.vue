<template>
    <div class="login" @keyup.enter="login">
        <h3>Login</h3>
        <input type="text" v-model="email" placeholder="email"/> <br>
        <input type="password" v-model="password" placeholder="password"/> <br>
        <button @click="login" >로그인</button>
        <p>If you don't have an account, please register first.</p>
        <button @click="gotoSignUp">Go to SignUp</button>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "Login",
        data() {
            return{
                email:'',
                password:'',
            }
        },
        methods:{
            gotoSignUp(){
                this.$emit('set-page', 'p/signup');
            },
            login(){
                axios.post('http://localhost:5000/login', {id: this.email, pw: this.password}).then(result => {
                    let code =result.data.result;
                    if (code === 1) {
                        alert(`성공적으로 로그인 되었습니다. ${result.data.nickname}님 환영합니다!`);
                        this.$emit('set-page', 'p/');
                    } else if(code === 0) {
                        alert("이메일 혹은 비밀번호를 다시 확인해 주십시오.");
                        this.email='';
                        this.password='';
                    } else {
                        alert(`오류가 발생했습니다. 관리자에게 문의해 주십시오. 오류 코드 : ${code} | ${result.status}`);
                    }

                });
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