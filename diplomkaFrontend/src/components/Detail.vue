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
    <div class="d-flex justify-content-center" v-if="this.project.allocationDto">
        <div>
            <h5 class="col">{{format_date(this.project.allocationDto.reservationDate)}}</h5>
        </div>
    </div>
    <h4 v-if="this.project.allocationDto == null" class="text-danger d-flex justify-content-center"> Rezervace zdrojů nebyla vytvořena</h4>
    <div class="d-flex justify-content-center" v-if="this.project.allocationDto == null ">
        <button class="mt-4 rounded border py-2 yellowColor text-dark col-1" @click="modalOpen('rezervace')">
            Vytvořit rezervaci
        </button>
    </div>
    <div class="d-flex justify-content-center" v-if="this.project.allocationDto != null && this.project.allocationDto.status === 'ESTABLISHED'">
        <button class="mt-4 rounded border py-2 yellowColor text-dark col-1" @click="modalOpen('alokace')">
            Vytvořit alokaci
        </button>
    </div>
    <DynamicInput v-if="isModalOpen" :isModalOpen="isModalOpen" :project="project" :name="modal" @close="isModalOpen = false"/>
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
            }
        },
        computed: {
            project(){
               return this.$store.state.project.projectDetail;
            }
        },
        created(){
            this.$store.dispatch("project/getProject", this.id);
        },
        methods: {
            modalOpen(name) {
                this.modal = name;
                this.isModalOpen = true;
            },
            toCzStatus(status) {
                switch (status) {
                    case 'ESTABLISHED' : {
                        return "Rezervováno - připravené pro alokaci zdrojů";
                    }
                    case 'ALLOCATED' : {
                        return "Alokovaná";
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