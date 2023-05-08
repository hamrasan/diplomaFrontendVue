<template>
    <div class="d-flex justify-content-between">
        <div class="col-2"></div>
        <div class="col-4">
            <h2 class="col text-center">{{this.team.name}}</h2>
        </div>
            <div class="mb-3">
                <button class="ml-2 rounded border yellowColor text-dark px-3 py-2" @click="modalOpen('add')">+ Přidat člena</button>
                <button class="ml-2 rounded border yellowColor text-dark px-3 py-2" @click="modalOpen('delete')">+ Odebrat člena</button>
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
    <AddDeleteMemberModal v-if="isModalOpen" :isModalOpen="isModalOpen" :team="this.team" @close="isModalOpen = false" :action="this.action"/>
</template>

<script>
    import moment from 'moment';
    import AddDeleteMemberModal from "./AddDeleteMemberModal.vue";
    export default {
        name: "TeamDetail",
        components: {AddDeleteMemberModal},
        props: ['id'],
        data() {
            return{
                isModalOpen: false,
                action: "add",
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
                this.action = name;
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