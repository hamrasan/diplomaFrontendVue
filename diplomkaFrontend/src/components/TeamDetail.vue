<template>
    <div class="d-flex justify-content-center">
        <div>
            <h2 class="col">{{this.team.name}}</h2>
        </div>
    </div>
    <ul class="list-group mt-3" v-for="user in this.team.users">
        <li class="list-group-item d-flex justify-content-between">
            <span>{{user.firstName}} {{user.lastName}}</span>
            <span>{{user.skillset}} - {{user.teamRole.name}}</span>
            <router-link :to="{ name: 'employeeDetail', params: { id: user.id }}" class="nav-link">
                <button class="ml-2 rounded border yellowColor text-dark">Zobrazit víc</button>
            </router-link>
        </li>
    </ul>
</template>

<script>
    import DynamicInput from "./DynamicInput.vue";
    import moment from 'moment';
    export default {
        name: "TeamDetail",
        components: {DynamicInput},
        props: ['id'],
        data() {
            return{
                isModalOpen: false,
                modal: "",
            }
        },
        computed: {
            team(){
                return this.$store.state.team.teamDetail;
            },
        },
        created(){
            this.$store.dispatch("team/getTeam", this.id);
        },
        methods: {
            modalOpen(name) {
                this.modal = name;
                this.isModalOpen = true;
            },
            format_date(value){
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY');
                }
            },
        }
    }
</script>