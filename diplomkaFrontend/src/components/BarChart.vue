<template>
    Release:
    <select v-model="this.releaseName">
        <option v-for="item in releases" :value="item">{{item}}</option>
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
        name: 'BarChart',
        components: { Bar },
        data() {
            return {
                chartOptions: {
                    responsive: true,
                },
                releaseName: "",
                arrays: []
            }
        },
        computed: {
            rolesMd() {
                this.arrays = [];
                let roles = this.$store.state.team.rolesMd;
                let j = 25;
                if(roles.length < 25) j = roles.length;
                for (let i = 0; i < roles.length; i += j) {
                    let chunk = roles.slice(i, i + j);
                    this.arrays.push(chunk);
                }
                return this.arrays;
            },
            releases() {
                let releases  = this.$store.state.project.allReleases.map(release => release.name);
                if(this.releaseName === "" || this.releaseName === undefined) this.releaseName = releases[0];
                this.$store.dispatch("team/getRolesAndMD", this.releaseName);
                return releases;
            },
        },
        created() {
            this.$store.dispatch("project/fetchAllReleases");
        },
        watch: {
            releaseName(newVal, oldVal){
                this.$store.dispatch("team/getRolesAndMD", newVal);
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