<template>
    <div class="d-flex justify-content-between">
        <div class="col-2"></div>
        <div class="col-4">
            <h2 class="col text-center">{{this.team.name}}</h2>
        </div>
            <div class="mb-3">
                <button class="ml-2 rounded border yellowColor text-dark px-3 py-2" @click="modalOpen('add')">+ Přidat člena</button>
                <button class="ml-2 rounded border yellowColor text-dark px-3 py-2" @click="modalOpen('delete')">- Odebrat člena</button>
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

    <h4 class="col text-center mt-5">Volné zdroje</h4>
    <ul class="list-group mt-3" v-for="user in this.team.users">
        <li class="list-group-item d-flex justify-content-center">

            <div class="accordion pt-2" id="accordionPanelsStayOpen">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="togleOpen('hash', user.id)" aria-expanded="false" :aria-controls="togleOpen(null, user.id)">
                            {{user.firstName}} {{user.lastName}}
                        </button>
                    </h2>
                    <div :id="togleOpen(null, user.id)" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                        <div class="accordion-body">
                            <div v-for="release in this.releases">
                                <span class="text-danger">{{release.name}}</span>
                                <span> ({{format_date(release.releaseStartDate)}} - {{format_date(release.releaseEndDate)}})</span>
                                <span> -> {{getFreeMdOfUser(user, release, release.maxMd * user.availability / 100)}} volných z {{release.maxMd * user.availability / 100}} MD </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </ul>

    <h4 class="col text-center mt-5">Budoucí alokace členů</h4>
    <table class="table table-bordered">
        <thead class="thead-dark yellowColor">
        <tr>
            <th scope="col">Jméno</th>
            <th scope="col">Man-days</th>
            <th scope="col">Projekt</th>
            <th scope="col">Datum alokace</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="allocation in teamAllocations">
            <td>{{allocation?.assigned?.firstName + " " + allocation?.assigned?.lastName}}</td>
            <td>{{allocation?.md}}</td>
            <td>{{ findProject(allocation.projectId)}} </td>
            <td>{{format_date(allocation?.startDate)}}-{{format_date(allocation?.endDate)}}</td>
        </tr>
        </tbody>
    </table>

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
            teamAllocations(){
                return this.$store.state.team.teamAllocations;
            },
            freeTeamMembers(){
                return this.$store.state.team.freeTeamMembers;
            },
            projects() {
                return this.$store.state.project.projects;
            },
            releases() {
                return this.$store.state.project.allReleases;
            }
        },
        created(){
            this.$store.dispatch("team/getTeam", this.id);
            this.$store.dispatch("team/getFreeTeamMembers", this.id);
            this.$store.dispatch("team/getTeamAllocations", this.id);
            this.$store.dispatch("project/fetchAllReleases");
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
            findProject(id) {
                return this.projects.filter( project => project.id === id).map(project => project.name)[0];
            },
            togleOpen(hash, id){
                if(hash != null) return "#op" + id;
                else return "op" + id;
            },
            getFreeMdOfUser(user, release, allMd){
                let count = 0;
                this.teamAllocations.filter(teamAllocation => teamAllocation.assigned.id === user.id && teamAllocation.startDate === release.releaseStartDate && teamAllocation.endDate === release.releaseEndDate)
                    .forEach(ta => {
                    count += ta.md;
                });
                if(allMd - count < 0) return 0;
                return allMd - count;
            }
        },
    }
</script>