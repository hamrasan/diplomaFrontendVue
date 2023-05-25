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
        }
    },
    actions: {
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
    }
}