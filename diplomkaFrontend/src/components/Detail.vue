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
<!--    <div class="d-flex justify-content-center" v-if="this.project.allocationDto">-->
<!--        <div>-->
<!--            <h5 class="col">{{format_date(this.project.allocationDto.reservationDate)}}</h5>-->
<!--        </div>-->
<!--    </div>-->

    <h4 v-if="this.project.allocationDto == null" class="text-danger d-flex justify-content-center"> Rezervace zdrojů nebyla vytvořena</h4>
    <div class="d-flex justify-content-center" v-if="this.project.allocationDto == null ">
        <button class="mt-4 rounded border py-2 yellowColor text-dark col-1" @click="modalOpen('rezervace', null)">
            Vytvořit rezervaci
        </button>
    </div>
    <div class="d-flex justify-content-center" v-if="this.project.allocationDto != null && this.project.allocationDto.status === 'ESTABLISHED' && this.isProjectManager">
        <button class="mt-4 rounded border py-2 yellowColor text-dark col-1" @click="modalOpen('alokace', null)">
            Vytvořit alokaci
        </button>
    </div>

    <div v-if="this.project.allocationDto != null && this.project.allocationDto.status !== 'ESTABLISHED'">
        <div class="d-flex align-items-center flex-column alert alert-dark mt-4" v-if="this.project.allocationDto.sourceAllocations">
            <div class="font-weight-bold">ALOKACE ZDROJŮ:</div>
            <ul v-for="source in this.project.allocationDto.sourceAllocations">
                <li>{{source.md + "MD - " + source.assigned.firstName + " " + source.assigned.lastName + " ( " + source.teamRole.name + " ) - "}} <span class="text-danger">{{toCzStatus(source.status)}} </span></li>
            </ul>
        </div>
    </div>

    <div class="d-flex justify-content-center flex-column mt-4" v-if="this.project.releases">
        <div class="font-weight-bold">Releasy v projektu:</div>
        <div v-for="release in this.project.releases" class="border border-2 rounded">
            <span class="font-weight-bold mt-1">{{release.name}}</span> <span>{{format_date(release.releaseStartDate)}}-{{format_date(release.releaseEndDate)}}</span>

            <div v-if="release.allocationDto == null">
                <button class="rounded border py-1 yellowColor text-dark col-1" @click="modalOpen('rezervace', release)">
                    Vytvořit rezervaci
                </button>
            </div>
            <div v-if="release.allocationDto && release.allocationDto.status === 'ESTABLISHED' && this.isProjectManager">
                <button class="rounded border py-1 yellowColor text-dark col-1" @click="modalOpen('alokace', release)">
                    Vytvořit alokaci
                </button>
            </div>
        </div>
    </div>
    <DynamicInput v-if="isModalOpen" :isModalOpen="isModalOpen" :project="project" :name="modal" :release="modalRelease" @close="isModalOpen = false"/>
</template>

<script>
    import DynamicInput from "./DynamicInput.vue";
    import moment from 'moment';
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
            toCzStatus(status) {
                switch (status) {
                    case 'ESTABLISHED' : {
                        return "Rezervováno - připravené pro alokaci zdrojů";
                    }
                    case 'ALLOCATED' : {
                        return "Alokovaná - čeká na schválení zdrojů";
                    }
                    case 'CONFIRMED' : {
                        return "Alokace schválená";
                    }
                    case 'DENINED' : {
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
        }
    }
</script>