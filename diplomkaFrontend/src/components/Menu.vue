<template>
    <div class="container">
        <div class="m-auto">
            <div class="dropdown min navbar-nav">
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
                        <router-link v-if="isLogged" to="/resource-view" class="nav-link"><span>Pohled manažera</span></router-link>
                        <router-link v-if="isLogged" to="/projects" class="nav-link dropdown-item bg-dark"><span>Projekty</span></router-link>
                        <router-link v-if="isTeamLeader" to="/my-projects" class="nav-link dropdown-item bg-dark"><span>Alokace na projekty</span></router-link>
                        <router-link v-if="isTeamLeader" to="/my-teams" class="nav-link dropdown-item bg-dark"><span>Moje tými</span></router-link>
                        <router-link v-if="isTeamLeader || isProjectManager" to="/history" class="nav-link dropdown-item bg-dark"><span>Historie alokací</span></router-link>
                        <router-link v-if="!isLogged" to="/login" class="nav-link dropdown-item bg-dark"><span>Přihlášení</span></router-link>
                        <a v-if="isLogged" class="nav-link dropdown-item bg-dark" @click="logout"><span>Odhlášení</span></a>
                        <router-link  v-if="isLogged" to="/about" class="nav-link dropdown-item bg-dark"><span>Profil</span></router-link>
                    </li>
                </ul>
            </div>

            <ul class="navbar-nav">

                <li class="nav-item" v-if="isLogged">
                    <router-link to="/employees" class="nav-link"><span>Zaměstnanci</span></router-link>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <router-link to="/resource-view" class="nav-link"><span>Pohled manažera</span></router-link>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <router-link to="/projects" class="nav-link"><span>Projekty</span></router-link>
                </li>
                <li class="nav-item" v-if="isTeamLeader">
                    <router-link to="/my-projects" class="nav-link"><span>Alokace na projekty</span></router-link>
                </li>
                <li class="nav-item" v-if="isTeamLeader">
                    <router-link to="/my-teams" class="nav-link"><span>Moje tými</span></router-link>
                </li>
                <li class="nav-item" v-if="isTeamLeader || isProjectManager">
                    <router-link to="/history" class="nav-link"><span>Historie alokací</span></router-link>
                </li>
                <li class="nav-item" v-if="!isLogged">
                    <router-link to="/login" class="nav-link"><span>Přihlášení</span></router-link>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <a class="nav-link" @click="logout"><span>Odhlášení</span></a>
                </li>
                <li class="nav-item" v-if="isLogged">
                    <router-link to="/about" class="nav-link"><span>Profil</span></router-link>
                </li>
<!--                <button-->
<!--                        class="btn dropdown-toggle"-->
<!--                        type="button" id="notification"-->
<!--                        data-bs-toggle="dropdown"-->
<!--                        aria-expanded="false">-->
<!--                    <Notification></Notification>-->
<!--                </button>-->
                <li class="nav-item" v-if="isLogged">
                    <div class="dropdown navbar-nav">
                        <button
                                class="btn"
                                type="button" id="dropdownMenuButtonBell"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                            <notification-bell
                                    :size="28"
                                    :count=this.notifications.length
                                    :ding="true"
                                    :upperLimit="50"
                                    counterLocation="upperRight"
                                    counterStyle="roundRectangle"
                                    counterBackgroundColor="#FF0000"
                                    counterTextColor="#ffffff"
                                    iconColor="#ffffff"
                            />
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonBell" role="menu">
                            <li :key="notification.id" v-for="notification in this.notifications">

                                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                    <div class="toast-header">
                                        <strong class="me-auto">Notifikace</strong>
                                        <small>{{notification.date}}</small>
                                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" @click="readNotification(notification)"></button>
                                    </div>
                                    <div class="toast-body">
                                        {{notification.message}}
                                    </div>
                                </div>

                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Hamburger from './icons/Hamburger.vue';
    import Notification from './icons/Notification.vue';
    import NotificationBell from './NotificationBell.vue';

    export default {
        name: "Menu",
        components: {
            Hamburger, Notification, NotificationBell
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
            },
            notifications() {
                return this.$store.getters.notifications();
            }
        },
        methods: {
            logout(){
                this.$store.dispatch("logout");
            },
            readNotification(notification) {
                this.$store.dispatch("readNotification", notification.id);
            }
        }
    }
</script>