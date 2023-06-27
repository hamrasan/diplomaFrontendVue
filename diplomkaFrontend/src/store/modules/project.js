import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            projects: [],
            roles: [],
            projectDetail: null,
            sourceAllocations: [],
            managerProjects: [],
            historyAllocations: [],
            allReleases: []
        };
    },
    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },
        setManagerProjects(state, projects) {
            state.managerProjects = projects;
        },
        setRoles(state, roles){
            state.roles = roles;
        },
        setProjectDetail(state, projectDetail) {
            state.projectDetail = projectDetail;
        },
        setSourceAllocations(state, sourceAllocations) {
            state.sourceAllocations = sourceAllocations;
        },
        setHistoryAllocations(state, sourceAllocations) {
            state.historyAllocations = sourceAllocations;
        },
        setAllReleases(state, allReleases) {
            state.allReleases = allReleases;
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
        async fetchAllReleases(context) {
            const releases = await axios.get("http://localhost:8080/project/releases/all", {withCredentials: true});
            context.commit("setAllReleases", releases.data);
        },
        async fetchManagerProjects(context, userId) {
            const projects = await axios.get("http://localhost:8080/project/all/" + userId, {withCredentials: true});
            context.commit("setManagerProjects", projects.data);
        },
        async fetchAllocations(context, userId) {
            const myAllocations = await axios.get("http://localhost:8080/project/sourceAllocations/" + userId, {withCredentials: true});
            context.commit("setSourceAllocations", myAllocations.data);
        },
        async fetchAllAllocations(context) {
            const myAllocations = await axios.get("http://localhost:8080/project/sourceAllocations", {withCredentials: true});
            context.commit("setSourceAllocations", myAllocations.data);
        },
        async fetchHistoryAllocations(context) {
            const allocations = await axios.get("http://localhost:8080/project/sourceAllocations/history", {withCredentials: true});
            context.commit("setHistoryAllocations", allocations.data);
        },
        async updateReservation(context, {reservations, projectId, releaseId, allocationId}) {
             const project = await axios.post("http://localhost:8080/project/reservation/" + projectId, {
                reservations: reservations,
                 releaseId: releaseId,
                 allocationId: allocationId
            },{withCredentials: true});
            context.commit("setProjectDetail", project.data);
        },
        async saveReservationRelease(context, {reservations, projectId, releaseId}) {
            const project = await axios.post("http://localhost:8080/project/reservation/" + projectId + "/release/" + releaseId, {
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
        async refuseAllocation(context, allocationId){
            const allocations = await axios.get("http://localhost:8080/project/sourceAllocation/" + allocationId + "/refuse",{withCredentials: true});
            context.commit("setSourceAllocations", allocations.data);
        },
        async confirmAllocation(context, allocationId){
             const allocations = await axios.get("http://localhost:8080/project/sourceAllocation/" + allocationId + "/confirm",{withCredentials: true});
             context.commit("setSourceAllocations", allocations.data);
             },
        async createProject(context, {name, description, startDate, projectManagerId}){
            const projects = await axios.post("http://localhost:8080/project",{
                name: name,
                description: description,
                startDate: startDate,
                projectManagerId: projectManagerId,
            },{withCredentials: true});
            context.commit("setProjects", projects.data);
        }
    }
}