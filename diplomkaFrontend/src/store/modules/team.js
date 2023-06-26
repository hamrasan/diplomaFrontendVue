import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            teams: [],
            teamDetail: null,
            usersModal: [],
            freeTeamMembers: [],
            teamAllocations: [],
            teamRoles: [],
            rolesMd: [],
            rolesMdTeam: []
        };
    },
    mutations: {
        setTeams(state, teams) {
            state.teams = teams;
        },
        setTeamDetail(state, teamDetail) {
            state.teamDetail = teamDetail;
        },
        setUsersModal(state, usersModal){
            state.usersModal = usersModal;
        },
        setFreeTeamMembers(state, freeTeamMembers){
            state.freeTeamMembers = freeTeamMembers;
        },
        setTeamAllocations(state, teamAllocations){
            state.teamAllocations = teamAllocations;
        },
        setTeamRoles(state, teamRoles){
            state.teamRoles = teamRoles;
        },
        setRolesAndMd(state, rolesMd){
            state.rolesMd = rolesMd;
        },
        setRolesAndMdTeam(state, rolesMdTeam){
            state.rolesMdTeam = rolesMdTeam;
        }
    },
    actions: {
        async fetchAll(context) {
            const teams = await axios.get("http://localhost:8080/team", {withCredentials: true}).catch( function (error){
                    router.push({name: 'login'});
                }
            );
            context.commit("setTeams", teams.data);
        },
        async fetchTeamsByLeader(context, teamLeaderId) {
            const teams = await axios.get("http://localhost:8080/team/leader/" + teamLeaderId, {withCredentials: true}).catch( function (error){
                    router.push({name: 'login'});
                }
            );
            context.commit("setTeams", teams.data);
        },
        async getTeam(context, teamId) {
            const team = await axios.get("http://localhost:8080/team/" + teamId,{withCredentials: true});
            context.commit("setTeamDetail", team.data);
        },
        async addEmployee(context, {employeeId, teamId}) {
            const team = await axios.post("http://localhost:8080/team/" + teamId + "/employee/" + employeeId,{withCredentials: true});
            context.commit("setTeamDetail", team.data);
            await store.dispatch("team/getFreeTeamMembers", teamId);
            await store.dispatch("team/getTeamAllocations", teamId);
        },
        async create(context, {name, teamLeaderId}) {
            const teams = await axios.post("http://localhost:8080/team",{
                name: name,
                teamLeaderId: teamLeaderId,
            },{withCredentials: true});
            context.commit("setTeams", teams.data);
        },
        async fetchUsersWithoutTeam(context, teamId){
            const users = await axios.get("http://localhost:8080/team/" + teamId + "/users/", {withCredentials: true}).catch( function (error){
                }
            );
            context.commit("setUsersModal", users.data);
        },
        async deleteEmployee(context, {employeeId, teamId}) {
            const team = await axios.post("http://localhost:8080/team/" + teamId + "/delete/employee/" + employeeId,{withCredentials: true});
            context.commit("setTeamDetail", team.data);
            await store.dispatch("team/getFreeTeamMembers", teamId);
            await store.dispatch("team/getTeamAllocations", teamId);
        },
        async getFreeTeamMembers(context, teamId) {
            const freeTeamMembers = await axios.get("http://localhost:8080/team/" + teamId + "/free",{withCredentials: true});
            context.commit("setFreeTeamMembers", freeTeamMembers.data);
        },
        async getTeamAllocations(context, teamId) {
            const teamAllocations = await axios.get("http://localhost:8080/team/" + teamId + "/allocations",{withCredentials: true});
            context.commit("setTeamAllocations", teamAllocations.data);
        },
        async getTeamRoles(context) {
            const teamRoles = await axios.get("http://localhost:8080/team/roles",{withCredentials: true});
            context.commit("setTeamRoles", teamRoles.data);
        },
        async getRolesAndMD(context, releaseName) {
            const teamRoles = await axios.get("http://localhost:8080/project/sourceAllocations/resourceManager/"+ releaseName,{withCredentials: true});
            context.commit("setRolesAndMd", teamRoles.data);
        },
        async getRolesAndMDTeam(context, {releaseName, teamId}) {
            const teamRoles = await axios.get("http://localhost:8080/project/resourceManager/"+ teamId + "/release/" +releaseName,{withCredentials: true});
            context.commit("setRolesAndMdTeam", teamRoles.data);
        },

}
}