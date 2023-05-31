<template>
    <BarChart />
</template>

<script>
    import { ref } from "vue";
    import moment from 'moment';
    import project from "../store/modules/project";
    import BarChart from '../components/BarChart.vue'

    export default {
        name: 'ResourceManagerView',
        components: { BarChart },
        data() {
            return {
                input: "",
            }
        },
        computed: {

        },
        created() {

        },
        watch: {

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