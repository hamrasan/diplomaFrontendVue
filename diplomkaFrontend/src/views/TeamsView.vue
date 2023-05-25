<template>
    <div class="d-flex justify-content-center">
        <button class="ml-2 px-3 py-2 mb-2 rounded border yellowColor text-dark" @click="modalOpen()">+ Vytvořit tým</button>
    </div>
    <div class="input-group rounded">
        <input type="search" class="form-control rounded" placeholder="Hledat tým..." aria-label="Search"
               aria-describedby="search-addon" v-model="input"/>
    </div>
    <ul class="list-group mt-3" v-for="team in filteredList()">
        <li class="list-group-item d-flex justify-content-between">
            <span>{{team.name}}</span>
            <router-link :to="{ name: 'detailTeam', params: { id: team.id }}" class="nav-link">
                <button class="ml-2 rounded border yellowColor text-dark">Detail</button>
            </router-link>
        </li>
    </ul>
    <CreateTeamModal v-if="isModalOpen" :isModalOpen="isModalOpen" :user="this.user" @close="isModalOpen = false" />
</template>

<script>
    import { ref } from "vue";
    import CreateTeamModal from "../components/CreateTeamModal.vue";
    export default {
        name: 'TeamsView',
        components: {CreateTeamModal},
        data() {
            return {
                input: "",
                isModalOpen: false,
            }
        },
        computed: {
            teamsList() {
                return this.$store.state.team.teams;
            },
            user() {
                return this.$store.state.auth.user;
            },
        },
        created() {
            if(this.user){
                if(this.user.teamRole.name === 'Team Leader'){
                    this.$store.dispatch("team/fetchTeamsByLeader", this.user.id);
                }
            }
        },
        methods: {
            filteredList() {
                if(this.teamsList != null){
                    return this.teamsList.filter( (team) =>
                        team.name.toLowerCase().includes(this.input.toLowerCase())
                    );
                }
                else return [];
            },
            modalOpen() {
                this.isModalOpen = true;
            }
        }
    }
</script>