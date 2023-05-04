<template>
    <div class="container">
        <div class="m-auto">
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
    export default {
        name: "Menu",
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