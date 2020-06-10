<template>
    <div class="sign-up">
        <h3>회원가입</h3>
        <input type="text" v-model="email" placeholder="email"><br>
        <input type="password" v-model="password" placeholder="password"><br>
        <button @click="signUp()">가입하기</button>
        <br>
        <button @click="gotoLogin()" >Go to Login</button>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SignUp",
        data(){
            return{
                email: '',
                password: ''
            }
        },
        methods:{
            gotoLogin(){
                this.$emit('input', 'p/login');
            },
            signUp(){
                const regex_pw = /^[A-Za-z0-9!@#$%^&+=]{8,}$/;
                const regex_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

                if(this.email.match(regex_email) == null || this.password.match(regex_pw) == null){
                    alert("올바른 이메일 또는 패스워드(최소 8자, 영문+숫자)를 입력해 주십시오.")
                } else {
                    axios.post('http://localhost:5000/signup', {id: this.email, pw: this.password}).then(result => {
                        let code =result.data.result;
                        if (code === 1) {
                            alert("성공적으로 회원가입이 완료되었습니다. 다시 로그인해주세요,");
                            this.gotoLogin();
                        } else if(code === 0) {
                            alert("이미 존재하는 이메일입니다.");
                        } else {
                            alert(`오류가 발생했습니다. 관리자에게 문의해 주십시오. 오류 코드 : ${code} | ${result.status}`);
                        }

                    });
                }
            }
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