import axios from "axios";
import router from "../../router/router";

export default {
    state() {
        return {
            user: null,
            badCredentials: false,
        };
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setBadCredentials(state, credentials) {
            state.badCredentials = credentials;
        },
    },
    getters: {
        isLogged: state => () => {
            return state.user != null;
        },
        hasAnyRole: state => (role) => {
            if(state.user?.teamRole == null)
                return false;

            if(typeof role === "string")
                return state.user?.teamRole === role;

            return false;
        },
        hasRoleAdmin: state => () => {
            if(state.user?.teamRole == null)
                return false;

            return state.user?.teamRole.name === "System Administrator";
        },
        hasRoleProjectManager: state => () => {
            if(state.user?.teamRole == null)
                return false;

            return state.user?.teamRole.name === "Change Coordinator - Project Manager";
        },
        hasRoleResourceManager: state => () => {
            if(state.user?.teamRole == null)
                return false;

            return state.user?.teamRole.name === "Resource Manager";
        },
        hasRoleTeamLeader: state => () => {
            if(state.user?.teamRole == null)
                return false;

            return state.user?.teamRole.name === "Team Leader";
        },
        notifications: state => () => {
           return state.user?.notifications.filter(n => n.read === false);
        },
    },
    actions: {
        async fetchCurrentUser(context) {
            const user = await axios.get("http://localhost:8080/user", {withCredentials: true}).catch( function (error){
                if(error.response){
                    console.log(error.response.data);
                    console.log(error.response.status);
                }
                router.push({name: 'login'});
            }
            );
            console.log(user);
            if (user) context.commit("setUser", user.data);
        },
         async login(context, {email, password}) {
             const user = await axios.post("http://localhost:8080/login", {
                 email: email,
                 password: password
             }, {withCredentials: true}).catch(function (error) {
                 context.commit("setBadCredentials", true);
             });

             if (user.data) {
                 context.commit("setUser", user.data);
                 context.commit("setBadCredentials", false);
                 router.push({ name: 'home'})
             }
             else {
                 context.commit("setBadCredentials", true);
             }
         },
        async logout(context) {
            const logout = await axios.post("http://localhost:8080/logout", {},{withCredentials: true});

            document.cookie = "JSESSIONID" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            context.commit("setUser", null);
            await router.push({name: 'login'});
        },
        async readNotification(context, notificationId) {
            const user = await axios.get("http://localhost:8080/user/notification/" + notificationId,{withCredentials: true}).catch( function (error){
                    if(error.response){
                        console.log(error.response.data);
                        console.log(error.response.status);
                    }
                    router.push({name: 'login'});
                }
            );
            if (user) context.commit("setUser", user.data);
        },
    }
}