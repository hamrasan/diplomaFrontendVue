import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            teams: [],
            teamDetail: null,
            usersModal: [],
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
        },
    }
}