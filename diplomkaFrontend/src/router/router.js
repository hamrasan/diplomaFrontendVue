import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import EmployeesView from '../views/EmployeesView.vue';
import EmployeeDetail from '../components/EmployeeDetail.vue';
import Detail from '../components/Detail.vue';

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
            path: '/employees',
            name: 'employees',
            component: EmployeesView,
            meta: {isLogged: true}
        },
        {
            path: '/employees/about/:id',
            name: 'employeeDetail',
            component: EmployeeDetail,
            meta: {isLogged: true},
            props: true
        },
        {
            path: '/projects',
            name: 'projects',
            component: ProjectsView,
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
        {
            path: '/project/detail/:id',
            name: 'detail',
            component: Detail,
            meta: {isLogged: true},
            props: true
        },
    ]
});

router.beforeEach(async (to, from) => {
    if (to.meta.isLogged != null) {
        if (store.getters.isLogged() !== to.meta.isLogged) {
            console.log(store.getters.isLogged());
            return {
                name: 'home',
                replace: true
            }
        }
    }

});

export default router;
