<template>
    <div @keyup.enter="validateUser" class="container">
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
        <md-card>
            <md-card-header>
                <div class="md-title">Sign Up</div>
            </md-card-header>
            <md-card-content>
                <form @submit.prevent="validateUser">
                    <md-field :class="getValidationClass('email')">
                        <label>Email</label>
                        <md-input type="text" v-model="email"/>
                        <span class="md-error" v-if="!this.$v.email.required">Email is required.</span>
                        <span class="md-error" v-else-if="!this.$v.email.email">Invalid email.</span>
                        <span class="md-error" v-else-if="!this.$v.email.email_exist">The email already exists!</span>
                    </md-field>
                    <md-field :class="getValidationClass('password')">
                        <label>Password</label>
                        <md-input type="password" v-model="password"/>
                        <span class="md-error" v-if="!this.$v.password.required">Password is required.</span>
                        <span class="md-error" v-else-if="!this.$v.password.minLength">Invalid password. (It should be at least 8 length)</span>
                    </md-field>
                    <md-field :class="getValidationClass('password_check')">
                        <label>Repeat Password</label>
                        <md-input type="password" v-model="password_check"/>
                        <span class="md-error" v-if="!this.$v.password_check.sameAsPassword">Password must be identical.</span>
                    </md-field>
                    <md-card-actions>
                        <md-button type="submit" class="md-primary">Register</md-button>
                    </md-card-actions>
                </form>
            </md-card-content>
        </md-card>
        <div class="mt-20"></div>
        <md-button @click="gotoLogin" >Go to Login</md-button>
    </div>

</template>

<script>
    import axios from 'axios'
    import {validationMixin} from 'vuelidate'
    import{
        required,
        email,
        minLength,
        sameAs
    } from 'vuelidate/lib/validators'

    export default {
        name: "SignUp",
        mixins: [validationMixin],
        data(){
            return{
                email: '',
                password: '',
                password_check: '',
                disallowed_email: null
            }
        },
        validations: {
            email: {
                required,
                email,
                email_exist: (value, vm) => {
                    if(vm.disallowed_email) return value !== vm.disallowed_email;
                    return true;
                }
            },
            password: {
                required,
                minLength: minLength(8)
            },
            password_check: {
                sameAsPassword: sameAs('password')
                //same: sameAs(this.password, this.password_check)
            }
        },
        methods:{
            gotoLogin(){
                this.$emit('set-page', 'p/login');
            },
            getValidationClass (fieldName) {
                const field = this.$v[fieldName];
                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            validateUser () {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.signUp();
                }
            },
            signUp(){
                axios.post('http://localhost:5000/signup', {id: this.email, pw: this.password}).then(result => {
                    let code =result.data.result;
                    if (code === 1) {
                        this.sendMessage("Successively registered. Please login again.");
                        this.gotoLogin();
                    } else if(code === 0) {
                        this.disallowed_email = this.email;
                    }
                });
            },
            sendMessage(message){
                this.$emit('snack', message);
            }
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

</style>