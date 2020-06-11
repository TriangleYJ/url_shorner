<template>
    <div class="sign-up" @keyup.enter="signUp">
        <h3>Sign Up</h3>
        <label>
            <input type="text" v-model="email" placeholder="email">
        </label><br>
        <label>
            <input type="password" v-model="password" placeholder="password">
        </label><br>
        <label>
            <input type="password" v-model="password_ckeck" placeholder="re-enter password">
        </label><br>
        <button @click="signUp" >Register</button>
        <br>
        <button @click="gotoLogin" >Go to Login</button>
    </div>

</template>

<script>
    import axios from 'axios'

    export default {
        name: "SignUp",
        data(){
            return{
                email: '',
                password: '',
                password_ckeck: ''
            }
        },
        methods:{
            gotoLogin(){
                this.$emit('set-page', 'p/login');
            },
            signUp(){
                const regex_pw = /^[A-Za-z0-9!@#$%^&+=]{8,}$/;
                const regex_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

                if(this.email.match(regex_email) == null || this.password.match(regex_pw) == null){
                    alert("Please enter the correct email or password (at least 8 length, english and number only).");
                    if(this.email.match(regex_email) == null) this.email = '';
                    if(this.password.match(regex_pw) == null){
                        this.password = '';
                        this.password_ckeck = '';
                    }
                } else if(this.password !== this.password_ckeck){
                    alert("password is not correct! Please check again.");
                    this.password = '';
                    this.password_ckeck = '';
                } else {
                    axios.post('http://localhost:5000/signup', {id: this.email, pw: this.password}).then(result => {
                        let code =result.data.result;
                        if (code === 1) {
                            alert("Successively registered. Please login again.");
                            this.gotoLogin();
                        } else if(code === 0) {
                            alert("The email already exists! Please try another email or login with the email.");
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