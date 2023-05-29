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
    import {Axios as axios} from "axios";
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
            },
            notAvailabilities() {
                return this.$store.state.team.actualMds;
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
                count += this.countHolidaysAndIllness(user, release);
                if(allMd - count < 0) return 0;
                return allMd - count;
            },
            countHolidaysAndIllness(user, release){
                let releaseStartDate = new Date(release.releaseStartDate);
                let releaseEndDate = new Date(release.releaseEndDate);
                let count = 0;
                let filteredHolidays;
                if(user.userHoliday){

                    filteredHolidays = user.userHoliday.filter(holiday =>  new Date(holiday.from) >= releaseStartDate && new Date(holiday.from) <= releaseEndDate)
                        .filter(holiday => new Date(holiday.to) <= releaseEndDate && new Date(holiday.to) >= releaseStartDate);
                    filteredHolidays.forEach(holiday => {
                        count +=  this.countMd(new Date(holiday.from), new Date(holiday.to));
                        }
                    );

                }
                if (user.userIllness){
                    user.userIllness.filter(illness =>  new Date(illness.from) >= releaseStartDate && new Date(illness.from) <= releaseEndDate)
                        .filter(illness => new Date(illness.to) <= releaseEndDate && new Date(illness.to) >= releaseStartDate)
                        .forEach(illness => {
                        count += this.countMd(new Date(illness.from), new Date(illness.to));
                        const md = this.countMdSameAsHoliday(filteredHolidays, new Date(illness.from), new Date(illness.to));
                        count -= md;
                        }
                    );
                }
                return count;
            },
            countMd(startDate, endDate) {
                let count = 0;
                const curDate = new Date(startDate.getTime());
                while (curDate <= endDate) {
                    const dayOfWeek = curDate.getDay();
                    if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
                    curDate.setDate(curDate.getDate() + 1);
                }
                return count;
            },
            //vratim cislo kolko mam odpocitat
            countMdSameAsHoliday(holidays, startDate, endDate){
                let count = 0;
                const countIlMd = this.countMd(startDate, endDate);
                if(holidays != null){
                    holidays.filter(holiday =>  (new Date(holiday.from) <= startDate && new Date(holiday.to) >= startDate) || (new Date(holiday.to) >= startDate &&  new Date(holiday.from) <= endDate) ||
                        (new Date(holiday.from) >= startDate && new Date(holiday.to) <= endDate) || (new Date(holiday.to) <= startDate &&  new Date(holiday.from) >= endDate))
                        .forEach(
                        holiday => {
                            const countHolMd = this.countMd(new Date(holiday.from), new Date(holiday.to));
                            if(new Date(holiday.from) <= startDate && (new Date(holiday.to) >= endDate)){
                                count = countIlMd;
                                return count;
                            }
                            if(new Date(holiday.from) <= startDate && (new Date(holiday.to) <= endDate)){
                                count = this.countMd(startDate, new Date(holiday.to));
                                return count;
                            }
                            if (new Date(holiday.to) >= startDate && (new Date(holiday.from) <= endDate) && (new Date(holiday.from) <= startDate)){
                                count = countIlMd;
                                return count;
                            }
                            if((new Date(holiday.from) >= startDate) && (new Date(holiday.to) <= endDate) ){
                                count = countHolMd;
                                return count;
                            }
                            if((new Date(holiday.from) >= startDate) && (new Date(holiday.to) >= endDate) && (new Date(holiday.from) <= endDate)){
                                count = this.countMd(new Date(holiday.from), endDate);
                                return count;
                            }
                        }
                    )
                }
                return count;
            }
        },
    }
</script>