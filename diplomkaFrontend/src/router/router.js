import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const routerHistory = createWebHistory("/");

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: AboutView,
            meta: {isLogged: true}
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {isLogged: false}
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: {isLogged: false}
        },
    ]
});

router.beforeEach(async (to, from) => {
    if (to.meta.isLogged != null) {
        if (store.getters.isLogged() !== to.meta.isLogged) {
            return {
                name: 'home',
                replace: true
            }
        }
    }

});

export default router;
