import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            project: [],
            roles: []
        };
    },
    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },
        setRoles(state, roles){
            state.roles = roles;
        }
    },
    actions: {
         async fetchRoles(context) {
            const roles = await axios.get("http://localhost:8080/project/roles", {withCredentials: true}).catch( function (error){
                    if(error.response){
                        console.log(error.response.data);
                        console.log(error.response.status);
                    }
                    router.push({name: 'login'});
                }
            );
            context.commit("setRoles", roles.data);
        },
        async fetchProjects(context) {
            const projects = await axios.get("http://localhost:8080/project/all", {withCredentials: true});
            context.commit("setProjects", projects.data);
        },
        saveReservation(context, {reservations, projectId}) {
             axios.post("http://localhost:8080/project/reservation/" + projectId, {
                reservations: reservations
            },{withCredentials: true});
        },
    }
}