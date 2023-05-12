import { createApp } from 'vue'

import 'bootstrap';
import App from './App.vue';
import router from './router/router.js';
import store from './store/index.js';
import VueAxios from 'vue-axios';
import axios from "axios";
import VueCookies from 'vue3-cookies';

import './scss/styles.scss'

axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const app = createApp(App);

app.use(store);
app.use(VueAxios, axios);
app.use(VueCookies, {
    expireTimes: "30d",
    path: "/",
    domain: "",
    secure: true,
    sameSite: "None"
});
app.use({
    install(app){
        app.config.globalProperties.$auth = {
            hasAnyRole(role) {
                return app.config.globalProperties.$store.getters.hasAnyRole(role);
            },
            isLogged() {
                return app.config.globalProperties.$store.getters.isLogged();
            },
            hasLoginCookies() {
                return document.cookie.split("; ").some((item) => item.trim().startsWith("JSESSIONID"));
            }
        }
    }
});
app.use(router);

app.mount('#app');

window.store = store;
