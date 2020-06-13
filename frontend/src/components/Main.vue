<template>
    <div class="page-container" @keyup.enter="validateSRUL">
        <md-app md-waterfall md-mode="overlap">
            <md-app-toolbar class="md-primary md-large">
                <div class="md-toolbar-row">
                    <span class="md-title">My Shortened Links</span>
                    <div class="md-toolbar-section-end">
                        <span class="md-right">{{email}}</span>
                        <md-button @click="logOut" class="md-icon-button">
                            <md-icon>exit_to_app</md-icon>
                        </md-button>
                    </div>

                </div>
            </md-app-toolbar>
            <md-app-content>
                <div>
                    <h3>Shortened Link {{cur_id !== '' ? "Editor" : "Generator"}}</h3>
                    <MdField :class="getValidationClass('url')">
                        <label>Original link</label>
                        <MdInput v-model="url" placeholder="https://docs.google.com/spreadsheets/d/1HdxeaV7_4_-3ZfRHFJ2LLoAyBV9h-OjR4b/view"/>
                        <span class="md-error" v-if="!this.$v.url.required">Link is required.</span>
                        <span class="md-error" v-else-if="!this.$v.url.regex_match">Invalid Link: Just copy your address bar.</span>
                    </MdField>
                    <MdIcon>arrow_downward</MdIcon>
                    <div>
                        <span>{{cur_domain}}</span>
                        <div class="new-code">
                            <MdField :class="getValidationClass('short')">
                                <label>New code</label>
                                <MdInput v-model="short" placeholder="hello"/>
                                <span class="md-error" v-if="!this.$v.short.required">Code is required.</span>
                                <span class="md-error" v-else-if="!this.$v.short.minLength">It must be longer than 4.</span>
                                <span class="md-error" v-else-if="!this.$v.short.regex_match">Invalid code.</span>
                                <span class="md-error" v-else-if="!this.$v.short.short_exist">Already exists!</span>
                            </MdField>
                        </div>
                    </div>
                    <div>
                        <MdButton class="md-primary md-raised" @click="validateSRUL">{{cur_id === '' ? "Add" : "Edit"}}</MdButton>
                        <MdButton class="md-accent md-raised" @click="editCancel" v-if="cur_id !== ''">Cancel</MdButton>
                    </div>
                </div>
                <div class="mt-20"></div>
                <MdDivider/>
                <div>
                    <md-empty-state v-if="showblank"
                            md-icon="link"
                            md-label="Create your first Shortened Link!"
                            md-description="Creating shortened link, you'll be able to access and memorize your link more easily."
                            class="md-primary">
                    </md-empty-state>
                    <md-list v-for="surl in my_surls" v-bind:key="surl.short" class="md-double-line">
                        <md-list-item v-if="!showblank">
                            <div class="md-list-item-text">
                                <a :href="surl.short">{{cur_domain + surl.short}}</a>
                                <span class = "md-list-item-text long-url">{{surl.url}}</span>
                            </div>
                            <md-button class="md-icon-button md-list-action" v-on:click="editSURL(surl.short, surl.url, surl._id)">
                                <md-icon>edit</md-icon>
                            </md-button>
                            <md-button class="md-icon-button md-list-action" v-on:click="deleteSURL(surl._id)">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </md-list-item>
                    </md-list>
                </div>
            </md-app-content>
        </md-app>
    </div>
</template>

