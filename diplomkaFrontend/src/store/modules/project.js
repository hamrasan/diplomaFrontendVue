import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            project: null,
            roles: []
        };
    },
    mutations: {
        setProject(state, project) {
            state.project = project;
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
        saveReservation(context, {reservations, projectId}) {
             axios.post("http://localhost:8080/project/reservation/" + projectId, {
                reservations: reservations
            },{withCredentials: true});
        },
    }
}