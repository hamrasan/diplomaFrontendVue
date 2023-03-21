<template>
    <div class="d-flex justify-content-center">
        <button class="ml-2 px-3 py-2 rounded border yellowColor text-dark">+ Vytvořit</button>
    </div>
    <ul class="list-group mt-3" v-for="project in projectList">
        <li class="list-group-item d-flex justify-content-between">
            <span>{{project.name}}</span>
            <span >{{toCzPhase(project.projectPhase)}}</span>
            <span></span>
            <router-link :to="{ name: 'detail', params: { id: project.id }, emits: {toCzStatus}}" class="nav-link"><button class="ml-2 rounded border yellowColor text-dark">Detail</button></router-link>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'ProjectsView',
        data() {
            return{

            }
        },
        computed:{
            projectList() {
                return this.$store.state.project.projects;
            },
        },
        created() {
            this.$store.dispatch("project/fetchProjects");
        },
        methods: {
            toCzStatus(status) {
                switch (status) {
                    case 'ESTABLISHED' : {
                        return "Rezervováno";
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
                    default: return "chyba";
                }
            }
        }
    }
</script>