import axios from "axios";
import router from "../../router/router";

export default {
    namespaced: true,
    state() {
        return {
            teams: [],
            teamDetail: null,
        };
    },
    mutations: {
        setTeams(state, teams) {
            state.teams = teams;
        },
        setTeamDetail(state, teamDetail) {
            state.teamDetail = teamDetail;
        },
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
    }
}