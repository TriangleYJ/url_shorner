<template>
    <div class="login" @keyup.enter="login(email, password)">
        <h3>Login</h3>
        <label>
            <input type="text" v-model="email" placeholder="email"/>
        </label> <br>
        <label>
            <input type="password" v-model="password" placeholder="password"/>
        </label> <br>
        <button @click="login(email, password)" >로그인</button>
        <p>If you don't have an account, please register first.</p>
        <button @click="gotoSignUp">Go to SignUp</button>
    </div>
</template>

<script>

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
            gotoMain(){
                this.$emit('set-page', 'p/main');
            },
            login(email, password){
                this.$store.dispatch('LOGIN', {email, password})
                    .then( result => {
                        if(result === 1) this.gotoMain();
                        else if(result === 0){
                            alert("Wrong ID or password. please check again.");
                            this.email='';
                            this.password='';
                        }
                    })
            },
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