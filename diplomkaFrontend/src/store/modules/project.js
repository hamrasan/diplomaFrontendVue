import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            projects: [],
            roles: [],
            projectDetail: null
        };
    },
    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },
        setRoles(state, roles){
            state.roles = roles;
        },
        setProjectDetail(state, projectDetail) {
            state.projectDetail = projectDetail;
        },
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
        async saveReservation(context, {reservations, projectId}) {
             const project = await axios.post("http://localhost:8080/project/reservation/" + projectId, {
                reservations: reservations
            },{withCredentials: true});
            context.commit("setProjectDetail", project.data);
        },
        async getProject(context, projectId) {
            const project = await axios.get("http://localhost:8080/project/" + projectId,{withCredentials: true});
            context.commit("setProjectDetail", project.data);
        },
        async saveAllocation(context, {sourceAllocations, projectId}) {
            const project = await axios.post("http://localhost:8080/project/allocation/" + projectId, {
                sourceAllocations: sourceAllocations
            },{withCredentials: true});
            context.commit("setProjectDetail", project.data);
        },
    }
}