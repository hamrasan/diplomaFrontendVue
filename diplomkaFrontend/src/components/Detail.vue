<template>
    <div class="d-flex justify-content-center">
        <div>
            <h2 class="col">{{this.project.name}}</h2>
        </div>
    </div>
    <div class="d-flex justify-content-center">
        <div>
            <h5 class="col">{{this.project.description}}</h5>
        </div>
    </div>
    <div class="d-flex justify-content-center">
        <div>
            <h5 class="col yellowColor p-1">{{toCzPhase(this.project.projectPhase)}}</h5>
        </div>
    </div>
    <div class="progress">
        <div class="progress-bar yellowColor" :style=getProgress(this.project)></div>
    </div>
    <div class="d-flex justify-content-center" v-if="this.project.allocationDto != null">
        <div>
            <h5 class="col">{{toCzStatus(this.project.allocationDto.status)}}</h5>
        </div>
    </div>

    <div class="d-flex justify-content-center flex-column mt-4" v-if="this.project.releases">
        <h3 class="font-weight-bold">Releasy v projektu:</h3>
        <div v-for="release in releasesOrdered(this.project.releases) " class="border border-2 rounded mb-3">
            <div class="text-center mt-1">
                <span class="font-weight-bold mt-1 h5">{{release.name}}</span> <span class="h5">( {{format_date(release.releaseStartDate)}}-{{format_date(release.releaseEndDate)}} )</span>
            </div>

            <div class="text-center alert alert-dark mb-0 mt-1" v-if="release.allocationDto == null && history_date(release.releaseEndDate)">
                Release uplynul
            </div>
            <div class="text-center" v-if=" release.allocationDto == null && !history_date(release.releaseEndDate) && (this.isProjectManager || this.isAdmin)">
                <button class="rounded border py-1 yellowColor text-dark col-1" @click="modalOpen('rezervace', release)">
                    Vytvořit rezervaci
                </button>
            </div>
            <div class="text-center" v-if="release.allocationDto && release.allocationDto.status === 'ESTABLISHED'">
                <button v-if="this.isTeamLeader || this.isAdmin" class="rounded border py-1 yellowColor text-dark col-1" @click="modalOpen('alokace', release)">
                    Vytvořit alokaci
                </button>
                <span v-if="!this.isTeamLeader && !this.isAdmin" class="text-danger"> {{toCzStatus(release.allocationDto.status, format_date(release.allocationDto.reservationDate))}} </span>
                <div>
                    <button v-if="this.isProjectManager || this.isAdmin" class="rounded border py-1 yellowColor text-dark col-1" @click="modalOpen('rezervace', release)">
                        Upravit rezervaci
                    </button>
                </div>
            </div>

            <div v-if="release.allocationDto != null && release.allocationDto.status !== 'ESTABLISHED'">
                <div class="d-flex align-items-center flex-column alert alert-dark mt-1 mb-0" v-if="release.allocationDto.sourceAllocations">
                    <div class="font-weight-bold">ALOKACE ZDROJŮ:</div>
                    <ul v-for="source in release.allocationDto.sourceAllocations">
                        <li>{{source.md + "MD - " + source.assigned.firstName + " " + source.assigned.lastName + " ( " + source.teamRole.name + " ) - "}}
                            <span class="redColor radiusText p-1" v-if="source.status === 'DENIED'"> {{toCzStatus(source.status)}} </span>
                            <span class="lightGreenColor radiusText p-1" v-if="source.status === 'CONFIRMED'"> {{toCzStatus(source.status)}} </span>
                            <span class="yellowColor radiusText p-1" v-if="source.status === 'INPROGRESS'"> {{toCzStatus(source.status)}} </span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
    <DynamicInput v-if="isModalOpen" :isModalOpen="isModalOpen" :project="project" :name="modal" :release="modalRelease" @close="isModalOpen = false"/>
</template>

<script>
    import DynamicInput from "./DynamicInput.vue";
    import moment from 'moment';
    import _ from 'lodash';

    export default {
        name: "Detail",
        components: {DynamicInput},
        props: ['id'],
        data() {
            return{
                isModalOpen: false,
                modal: "",
                modalRelease: null
            }
        },
        computed: {
            project(){
               return this.$store.state.project.projectDetail;
            },
            isProjectManager() {
                return this.$store.getters.hasRoleProjectManager();
            },
            isTeamLeader() {
                return this.$store.getters.hasRoleTeamLeader();
            },
            isAdmin() {
                return this.$store.getters.hasRoleAdmin();
            }
        },
        created(){
            this.$store.dispatch("project/getProject", this.id);
        },
        methods: {
            modalOpen(name, release) {
                this.modal = name;
                this.modalRelease = release;
                this.isModalOpen = true;
            },
            toCzStatus(status, date) {
                switch (status) {
                    case 'ESTABLISHED' : {
                        if(date != null) return "Rezervováno (" + date +") - připravené pro alokaci zdrojů";
                        return "Rezervováno - připravené pro alokaci zdrojů";
                    }
                    case 'ALLOCATED' : {
                        return "Alokovaná - čeká na schválení zdrojů";
                    }
                    case 'CONFIRMED' : {
                        return "Alokace schválená";
                    }
                    case 'DENIED' : {
                        return "Alokace zamítnuta";
                    }
                    case 'INPROGRESS' : {
                        return "Čeká na schválení";
                    }
                    default: return "chyba";
                }
            },
            toCzPhase(phase) {
                switch (phase) {
                    case 'PREPARATION' : {
                        return "Příprava";
                    }
                    case 'REALIZATION' : {
                        return "V realizaci";
                    }
                    case 'CLOSED' : {
                        return "Uzavřený";
                    }
                    default:
                        return "chyba";
                }
            },
            getProgress(project){
                if(project.projectPhase === 'PREPARATION'){
                    return "width:1%";
                }
                else return "width:1%";
            },
            format_date(value){
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY');
                }
            },
            history_date(value){
                if (value) {
                    return moment(String(value)) < moment();
                }
            },
            releasesOrdered(releases) {
                if(releases != null){
                    const sortedArray = _.orderBy(releases, (o) => {
                        return moment(String(o.releaseStartDate)).format('YYYYMMDD');
                    }, ['asc']);
                    return sortedArray;
                    }
                else return [];
            },
        }
    }
</script>