<style lang="scss" scoped>
    .md-app {
        max-height: 100vh;
        border: 1px solid rgba(#000, .12);
        text-align: center;

    }

    .md-app-content{
        max-width: 700px;
        width: 70%;
        display: inline-block;
        text-align: center;
    }

    .toolbar-content{
        padding: 20px;
        max-width: 600px;
        margin-bottom: 40px;
        display: inline-block;
    }
    .new-code{
        width: 150px;
        display: inline-block;
    }

    .mt-20{
        margin-top: 20px;
    }

    .long-url{
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        display: inline-block;
        max-width: 100%;
    }



</style>

<script>
    import axios from 'axios'
    import {validationMixin} from 'vuelidate'
    import{
        required,
        minLength,
    } from 'vuelidate/lib/validators'

    export default {
        name: "Main",
        mixins: [validationMixin],
        data(){
            return {
                short: '',
                url: '',
                cur_id : '', // '': add, not blank: edit
                email: '',
                cur_domain: 'localhost:8080/',
                my_surls: [],
                showblank: false,
                disallowed_code: '',
            };
        },
        validations: {
            short:{
                required,
                minLength: minLength(4),
                regex_match: value => value.match(/^[A-Za-z0-9+]*$/) !== null,
                short_exist: (value, vm) => {
                    if(vm.disallowed_code) return value !== vm.disallowed_code;
                    return true;
                }
            },
            url:{
                required,
                regex_match: value => value.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,})/) !== null
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
            validateSRUL () {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.putSURL();
                }
            },
            putSURL(){
                if(this.cur_id === ''){
                    axios.post('http://localhost:5000/surl/add', {
                        short: this.short,
                        url: this.url,
                        author: this.email
                    }).then(result => {
                        let code =result.data.result;
                        if(code === 1){
                            this.sendMessage("Shorten URL added successively.");
                            this.reloadAll();
                        } else if(code === 0){
                            this.disallowed_code = this.short;
                        }
                    });
                } else {
                    axios.put('http://localhost:5000/surl/edit', {
                        short: this.short,
                        url: this.url,
                        author: this.email,
                        _id: this.cur_id
                    }).then(result => {
                        let code = result.data.result;
                        if(code === 1){
                            this.sendMessage("Shorten URL edited successively.");
                            this.reloadAll();
                        } else if(code === 2){
                            this.sendMessage("Edit failed! Try again please.");
                            this.short='';
                        } else if(code === 0){
                            this.disallowed_code = this.short;
                        }
                    });
                }
            },
            editCancel(){
                this.cur_id = '';
                this.short = '';
                this.url = '';
            },
            editSURL(short, url, id){
                this.cur_id = id;
                this.short = short;
                this.url = url;
            },
            deleteSURL(id){
                if(confirm("Do you want to delete this item?")) {
                    axios.delete('http://localhost:5000/surl/delete/' + id).then(result => {
                        let code = result.data.result;
                        if (code === 1) {
                            this.my_surls = result.data.list;
                            if (code === 1) {
                                this.reloadAll();
                                this.sendMessage("Shorten URL deleted successively.");
                            } else if (code === 2) {
                                this.sendMessage("Delete failed! Try again please.");
                            }
                        }
                    });
                }
            },
            getMySURLs(){
                axios.post('http://localhost:5000/surl/get', {author: this.email}).then(result => {
                    let code =result.data.result;
                    if(code === 1) {
                        this.showblank = result.data.list.length === 0;
                        this.my_surls = result.data.list;
                    }
                });
            },
            reloadAll(){
                //window.location.reload();
                this.short = '';
                this.url = '';
                this.cur_id = '';
                this.my_surls = [];
                this.disallowed_code = '';
                this.getMySURLs();
                this.$v.$reset();
            },
            logOut(){
                this.$store.dispatch('LOGOUT').then(() => this.gotoLogin());
            },
            sendMessage(message){
                this.$emit('snack', message);
            }
        },
        created() {
            axios.get('http://localhost:5000/main/check')
                .then(result => {
                    let code = result.data.result;
                    if(code !== 1) this.gotoLogin();
                    else {
                        axios.get('http://localhost:5000/main')
                            .then(result => {
                                let code = result.data.result;
                                if (code === 1) {
                                    this.email = result.data.logger.id;
                                    this.getMySURLs();
                                }
                            })
                    }
                });

        },

    }
</script>