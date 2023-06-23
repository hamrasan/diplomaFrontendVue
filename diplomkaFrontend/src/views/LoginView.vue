<template>
    <div className="login">
            <form class="d-flex flex-column container">
                <div class="form-group justify-content-center">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Email" v-model="email">
                </div>
                <div class="form-group pt-2 justify-content-center align-items-center">
                    <label for="password">Heslo</label>
                    <input type="password" class="form-control" id="password" placeholder="Heslo" v-model="password">
                </div>
                <div v-if="badCredentials" class="align-items-center text-danger">
                   Zadali jste špatné jméno nebo heslo.
                </div>
                <div class="mt-4 align-items-center">
                    <button type="button" class="btn btn-primary bg-dark" @click="login">Přihlásit</button>
                </div>
            </form>
    </div>
</template>

<script>
    import router from "../router/router";

    export default {
        name: "LoginView",
        data() {
            return {
                email: null,
                password: null,
                badCredentials: false,
            };
        },
        methods: {
            login(){
                this.$store.dispatch('login', {email: this.email, password: this.password});
                const user =  this.$store.state.auth.user;
                this.badCredentials = !user;
            }
        }
    }
</script>

