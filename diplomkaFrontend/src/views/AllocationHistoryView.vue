<template>
    <div class="input-group rounded mb-2">
        <input type="search" class="form-control rounded" placeholder="Hledat podle zaměstnance..." aria-label="Search"
               aria-describedby="search-addon" v-model="input"/>
    </div>
    <table class="table table-bordered">
        <thead class="thead-dark yellowColor">
        <tr>
            <th scope="col">Datum schválení</th>
            <th scope="col">Jméno</th>
            <th scope="col">Man-days</th>
            <th scope="col">Role</th>
            <th scope="col">Projekt</th>
            <th scope="col">Datum alokace</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="allocation in filteredList()">
            <td>{{format_date(allocation?.confirmOrDenyDate)}}</td>
            <td>{{allocation?.assigned?.firstName + " " + allocation?.assigned?.lastName}}</td>
            <td>{{allocation?.md}}</td>
            <td>{{allocation?.teamRole?.name }}</td>
            <td>{{ findProject(allocation.projectId)}} </td>
            <td>{{format_date(allocation?.startDate)}}-{{format_date(allocation?.endDate)}}</td>
        </tr>
        </tbody>
    </table>

<!--    <ul class="list-group mt-3" v-for="allocation in filteredList()">-->
<!--        <li class="list-group-item d-flex justify-content-between">-->

<!--        </li>-->
<!--    </ul>-->
</template>

<script>
    import { ref } from "vue";
    import moment from 'moment';
    import project from "../store/modules/project";
    export default {
        name: 'AllocationHistoryView',
        data() {
            return {
                input: "",
            }
        },
        computed: {
            sourceAllocations() {
                return this.$store.state.project.historyAllocations;
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
                this.$store.dispatch("project/fetchHistoryAllocations");
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
            filteredList() {
                if(this.sourceAllocations != null){
                    return this.sourceAllocations.filter( (allocation) =>
                        allocation.assigned?.firstName.toLowerCase().includes(this.input.toLowerCase()) || allocation.assigned?.lastName.toLowerCase().includes(this.input.toLowerCase())
                    ).sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(b.confirmOrDenyDate) - new Date(a.confirmOrDenyDate);
                    });
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