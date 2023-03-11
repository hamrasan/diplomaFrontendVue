<script>
import Menu from "./Menu.vue";

export default {
    components: {
        Menu,
    },
    computed: {
        csrfToken() {
            return document.querySelector("meta[name=_csrf]").content;
        },
        currentUser() {
            return this.$store.state.auth.user;
        }
    }
}
</script>

<template>
    <header>
        <nav class="navbar fixed-top navbar-expand navbar-dark bg-dark">
            <a class="navbar-brand mx-3" href="/">
                <span> Reiffeisen Bank app</span>
            </a>
            <Menu/>
        </nav>
    </header>
</template>