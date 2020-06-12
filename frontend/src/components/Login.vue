<template>
    <div @keyup.enter="login(email, password)" class="container">
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
        <md-card>
            <md-card-header>
                <div class="md-title">Login</div>
            </md-card-header>
            <md-card-content>
                <form>
                    <md-field>
                        <label>Email</label>
                        <md-input type="text" v-model="email" @click="wrong=false"/>
                    </md-field>
                    <md-field>
                        <label>Password</label>
                        <md-input type="password" v-model="password" @click="wrong=false"/>
                    </md-field>
                    <span class="md-stepper-error" v-if="wrong">Wrong ID or password. please check again.</span>
                    <md-card-actions>
                        <md-button @click="login(email, password)"  class="md-primary">Login</md-button>
                    </md-card-actions>
                </form>

            </md-card-content>
        </md-card>
        <div class="mt-20"></div>
        <p>If you don't have an account, please register first.</p>
        <md-button @click="gotoSignUp">Go to SignUp</md-button>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data() {
            return{
                email:'',
                password:'',
                wrong: false
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
                            this.wrong = true;
                            this.email='';
                            this.password='';
                        }
                    })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .md-card {
        width: 360px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
    .container{
        text-align: center;
        margin: 60px;
    }
    .mt-20{
        margin-top: 20px
    }
    p{
        font-size: 13px;
    }
    .md-stepper-error{
        color: red;
    }

</style>