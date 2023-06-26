<template>
    Release:
    <select v-model="this.releaseName">
        <option v-for="item in releases" :value="item">{{item}}</option>
    </select>
    Tým:
    <select v-model="this.team">
        <option v-for="team in teamsList" :value="team">{{team.name}}</option>
    </select>
    <div v-for="array in rolesMd">
        <Bar
                id="bar"
                :options="chartOptions"
                :data="getChartData(this.releaseName, array)"
        />
    </div>
    <!--    <Bar-->
    <!--            id="my-chart-id"-->
    <!--            :options="chartOptions"-->
    <!--            :data="getChartData(this.releaseName)"-->
    <!--    />-->
</template>

<script>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

    export default {
        name: 'BarChartTeam',
        components: { Bar },
        data() {
            return {
                chartOptions: {
                    responsive: true,
                },
                releaseName: "",
                team: null,
                arrays: []
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user;
            },
            teamsList() {
                let teams = this.$store.state.team.teams;
                if(this.team === null || this.team === undefined) this.team = teams[0];
                return teams;
            },
            releases() {
                let releases  = this.$store.state.project.allReleases.map(release => release.name);
                let teams = this.$store.state.team.teams;
                if(this.team === null || this.team === undefined) this.team = teams[0];
                if(this.releaseName === "" || this.releaseName === undefined) this.releaseName = releases[0];
                if(this.releaseName !== "" && this.releaseName !== undefined && this.team !== null && this.team !== undefined){
                    console.log(this.releaseName);
                    console.log(this.team);
                    this.$store.dispatch("team/getRolesAndMDTeam", {releaseName: this.releaseName, teamId: this.team.id});
                }
                return releases;
            },
            rolesMd() {
                this.arrays = [];
                let roles = this.$store.state.team.rolesMdTeam.filter(role => role.maxMd > 0);
                let j = 25;
                if(roles.length < 25) j = roles.length;
                for (let i = 0; i < roles.length; i += j) {
                    let chunk = roles.slice(i, i + j);
                    this.arrays.push(chunk);
                }
                return this.arrays;
            },
        },
        created() {
            this.$store.dispatch("project/fetchAllReleases");
            if(this.user){
                if(this.user.teamRole.name === 'Team Leader'){
                    this.$store.dispatch("team/fetchTeamsByLeader", this.user.id);
                }
                else if(this.user.teamRole.name === 'System Administrator'){
                    this.$store.dispatch("team/fetchAll");
                }
            }
        },
        watch: {
            releaseName(newVal, oldVal){
                this.$store.dispatch("team/getRolesAndMDTeam", {releaseName: newVal, teamId: this.team.id});
                this.arrays = [];
            },
            team(newVal, oldVal){
                this.$store.dispatch("team/getRolesAndMDTeam", {releaseName: this.releaseName, teamId: newVal.id});
                this.arrays = [];
            }
        },
        methods: {
            getChartData(releaseName, array){
                return {
                    labels: array.map(role => role.teamRoleName),
                    datasets: [{
                        label: "Obsazenost v man-days",
                        data: array.map(role => role.md),
                        backgroundColor: '#fee600',
                    },
                        {
                            label: 'Max man-days',
                            data: array.map(role => role.maxMd)
                        }]
                };
            },
        }
    }
</script>