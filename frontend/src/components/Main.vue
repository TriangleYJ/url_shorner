<template>
    <div @keyup.enter="putSURL">
        <h1>Welcome to Shortner!</h1>
        <span>{{email}}</span><button @click="logOut">Log out</button>
        <br>
        <br>
        <div>
            <label>
                <input type="text" v-model="url" placeholder="the original link">
            </label><br>
            <p> ↓ </p>
            <span>{{cur_domain}}</span>
            <label>
                <input type="text" v-model="short" placeholder="a short text what you what">
            </label><br>
        </div>
        <button @click="putSURL">{{cur_id === '' ? "Enroll" : "Edit"}}</button>
        <button @click="editCancel" v-if="cur_id !== ''" >Cancel</button>
        <div>
            <h3> Enrolled Links </h3>
            <ul>
                <li v-for="surl in my_surls" v-bind:key="surl.short">
                    <span style="white-space: nowrap; display: inline-block; width:400px; text-overflow: ellipsis; overflow: hidden;">{{ surl.url }}</span><span> → <a :href="surl.short">{{cur_domain + surl.short}}</a></span>
                    <button v-on:click="editSURL(surl.short, surl.url, surl._id)" style="margin-left: 2rem">Edit</button>
                    <button v-on:click="deleteSURL(surl._id)">Delete</button>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "Main",
        data(){
            return {
                short: '',
                url: '',
                cur_id : '', // '': add, not blank: edit
                email: '',
                cur_domain: 'localhost:8080/',
                my_surls: []
            };
        },
        methods:{
            gotoLogin(){
                this.$emit('set-page', 'p/login');
            },
            putSURL(){
                let url_reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,})/;
                let short_reg = /^[A-Za-z0-9+]*$/;
                if(this.short.match(short_reg) == null){
                    alert("Short text is incorrect : it must contains only alphabets and numbers.");
                    this.short='';
                } else if(this.url.match(url_reg) == null){
                    alert("Link is incorrect : it must contains 'http://' or 'https://'. Just copy your address bar.");
                    this.url = '';
                } else if(this.short.length < 4){
                    alert("Short text must be longer than 4.");
                    this.short = '';
                } else if(this.cur_id === ''){
                    axios.post('http://localhost:5000/surl/add', {
                        short: this.short,
                        url: this.url,
                        author: this.email
                    }).then(result => {
                        let code =result.data.result;
                        if(code === 1){
                            alert("Shorten URL added successively.");
                            this.reloadAll();
                        } else if(code === 0){
                            alert("Shortened text already exists. Please try another shortened text.");
                            this.short='';
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
                            alert("Shorten URL edited successively.");
                            this.reloadAll();
                        } else if(code === 2){
                            alert("Edit failed! Try again please.");
                            this.short='';
                        } else if(code === 0){
                            alert("Shortened text already exists. Please try another shortened text.");
                            this.short='';
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
                                alert("Shorten URL deleted successively.");
                                this.reloadAll();
                            } else if (code === 2) {
                                alert("Delete failed! Try again please.");
                            }
                        }
                    });
                }
            },
            getMySURLs(){
                axios.post('http://localhost:5000/surl/get', {author: this.email}).then(result => {
                    let code =result.data.result;
                    if(code === 1) {
                        this.my_surls = result.data.list;
                    }
                });
            },
            reloadAll(){
                this.short = '';
                this.url = '';
                this.cur_id = '';
                this.my_surls = [];
                this.getMySURLs();
            },
            logOut(){
                this.$store.dispatch('LOGOUT').then(() => this.gotoLogin());
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
                })
        }

    }
</script>

<style scoped>

</style>