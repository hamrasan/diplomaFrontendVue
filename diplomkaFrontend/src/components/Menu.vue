<template>
    <div class="container">
        <div class="m-auto">
            <div class="dropdown navbar-nav">
                <button
                        class="btn dropdown-toggle"
                        type="button" id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                    <Hamburger></Hamburger>
                </button>
                <ul class="dropdown-menu pt-0" aria-labelledby="dropdownMenuButton1" role="menu">
                    <li :key="option1">
                        <router-link v-if="isLogged" to="/employees" class="nav-link dropdown-item bg-dark"><span>Zaměstnanci</span></router-link>
                        <router-link v-if="isLogged" to="/projects" class="nav-link dropdown-item bg-dark"><span>Projekty</span></router-link>
                        <router-link v-if="isProjectManager" to="/my-projects" class="nav-link dropdown-item bg-dark"><span>Alokace na projekty</span></router-link>
                        <router-link v-if="isTeamLeader" to="/my-teams" class="nav-link dropdown-item bg-dark"><span>Moje tými</span></router-link>
                        <router-link v-if="!isLogged" to="/login" class="nav-link dropdown-item bg-dark"><span>Přihlášení</span></router-link>
                        <a v-if="isLogged" class="nav-link dropdown-item bg-dark" @click="logout"><span>Odhlášení</span></a>
                        <router-link  v-if="isLogged" to="/about" class="nav-link dropdown-item bg-dark"><span>O mně</span></router-link>
                    </li>
                </ul>
            </div>

            <ul class="navbar-nav">

                <li class="nav-item" v-if="isLogged">
                    <router-link to="/employees" class="nav-link"><span>Zaměstnanci</span></router-link>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <router-link to="/projects" class="nav-link"><span>Projekty</span></router-link>
                </li>
                <li class="nav-item" v-if="isProjectManager">
                    <router-link to="/my-projects" class="nav-link"><span>Alokace na projekty</span></router-link>
                </li>
                <li class="nav-item" v-if="isTeamLeader">
                    <router-link to="/my-teams" class="nav-link"><span>Moje tými</span></router-link>
                </li>
                <li class="nav-item" v-if="!isLogged">
                    <router-link to="/login" class="nav-link"><span>Přihlášení</span></router-link>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <a class="nav-link" @click="logout"><span>Odhlášení</span></a>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <router-link to="/about" class="nav-link"><span>O mně</span></router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Hamburger from './icons/Hamburger.vue';
    export default {
        name: "Menu",
        components: {
            Hamburger
        },
        computed: {
            isLogged() {
                return this.$store.getters.isLogged();
            },
            isProjectManager() {
                return this.$store.getters.hasRoleProjectManager();
            },
            isTeamLeader() {
                return this.$store.getters.hasRoleTeamLeader();
            }
        },
        methods: {
            logout(){
                this.$store.dispatch("logout");
            }
        }
    }
</script>