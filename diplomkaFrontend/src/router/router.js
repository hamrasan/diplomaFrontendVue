import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import TeamsView from '../views/TeamsView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import ManagerProjectsView from '../views/ManagerProjectsView.vue';
import EmployeesView from '../views/EmployeesView.vue';
import EmployeeDetail from '../components/EmployeeDetail.vue';
import Detail from '../components/Detail.vue';
import TeamDetail from '../components/TeamDetail.vue';

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
            path: '/my-projects',
            name: 'managerProjects',
            component: ManagerProjectsView,
            meta: {isLogged: true, hasRoleTeamLeader: true}
        },
        {
            path: '/my-teams',
            name: 'teams',
            component: TeamsView,
            meta: {isLogged: true, hasRoleTeamLeader: true}
        },
        {
            path: '/detail-team/:id',
            name: 'detailTeam',
            component: TeamDetail,
            meta: {isLogged: true, hasRoleTeamLeader: true},
            props: true
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
        const cookie = document.cookie.split("; ").some((item) => item.trim().startsWith("JSESSIONID"));
        if (store.getters.isLogged() !== to.meta.isLogged && !cookie ) {
            return {
                name: 'home',
                replace: true
            }
        }
    }
    if(to.meta.hasRoleProjectManager != null){
        if (store.getters.hasRoleProjectManager() !== to.meta.hasRoleProjectManager) {
            return {
                name: 'home',
                replace: true
            }
        }
    }
    if(to.meta.hasRoleTeamLeader != null){
        if (store.getters.hasRoleTeamLeader() !== to.meta.hasRoleTeamLeader) {
            return {
                name: 'home',
                replace: true
            }
        }
    }
});

export default router;
