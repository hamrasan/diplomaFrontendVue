import axios from "axios";

export default {
    state() {
        return {
            user: null
        };
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        }
    },
    getters: {
        hasAnyRole: state => (role) => {
            if(state.user?.role == null)
                return false;

            if(typeof role === "string")
                return state.user?.role === role;

            return false;
        }
    },
    actions: {
        async fetchCurrentUser(context) {
            const user = await axios.get("http://localhost:8080/user");

            context.commit("setUser", user.data);
        }
    }
}