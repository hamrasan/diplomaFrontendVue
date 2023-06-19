<template>
    <div class="input-group rounded">
        <input type="search" class="form-control rounded" placeholder="Hledat podle zaměstnance..." aria-label="Search"
               aria-describedby="search-addon" v-model="input"/>
    </div>
    <ul class="list-group mt-3" v-for="allocation in filteredList()">
        <li class="list-group-item d-flex justify-content-between" >
            <div class="col-2">{{allocation?.assigned?.firstName + " " + allocation?.assigned?.lastName}}</div>
            <div class="col-1">{{allocation?.md}}MD</div>
            <div class="col-3">{{allocation?.teamRole?.name }}</div>
            <div class="col-4">{{ findProject(allocation.projectId)}} ( {{format_date(allocation?.startDate)}}-{{format_date(allocation?.endDate)}} )</div>
            <div v-if="allocation.status === 'INPROGRESS'" class="col-2 justify-content-end d-flex">
                <button class="rounded border greenColor text-dark" @click="confirm(allocation)">Schválit</button>
                <button class=" rounded border redColor text-dark" @click="refuse(allocation)">Zamítnout</button>
            </div>
        </li>
    </ul>
    <div v-if="this.sourceAllocations.length===0" class="font-weight-bold text-danger d-flex justify-content-center">Nebyly nalezeny žádné alokace na schválení.</div>
</template>

<script>
    import { ref } from "vue";
    import moment from 'moment';
    import project from "../store/modules/project";
    export default {
        name: 'ManagerProjectsView',
        data() {
            return {
                input: "",
            }
        },
        computed: {
            sourceAllocations() {
                return this.$store.state.project.sourceAllocations.filter(allocation => allocation.assigned !== undefined && allocation.status === 'INPROGRESS');
            },
            user() {
               return this.$store.state.auth.user;
            },
            projects() {
                return this.$store.state.project.projects;
            }
        },
        created() {
            if(this.user){
                this.$store.dispatch("project/fetchAllocations", this.user.id);
                this.$store.dispatch("project/fetchProjects");
            }
        },
        watch: {
            input() {
                // const a = this.filteredList();
            }
        },
        methods: {
            toCzStatus(status) {
                switch (status) {
                    case 'CONFIRMED' : {
                        return "Alokace schválená";
                    }
                    case 'INPROGRESS' : {
                        return "Čeká na schválení";
                    }
                    default:
                        return "chyba";
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
            confirm(allocation){
                this.$store.dispatch("project/confirmAllocation", allocation.id);
            },
            refuse(allocation){
                this.$store.dispatch("project/refuseAllocation", allocation.id);
            },
            filteredList() {
                if(this.sourceAllocations != null){
                    return this.sourceAllocations.filter( (allocation) =>
                        allocation.assigned?.firstName.toLowerCase().includes(this.input.toLowerCase()) || allocation.assigned?.lastName.toLowerCase().includes(this.input.toLowerCase())
                    );
                }
                else return [];
            },
            findProject(id) {
                 return this.projects.filter( project => project.id === id).map(project => project.name)[0];
            },
            format_date(value){
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY');
                }
            },
        }
    }
</script>