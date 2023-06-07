<template>
    <BarChartTeam />
</template>

<script>
    import { ref } from "vue";
    import moment from 'moment';
    import project from "../store/modules/project";
    import BarChartTeam from '../components/BarChartTeam.vue'

    export default {
        name: 'TeamLeaderView',
        components: { BarChartTeam },
        data() {
            return {
                input: "",
            }
        },
        methods: {
            format_date(value){
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY');
                }
            },
        }
    }
</script>